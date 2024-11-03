// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { UploadFilePopupContainer, PopupOverlay, FormContainer, Input, Button, DropzoneContainer } from './uploadcomponents'; // Styled components

// interface UploadFilePopupProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onUpload: (file: File, customName: string, subjectId: string) => Promise<void>;
//     subjects: { subject_id: string; subjectname: string }[]; // Assuming Subject type here
// }

// const UploadFilePopup: React.FC<UploadFilePopupProps> = ({ isOpen, onClose, onUpload, subjects }) => {
//     const [customName, setCustomName] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [file, setFile] = useState<File | null>(null);

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop: acceptedFiles => {
//             setFile(acceptedFiles[0]);
//         }
//     });

//     const handleUpload = () => {
//         if (file && selectedSubject) {
//             onUpload(file, customName, selectedSubject);
//             onClose();
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <PopupOverlay>
//             <UploadFilePopupContainer>
//                 <h2>Upload File</h2>
//                 <FormContainer>
//                     <DropzoneContainer {...getRootProps()}>
//                         <input {...getInputProps()} />
//                         {file ? <p>{file.name}</p> : <p>Drag & drop a file here, or click to select a file</p>}
//                     </DropzoneContainer>
//                     <Input
//                         type="text"
//                         placeholder="Enter custom file name"
//                         value={customName}
//                         onChange={(e) => setCustomName(e.target.value)}
//                     />
//                     <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
//                         <option value="">Select subject</option>
//                         {subjects.map((subject) => (
//                             <option key={subject.subject_id} value={subject.subject_id}>
//                                 {subject.subjectname}
//                             </option>
//                         ))}
//                     </select>
//                     <Button onClick={handleUpload} disabled={!file || !selectedSubject}>
//                         Upload
//                     </Button>
//                     <Button onClick={onClose}>Cancel</Button>
//                 </FormContainer>
//             </UploadFilePopupContainer>
//         </PopupOverlay>
//     );
// };

// export default UploadFilePopup;

// import { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { Modal, Input, Select, Button, FilePreviewContainer } from './uploadcomponents';
// import { useAuth } from '../../auth/useAuth';


// interface Subject  {
//     subject_id: string;
//     subjectname: string;
// }

// interface UploadFilePopupProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onUpload: (file: File, customName: string, subjectId: string) => Promise<void>;
//     subjects: Subject[];
// }

// const UploadFilePopup: React.FC<UploadFilePopupProps> = ({ isOpen, onClose, onUpload, subjects }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [customName, setCustomName] = useState('');
//     const [subjectId, setSubjectId] = useState('');
//     const [isUploading, setIsUploading] = useState(false);
//     const { user } = useAuth();

//     const onDrop = (acceptedFiles: File[]) => {
//         setSelectedFile(acceptedFiles[0]);
//     };

//     const { getRootProps, getInputProps } = useDropzone({
//         onDrop,
//         accept: '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg',
//         maxFiles: 1
//     });

//     const handleUpload = async () => {
//         if (selectedFile && subjectId) {
//             const formData = new FormData();
//             formData.append('file', selectedFile);  // This should work now
//             formData.append('customName', customName);
//             formData.append('teacher_id', user?.id || ''); // assuming user.id is available
//             formData.append('subjectId', subjectId);

//             setIsUploading(true);
//             try {
//                 await onUpload(selectedFile, customName, subjectId);
//                 onClose();
//             } finally {
//                 setIsUploading(false);
//             }
//         }
//     };
//     return (
//         isOpen && (
//             <Modal>
//                 <h2>Upload a New File</h2>
//                 <FilePreviewContainer>
//                     <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '10px', cursor: 'pointer' }}>
//                         <input {...getInputProps()} />
//                         {selectedFile ? (
//                             <p>Selected file: {selectedFile.name}</p>
//                         ) : (
//                             <p>Drag 'n' drop a file here, or click to select one</p>
//                         )}
//                     </div>
//                 </FilePreviewContainer>
//                 <Input
//                     type="text"
//                     placeholder="Enter custom file name"
//                     value={customName}
//                     onChange={(e) => setCustomName(e.target.value)}
//                 />
//                 <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
//                     <option value="" disabled>Select subject</option>
//                     {subjects.map((subject) => (
//                         <option key={subject.subject_id} value={subject.subject_id}>
//                             {subject.subjectname}
//                         </option>
//                     ))}
//                 </Select>
//                 <Button onClick={handleUpload} disabled={!selectedFile || !subjectId || isUploading}>
//                     {isUploading ? 'Uploading...' : 'Upload'}
//                 </Button>
//                 <Button onClick={onClose}>Cancel</Button>
//             </Modal>
//         )
//     );
// };

// export default UploadFilePopup;

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

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
    const [customName, setCustomName] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => setSelectedFile(acceptedFiles[0]),
        accept: '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg',
        maxFiles: 1,
    });

    const handleUploadClick = async () => {
        if (selectedFile && subjectId) {
            setIsUploading(true);
            await onUpload(selectedFile, customName, subjectId);
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
                <Input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter custom file name"
                />
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
                <CancelButton onClick={onClose}>Cancel</CancelButton>
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

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const Select = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px;
    background-color: green;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const CancelButton = styled(Button)`
    background-color: #aaa;
    color: #333;
`;

