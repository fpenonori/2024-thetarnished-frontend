import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import StudentAccessPopup from './StudentAccessPopup';
import FileUploadPopup from './UploadFilePopup';
import { MainContainer, FixedTitleContainer, ScrollableCardsContainer, CardsContainer, Card, CardHeader, CardBody, DownloadButton, LoadingOverlay, DeleteButton, Container, ButtonContainer, UploadButton } from './components';
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
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [eligibleStudents, setEligibleStudents] = useState<Student[]>([]);
    const [grantedStudentIds, setGrantedStudentIds] = useState<Set<string>>(new Set());
    const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
    const [isAccessPopupOpen, setIsAccessPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFilesAndSubjects = async () => {
            try {
                setIsLoading(true);
                const [filesResponse, subjectsResponse] = await Promise.all([
                    fetch(`${URL}file-access/teacher/${user?.id}`),
                    fetch(`${URL}teachers/subjects/${user?.id}`)
                ]);

                const filesData = await filesResponse.json();
                const subjectsData = await subjectsResponse.json();

                if (filesResponse.ok) setFiles(filesData.files);
                if (subjectsResponse.ok) setSubjects(subjectsData);
            } catch (error) {
                console.error("Error fetching files or subjects", error);
                setErrorMessage('Error fetching data');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) fetchFilesAndSubjects();
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
        setIsAccessPopupOpen(true);

        try {
            const eligibleResponse = await fetch(`${URL}file-access/eligible-students/${file.fileid}`);
            const eligibleData = await eligibleResponse.json();

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
        const studentsToGrant = updatedStudents
            .filter(student => student.hasAccess && !grantedStudentIds.has(student.student_id))
            .map(student => student.student_id);

        const studentsToRevoke = updatedStudents
            .filter(student => !student.hasAccess && grantedStudentIds.has(student.student_id))
            .map(student => student.student_id);

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
            setIsAccessPopupOpen(false);
        }
    };

    const handleUpload = async (file: File, customName: string, subjectId: string) => {
        if (!file || !subjectId) {
          console.error("File or subject is missing");
          return;
        }

        console.log("File:", file);
        console.log("Subject ID:", subjectId);
        console.log("Custom Name:", customName);
        console.log("User ID:", user?.id);
        const formData = new FormData();
        formData.append("file", file); // `file` should be a `Blob` or `File` object
        formData.append("teacher_id", user?.id); // Assuming `user.id` is the teacher's ID
        formData.append("subject_id", subjectId);
      
        try {
          const response = await fetch(`${URL}file/upload-single`, {
            method: "POST",
            body: formData,
          });
      
          const data = await response.json();
          if (response.ok) {
            console.log("File uploaded successfully:", data.file);
            // Update the UI or state with the new file data
          } else {
            console.error("File upload failed:", data.message || data.error);
          }
        } catch (error) {
          console.error("Error during file upload:", error);
        }
      };

    return (
        <MainContainer>
            <SideBar />
            <Container>
                <FixedTitleContainer>
                    <h1>Archivos del Profesor</h1>
                    <UploadButton onClick={() => setIsUploadPopupOpen(true)}>Upload New File</UploadButton>
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

            <FileUploadPopup 
                isOpen={isUploadPopupOpen}
                onClose={() => setIsUploadPopupOpen(false)}
                onUpload={handleUpload}
                subjects={subjects}
            />

            <StudentAccessPopup
                isOpen={isAccessPopupOpen}
                onClose={() => setIsAccessPopupOpen(false)}
                onSave={saveAccessChanges}
                students={eligibleStudents.map((student): StudentWithAccess => ({
                    ...student,
                    hasAccess: grantedStudentIds.has(student.student_id),
                }))}
            />

            {isLoading && <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>}
            {errorMessage && <Message error>{errorMessage}</Message>}
        </MainContainer>
    );
};

export default TeacherFileManagement;
