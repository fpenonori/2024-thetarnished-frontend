// 
// TeacherFileManagement.tsx
import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Container, CardsContainer, Card, CardHeader, CardBody, LoadingOverlay } from './components';
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

const TeacherFileManagement = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
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

    return (
        <MainContainer>
            <SideBar />
            <Container>
                <h1>Archivos del Profesor</h1>
                {errorMessage && <Message error>{errorMessage}</Message>}
                
                <CardsContainer>
                    {files.map(file => (
                        <Card key={file.fileid}>
                            <CardHeader>{file.filename}</CardHeader>
                            <CardBody>
                                <p>Materia: {file.subject.subjectname}</p>
                                <p>Fecha de carga: {file.upload_date}</p>
                            </CardBody>
                        </Card>
                    ))}
                </CardsContainer>

                {isLoading && <LoadingOverlay isVisible={isLoading}>Loading, please wait...</LoadingOverlay>}
            </Container>
        </MainContainer>
    );
};

export default TeacherFileManagement;
