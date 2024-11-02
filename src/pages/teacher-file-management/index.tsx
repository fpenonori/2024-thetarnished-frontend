import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import StudentAccessPopup from './StudentAccessPopup';
import { MainContainer, FixedTitleContainer, ScrollableCardsContainer, CardsContainer, Card, CardHeader, CardBody, DownloadButton, LoadingOverlay, DeleteButton, Container, ButtonContainer } from './components';
import { Message } from '../../components/message/components';
import { useAuth } from '../../auth/useAuth';

interface Subject {
    subject_id: string;
    subjectname: string;
}

interface File {
    fileid: string;
    filename: string;
    filepath: string;
    upload_date: string;
    subject: Subject;
}

interface Student {
    student_id: string;
    name: string;
    email: string;
}

interface StudentWithAccess extends Student {
    hasAccess: boolean;
}

const TeacherFileManagement = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [eligibleStudents, setEligibleStudents] = useState<Student[]>([]);
    const [grantedStudentIds, setGrantedStudentIds] = useState<Set<string>>(new Set());
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const URL = import.meta.env.VITE_API_URL;

        useEffect(() => {
        const fetchFiles = async () => {
            setErrorMessage(null);
            if (!user?.id) return;
            try {
                const response = await fetch(`${URL}file-access/teacher/${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setFiles(data.files);
                } else {
                    setErrorMessage(data.message);
                }
            } catch (error) {
                setErrorMessage('Error al obtener los archivos');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiles();
    }, [URL, user?.id]);

    const handleDownload = async (fileId: string, filename: string) => {
        try {
            const response = await fetch(`${URL}file/${fileId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacher_id: user?.id }),
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Failed to download file");
            }
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${URL}file/delete-single/${fileId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacher_id: user?.id }),
            });
    
            if (response.ok) {
                setFiles(files.filter(file => file.fileid !== fileId));
            } else {
                console.error("Failed to delete file");
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const openAccessPopup = async (file: File) => {
        setSelectedFile(file);
        setIsLoading(true);
        setIsPopupOpen(true);
    
        try {
            const eligibleResponse = await fetch(`${URL}file-access/eligible-students/${file.fileid}`);
            const eligibleData = await eligibleResponse.json();
    
            // Normalizar los estudiantes elegibles
            setEligibleStudents(eligibleData.students.map((student: any) => ({
                student_id: student.student_id,  
                name: student.fullname,       
                email: student.email,
            })));
    
            const grantedResponse = await fetch(`${URL}file-access/all-students-granted/${file.fileid}`);
            const grantedData = await grantedResponse.json();
    
            setGrantedStudentIds(new Set(grantedData.students.map((s: any) => s.student_id)));
    
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveAccessChanges = async (updatedStudents: StudentWithAccess[]) => {
        console.log("Updated students being sent:", updatedStudents); // Verify data
    
        const studentsToGrant = updatedStudents
            .filter(student => student.hasAccess && !grantedStudentIds.has(student.student_id))
            .map(student => student.student_id);
    
        const studentsToRevoke = updatedStudents
            .filter(student => !student.hasAccess && grantedStudentIds.has(student.student_id))
            .map(student => student.student_id);
    
        console.log("Students to grant:", studentsToGrant);
        console.log("Students to revoke:", studentsToRevoke);
    
        setIsLoading(true);
        try {
            if (studentsToGrant.length > 0) {
                await fetch(`${URL}file-access/grant/${selectedFile?.fileid}`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_ids: studentsToGrant, teacher_id: user?.id }),
                });
            }
            if (studentsToRevoke.length > 0) {
                await fetch(`${URL}file-access/revoke/${selectedFile?.fileid}`, {
                    method: "DELETE",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ student_ids: studentsToRevoke, teacher_id: user?.id }),
                });
            }
        } catch (error) {
            console.error("Error updating student access:", error);
        } finally {
            setIsLoading(false);
            setIsPopupOpen(false);
        }
    };

    return (
        <MainContainer>
            <SideBar />
            <Container>
                <FixedTitleContainer>
                    <h1>Archivos del Profesor</h1>
                    {errorMessage && <Message error>{errorMessage}</Message>}
                </FixedTitleContainer>
                <ScrollableCardsContainer>
                    <CardsContainer>
                        {files.map(file => (
                            <Card key={file.fileid}>
                                <CardHeader>{file.filename}</CardHeader>
                                <CardBody>
                                    <p>Materia: {file.subject.subjectname}</p>
                                    <p>Fecha de carga: {file.upload_date}</p>
                                    <ButtonContainer>
                                        <DownloadButton onClick={() => handleDownload(file.fileid, file.filename)}>
                                            Descargar
                                        </DownloadButton>
                                        <DownloadButton onClick={() => openAccessPopup(file)}>
                                            Manage Access
                                        </DownloadButton>
                                        <DeleteButton onClick={() => handleDelete(file.fileid)}>
                                            Delete
                                        </DeleteButton>
                                    </ButtonContainer>
                                </CardBody>
                            </Card>
                        ))}
                    </CardsContainer>
                </ScrollableCardsContainer>
            </Container>

            {isLoading && <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>}

            <StudentAccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={saveAccessChanges}
                students={eligibleStudents.map((student): StudentWithAccess => ({
                    ...student,
                    hasAccess: grantedStudentIds.has(student.student_id),
                }))}
            />
        </MainContainer>
    );
};

export default TeacherFileManagement;
