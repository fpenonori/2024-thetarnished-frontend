import styled from 'styled-components';
import colors from '../../assets/colors';

export const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const UploadFilePopupContainer = styled.div`
    background: white;
    width: 400px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
`;

export const DropzoneContainer = styled.div`
    padding: 20px;
    border: 2px dashed ${colors.primary};
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

export const Button = styled.button`
    padding: 10px;
    background-color: ${colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        background-color: #ccc;
    }
`;

export const FilePreviewContainer = styled.div`
    margin-top: 10px;
    font-size: 1rem;
    color: #333;
`;
