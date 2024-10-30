import styled, { keyframes, css } from 'styled-components';
import colors from '../../assets/colors';

export const MainContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    @media (max-width: 1000px) {
        padding-bottom: 80px;
    }
`;

export const Content = styled.div`
    width: 90%;
    height: 100%;
    margin-left: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    max-height: 800px;
    overflow-y: auto;
    flex-wrap: wrap;

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: white;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #e0e0e0;
    }

    scrollbar-color: white transparent;
    scrollbar-width: thin;
`;

export const Container = Content;

export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    width: 100%;
    align-items: flex-start;
`;

export const Card = styled.div`
    width: 350px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
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
    background: none;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const SubjectName = styled.p`
    font-size: 1em;
    color: ${colors.text};
    margin: 8px 0;
    text-align: center;
`;

// Animaciones de entrada y salida
const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
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

    // Aplicación de la transición según el estado de visibilidad
    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    animation: ${({ isVisible }) =>
        isVisible
            ? css`${fadeIn} 0.5s ease forwards`
            : css`${fadeOut} 0.5s ease forwards`};
`;
