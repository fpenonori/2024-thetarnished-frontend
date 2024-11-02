import styled, { keyframes, css } from 'styled-components';
import colors from '../../assets/colors';

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

export const MainContainer = styled.div`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
    overflow: hidden;
    @media (max-width: 1000px){
        flex-direction: column;
        height: 110vh ;
    }
`

export const Container = styled.div`
    flex: 1; // Take up remaining space beside sidebar
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow-y: auto; // Make the content scrollable
    max-height: 100vh;
`;

export const Header = styled.h1`
    position: sticky;
    top: 0;
    background: rgba(43,84,52,1);
    padding: 10px;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    color: white;
    z-index: 10;
`;

export const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
    overflow-y: auto; // Allow scrolling on the cards
`;

export const Card = styled.div`
    width: 450px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CardHeader = styled.div`
    background-color: ${colors.primary};
    color: white;
    padding: 10px;
    font-size: 1.2em;
    text-align: center;
`;

export const CardBody = styled.div`
    padding: 15px;
    color: ${colors.text};
    display: flex;
    flex-direction: column;
    align-items: center;
`;


export const DownloadButton = styled.button`
    background-color: ${colors.primary};
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: ${colors.secondary};
    }
`;

export const DeleteButton = styled(DownloadButton)`
    background-color: red;
    
    &:hover {
        background-color: darkred;
    }
`;

export const LoadingOverlay = styled.div<{ isVisible: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5em;
    z-index: 1000;
    pointer-events: none;
    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    animation: ${({ isVisible }) =>
        isVisible
            ? css`${fadeIn} 0.5s ease forwards`
            : css`${fadeOut} 0.5s ease forwards`};
`;


export const FixedTitleContainer = styled.div`
    width: 100%;
    padding: 20px;
    text-align: center;

    h1 {
        font-size: 1.8rem; // Adjust font size as needed
        margin: 0;
    }
`;

export const ScrollableCardsContainer = styled.div`
    width: 100%;
    height: calc(100vh - 150px); /* Ajusta el alto para permitir el scroll */
    overflow-y: auto;
    padding: 20px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 10px; // Adjusts spacing between buttons
    justify-content: center;
    margin-top: 10px;
`;