import { useState, useEffect } from 'react';
import SideBar from '../../components/sidebar/sidebar';
import { MainContainer, FixedTitleContainer, ScrollableCardsContainer, CardsContainer, Card, CardHeader, CardBody, LoadingOverlay, Container, NoFilesMessage, SearchContainer, SearchInput, ClearButton } from './components';
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
    const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
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
                    setFilteredFiles(data.files); // Initialize with full file list
                } else {
                    setErrorMessage(data.message);
                    setTimeout(() => setErrorMessage(null), 2000);
                }
            } catch (error) {
                console.error("Error fetching files", error);
                setErrorMessage('Error fetching files');
                setTimeout(() => setErrorMessage(null), 2000);
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
                body: JSON.stringify({ teacher_id: teacher_id }),
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
            setTimeout(() => {
                setErrorMessage(null);
            }, 2000);
        }
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        setSearchText(searchTerm);

        const filtered = files.filter(file => 
            file.filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredFiles(files); // Reset to original file list
    };

    return (
        <MainContainer>
            <SideBar />
            <Container>
                {isLoading ? (
                    <LoadingOverlay isVisible={isLoading}>Loading...</LoadingOverlay>
                ) : files.length === 0 ? (
                    <NoFilesMessage>
                        <h2>Hello, {user?.firstName}!</h2>
                        <p>No files were shared with you.</p>
                    </NoFilesMessage>
                ) : (
                    <>
                        <FixedTitleContainer>
                            <h1>Student's Files</h1>
                            {errorMessage && <Message error>{errorMessage}</Message>}
                        </FixedTitleContainer>

                        {/* Render search bar only if there are files */}
                        {files.length > 0 && (
                            <SearchContainer>
                                <SearchInput
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchText}
                                    onChange={handleSearch}
                                />
                                <ClearButton onClick={clearSearch}>X</ClearButton>
                            </SearchContainer>
                        )}

                        <ScrollableCardsContainer>
                            <CardsContainer>
                                {filteredFiles.map(file => (
                                    <Card key={file.fileid}>
                                        <CardHeader>{file.filename}</CardHeader>
                                        <CardBody>
                                            <p>Subject: {file.subject.subjectname}</p>
                                            <p>Teacher: {file.teacher.firstname} {file.teacher.lastname}</p>
                                            <Button onClick={() => handleDownload(file.fileid, file.filename, file.teacher.teacher_id)}>
                                                Download
                                            </Button>
                                        </CardBody>
                                    </Card>
                                ))}
                            </CardsContainer>
                        </ScrollableCardsContainer>
                    </>
                )}
            </Container>
        </MainContainer>
    );
};

export default StudentFileView;
