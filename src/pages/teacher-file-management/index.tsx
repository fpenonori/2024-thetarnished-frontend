import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import StudentAccessPopup from './StudentAccessPopup';
import FileUploadPopup from './UploadFilePopup';
import { MainContainer, FixedTitleContainer, ScrollableCardsContainer, CardsContainer, Card, CardHeader, CardBody, LoadingOverlay, Container, ButtonContainer } from './components';
import { Message } from '../../components/message/components';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/main-button/components';


interface Subject {
    subjectid: string;
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
    const [subjects, setSubjects] = useState<{ subject_id: string; subjectname: string }[]>([]);
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
                    fetch(`${URL}file-access/teacher/${user?.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`
                        }
                    }),
                    fetch(`${URL}teachers/subjects/${user?.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`
                        }
                    })
                ]);

                const filesData = await filesResponse.json();
                const subjectsData = await subjectsResponse.json();

                if (filesResponse.ok) setFiles(filesData.files);
                if (subjectsResponse.ok) setSubjects(subjectsData.map((subject: any) => ({
                    subjectid: subject.subjectid,
                    subjectname: subject.subjectname
                })));
                console.log(subjects);
            } catch (error) {
                console.error("Error fetching files or subjects", error);
                setErrorMessage('Error fetching data');
                setTimeout(() => setErrorMessage(null), 2000);
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
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
            } else if (response.status === 404) {
                setErrorMessage('File not found');
                setTimeout(() => setErrorMessage(null), 2000);
            } else if (response.status === 401) {
                setErrorMessage('Unauthorized file access');
                setTimeout(() => setErrorMessage(null), 2000);
            }
            else if (response.status === 500) {
                setErrorMessage('Internal server error');
                setTimeout(() => setErrorMessage(null), 2000);
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
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify({ teacher_id: user?.id }),
            });

            if (response.ok) {
                setFiles(files.filter(file => file.fileid !== fileId));
            }
            else if (response.status === 404) {
                setErrorMessage('File not found');
                setTimeout(() => setErrorMessage(null), 2000);
            }
            else if (response.status === 401) {
                setErrorMessage('Unauthorized file access');
                setTimeout(() => setErrorMessage(null), 2000);
            }
            else if (response.status === 500) {
                setErrorMessage("Internal server error");
                setTimeout(() => setErrorMessage(null), 2000);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAccessPopup = async (file: File) => {
        setSelectedFile(file);
        setIsAccessPopupOpen(true);

        try {
            const eligibleResponse = await fetch(`${URL}file-access/eligible-students/${file.fileid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const eligibleData = await eligibleResponse.json();

            setEligibleStudents(eligibleData.students.map((student: any) => ({
                student_id: student.student_id,
                name: student.fullname,
                email: student.email,
            })));

            const grantedResponse = await fetch(`${URL}file-access/all-students-granted/${file.fileid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const grantedData = await grantedResponse.json();

            setGrantedStudentIds(new Set(grantedData.students.map((s: any) => s.student_id)));
        } catch (error) {
            console.error("Error fetching students:", error);
            setErrorMessage('Error fetching students');
            setTimeout(() => setErrorMessage(null), 2000);
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
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ student_ids: studentsToGrant, teacher_id: user?.id }),
                });
            }
            if (studentsToRevoke.length > 0) {
                await fetch(`${URL}file-access/revoke/${selectedFile?.fileid}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ student_ids: studentsToRevoke, teacher_id: user?.id }),
                });
            }
        } catch (error) {
            console.error("Error updating student access:", error);
            setErrorMessage("Error updating student access");
            setTimeout(() => setErrorMessage(null), 2000);
        } finally {
            setIsLoading(false);
            setIsAccessPopupOpen(false);
        }
    };

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL}file-access/teacher/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const data = await response.json();

            if (response.ok) {
                setFiles(data.files);
            } else {
                setErrorMessage("Error fetching files");
                setTimeout(() => setErrorMessage(null), 2000);
            }
        } catch (error) {
            setErrorMessage("Error fetching files");
            setTimeout(() => setErrorMessage(null), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const handleUpload = async (file: File, subjectId: string) => {
        if (!file || !subjectId) {
            setErrorMessage("File or subject is missing");
            setTimeout(() => setErrorMessage(null), 2000);
            return;
        }

        // Check file size before proceeding
        //@ts-ignore
        if (file.size > MAX_FILE_SIZE) {
            setErrorMessage("File size exceeds the 10MB limit.");
            setTimeout(() => setErrorMessage(null), 1000);
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        //@ts-ignore
        formData.append("file", file);
        //@ts-ignore
        formData.append("teacher_id", user?.id);
        formData.append("subject_id", subjectId);

        try {
            const response = await fetch(`${URL}file/upload-single`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData,
            });

            if (response.ok) {
                await fetchFiles();
            }
            else if (response.status === 400) {
                const data = await response.json();
                setErrorMessage(data.error || "File upload failed.");
                setTimeout(() => setErrorMessage(null), 2000);
            }
            else if (response.status === 409) {
                setErrorMessage("Invalid filename format");
                setTimeout(() => setErrorMessage(null), 2000);
            }
            else {
                const data = await response.json();
                setErrorMessage(data.message || "File upload failed.");
                setTimeout(() => setErrorMessage(null), 2000);
            }
        } catch (error) {
            console.error("Error during file upload:", error);
            setErrorMessage("An unexpected error occurred during upload");
            setTimeout(() => setErrorMessage(null), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainContainer style={{ overflowX: 'hidden' }}>
            <SideBar />
            <Container style={{ overflowX: 'hidden' }}>
                {!isLoading && (
                    <FixedTitleContainer>
                        <h1>Teacher's Files</h1>
                        <Button className="upload-button" onClick={() => setIsUploadPopupOpen(true)}>Upload New File</Button>
                        {errorMessage && <Message error>{errorMessage}</Message>}
                    </FixedTitleContainer>
                )}

                {isLoading ? (
                    <LoadingOverlay isVisible={isLoading}>Loading...</LoadingOverlay>
                ) : files.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 150px)', color: '#FFFFFF' }}>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>No files available</h2>
                        <p style={{ fontSize: '1.5rem' }}>Upload a new file to start managing your files.</p>
                    </div>
                ) : (
                    <ScrollableCardsContainer>
                        <CardsContainer>
                            {files.map(file => (
                                <Card key={file.fileid}>
                                    <CardHeader>{file.filename}</CardHeader>
                                    <CardBody>
                                        <p>Subject: {file.subject.subjectname}</p>
                                        <p>Upload date: {file.upload_date}</p>
                                        <ButtonContainer>
                                            <Button onClick={() => handleDownload(file.fileid, file.filename)}>
                                                Descargar
                                            </Button>
                                            <Button onClick={() => openAccessPopup(file)}>
                                                Manage Access
                                            </Button>
                                            <Button important onClick={() => handleDelete(file.fileid)}>
                                                Delete
                                            </Button>
                                        </ButtonContainer>
                                    </CardBody>
                                </Card>
                            ))}
                        </CardsContainer>
                    </ScrollableCardsContainer>
                )}
            </Container>

            <FileUploadPopup
                isOpen={isUploadPopupOpen}
                onClose={() => setIsUploadPopupOpen(false)}
                //@ts-ignore
                onUpload={handleUpload}
                //@ts-ignore
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
        </MainContainer>
    );
}; export default TeacherFileManagement;
