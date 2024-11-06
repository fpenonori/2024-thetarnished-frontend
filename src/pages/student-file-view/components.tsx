import styled, { keyframes, css } from 'styled-components';
import colors from '../../assets/colors';
import { Button } from '../../components/main-button/components';

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
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
    overflow: hidden;
`;

export const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow-y: auto;
    max-height: 100vh;
`;

export const FixedTitleContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    position: relative;

    h1 {
        font-size: 3.5rem;
        margin: 0;
    }
`;

export const ScrollableCardsContainer = styled.div`
    width: 100%;
    height: calc(100vh - 150px);
    overflow-y: auto;
    padding: 20px;
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

export const NoFilesMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 150px);
    text-align: center;
    color: #FFFFFF;
    font-size: 1.5rem;

    h2 {
        font-size: 4rem;
        margin-bottom: 0.2em;
    }

    p {
        font-size: 2rem;
    }
`;

// New styles for the search bar
export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    width: 100%;
    max-width: 450px;
`;

export const SearchInput = styled.input`
    width: 250px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white !important;
    color: white;
`;

export const ClearButton = styled(Button)`
    margin-left: 8px;
    background-color: #D9534F;
    color: white;
    width: 32px;
    height: 40px;
    border-radius: 4px;

    &:hover {
        background-color: #C9302C;
    }
`;
