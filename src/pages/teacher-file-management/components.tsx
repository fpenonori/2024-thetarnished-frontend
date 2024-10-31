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
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
`;

export const Container = styled.div`
    width: 90%;
    height: 100%;
    margin-left: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    max-height: 800px;
    overflow-y: auto;
    flex-wrap: wrap;
`;

export const CardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 100%;
`;

export const Card = styled.div`
    width: 450px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
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
    background: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const DownloadButton = styled.button`
    align-self: flex-end;
    margin-top: auto;
    background-color: ${colors.primary};
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9em;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        background-color: ${colors.secondary};
        color: white;
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