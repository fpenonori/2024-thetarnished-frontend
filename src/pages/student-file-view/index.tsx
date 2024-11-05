import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, FixedTitleContainer, ScrollableCardsContainer, CardsContainer, Card, CardHeader, CardBody, LoadingOverlay, Container, NoFilesMessage } from './components';
import { Message } from '../../components/message/components';
import { useAuth } from '../../auth/useAuth';
import { Button } from '../../components/main-button/components';

interface Subject {
    subjectname: string;
}

interface Teacher {
    teacher_id: string;
    firstname: string;
    lastname: string;
}

interface File {
    fileid: string;
    filename: string;
    filepath: string;
    upload_date: string;
    subject: Subject;
    teacher: Teacher;
}

const StudentFileView = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${URL}file-access/student/${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setFiles(data.files);
                } else {
                    setErrorMessage(data.message);
                    setInterval(() => {
                        setErrorMessage(null);
                    }, 2000);
                }
            } catch (error) {
                console.error("Error fetching files", error);
                setErrorMessage('Error fetching files');
                setInterval(() => {
                    setErrorMessage(null);
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) fetchFiles();
    }, [URL, user?.id]);

    const handleDownload = async (fileId: string, filename: string, teacher_id: string) => {
        try {
            const response = await fetch(`${URL}file/${fileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({teacher_id: teacher_id }),
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
            setErrorMessage('Error downloading file');
            setInterval(() => {
                setErrorMessage(null);
            }, 2000);
        }
    };

    return (
        <MainContainer>
            <SideBar />
            <Container>
                {isLoading ? (
                    <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>
                ) : files.length === 0 ? (
                    <NoFilesMessage>
                        <h2>Hello, {user?.firstName}!</h2>
                        <p>No files were shared with you.</p>
                    </NoFilesMessage>
                ) : (
                    <>
                        <FixedTitleContainer>
                            <h1>Archivos Disponibles</h1>
                            {errorMessage && <Message error>{errorMessage}</Message>}
                        </FixedTitleContainer>

                        <ScrollableCardsContainer>
                            <CardsContainer>
                                {files.map(file => (
                                    <Card key={file.fileid}>
                                        <CardHeader>{file.filename}</CardHeader>
                                        <CardBody>
                                            <p>Materia: {file.subject.subjectname}</p>
                                            <p>Profesor: {file.teacher.firstname} {file.teacher.lastname}</p>
                                            <Button onClick={() => handleDownload(file.fileid, file.filename, file.teacher.teacher_id)}>
                                                Descargar
                                            </Button>
                                        </CardBody>
                                    </Card>
                                ))}
                            </CardsContainer>
                        </ScrollableCardsContainer>
                    </>
                )}
            </Container>

            {isLoading && <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>}
        </MainContainer>
    );
};

export default StudentFileView;
