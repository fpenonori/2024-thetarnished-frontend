import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { Button } from '../../components/main-button/components';
import colors from '../../assets/colors';


interface Subject {
    subjectid: string;
    subjectname: string;
}

interface UploadFilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, customName: string, subjectId: string) => Promise<void>;
    subjects: Subject[];
}

const UploadFilePopup: React.FC<UploadFilePopupProps> = ({ isOpen, onClose, onUpload, subjects }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [subjectId, setSubjectId] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setSelectedFile(acceptedFiles[0]),
        maxFiles: 1,
    });
    

    const handleUploadClick = async () => {
        if (selectedFile && subjectId) {
            setIsUploading(true);
            await onUpload(selectedFile, subjectId);
            setIsUploading(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <Title>Upload a New File</Title>
                <DropZone {...getRootProps()}>
                    <input {...getInputProps()} />
                    {selectedFile ? (
                        <FilePreview>Selected file: {selectedFile.name}</FilePreview>
                    ) : (
                        <FilePreview>Drag 'n' drop a file here, or click to select one</FilePreview>
                    )}
                </DropZone>
                <Select
                    value={subjectId}
                    onChange={(e) => {
                        const selectedSubject = subjects.find(
                            (subject) => subject.subjectid === e.target.value
                        );
                        if (selectedSubject) {
                            setSubjectId(selectedSubject.subjectid);
                            console.log("Selected subject ID:", selectedSubject.subjectid);
                        }
                    }}
                >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                        <option key={subject.subjectid} value={subject.subjectid}>
                            {subject.subjectname}
                        </option>
                    ))}
                </Select>

                <Button disabled={!selectedFile || !subjectId || isUploading} onClick={handleUploadClick}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button important onClick={onClose}>Cancel</Button>
            </ModalContent>
        </ModalOverlay>
    );
};

export default UploadFilePopup;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90vw;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Title = styled.h3`
    text-align: center;
    color: #333;
`;

const DropZone = styled.div`
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
`;

const FilePreview = styled.p`
    font-size: 0.9em;
    color: #555;
`;

const Select = styled.select`
    padding: 10px;
    background-color: #fff;
    color: ${colors.primary};
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

