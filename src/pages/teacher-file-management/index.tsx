import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, Container, CardsContainer, Card, CardHeader, CardBody, DownloadButton, LoadingOverlay } from './components';
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
                setIsLoading(false); // Finaliza el estado de carga
            }
        };
        fetchFiles();
    }, [URL, user?.id]);

    const handleDownload = async (fileId: string, filename: string) => {
        try {
            const response = await fetch(`${URL}file/${fileId}`, {
                method: 'POST',  // Switch to POST to include body
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacher_id: user?.id }),  // Include teacher_id in the body
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
                                {/* Download button triggers handleDownload */}
                                <DownloadButton onClick={() => handleDownload(file.fileid, file.filename)}>
                                    Descargar
                                </DownloadButton>
                            </CardBody>
                        </Card>
                    ))}
                </CardsContainer>

                {/* Loading overlay */}
                {isLoading && <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>}
            </Container>
        </MainContainer>
    );
};

export default TeacherFileManagement;

// // TeacherFileManagement.tsx
// import { useState, useEffect } from 'react';
// import SideBar from '../../components/sidebar/sidebar';
// import { MainContainer, Container, Title, ScrollableCardsContainer, Card, CardHeader, CardBody, DownloadButton, LoadingOverlay } from './components';
// import { Message } from '../../components/message/components';
// import { useAuth } from '../../auth/useAuth';

// interface Subject {
//     subject_id: string;
//     subjectname: string;
// }

// interface File {
//     fileid: string;
//     filename: string;
//     filepath: string;
//     upload_date: string;
//     subject: Subject;
// }

// const TeacherFileManagement = () => {
//     const { user } = useAuth();
//     const [files, setFiles] = useState<File[]>([]);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const URL = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const fetchFiles = async () => {
//             setErrorMessage(null);
//             if (!user?.id) return;
//             try {
//                 const response = await fetch(`${URL}file-access/teacher/${user.id}`);
//                 const data = await response.json();
//                 if (response.ok) {
//                     setFiles(data.files);
//                 } else {
//                     setErrorMessage(data.message);
//                 }
//             } catch (error) {
//                 setErrorMessage('Error al obtener los archivos');
//                 console.error(error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchFiles();
//     }, [URL, user?.id]);

//     const handleDownload = async (fileId: string, filename: string) => {
//         try {
//             const response = await fetch(`${URL}/download/${fileId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ teacher_id: user?.id }),
//             });

//             if (response.ok) {
//                 const blob = await response.blob();
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = filename;
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//                 window.URL.revokeObjectURL(url);
//             } else {
//                 console.error("Failed to download file");
//             }
//         } catch (error) {
//             console.error("Download error:", error);
//         }
//     };

//     return (
//         <MainContainer>
//             <SideBar />
//             <Container>
//                 <Title>Archivos del Profesor</Title>
//                 {errorMessage && <Message error>{errorMessage}</Message>}
                
//                 <ScrollableCardsContainer>
//                     {files.map(file => (
//                         <Card key={file.fileid}>
//                             <CardHeader>{file.filename}</CardHeader>
//                             <CardBody>
//                                 <p>Materia: {file.subject.subjectname}</p>
//                                 <p>Fecha de carga: {file.upload_date}</p>
//                                 <DownloadButton onClick={() => handleDownload(file.fileid, file.filename)}>
//                                     Descargar
//                                 </DownloadButton>
//                             </CardBody>
//                         </Card>
//                     ))}
//                 </ScrollableCardsContainer>

//                 {isLoading && <LoadingOverlay isVisible={isLoading}>Cargando...</LoadingOverlay>}
//             </Container>
//         </MainContainer>
//     );
// };

// export default TeacherFileManagement;
