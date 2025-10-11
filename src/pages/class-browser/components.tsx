import styled from "styled-components";
import colors from "../../assets/colors";

interface MainContainerProps {
    isPopupOpen: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    background: rgb(43,130,51);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen }) => (isPopupOpen ? 1 : 0)};
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);        
    }

    @media (max-width: 1000px){
        height: 100%;
    }
`;

export const Content = styled.div`
    width: 90% ;
    height: 100% ;
    margin-left: 100px;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;

    @media (max-width: 1000px){
        margin-left: 0;
        width: 100% ;
        margin-top: 100px;
    }
`

export const BrowserWrapper = styled.div`
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
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

    scrollbar-width: thin;
    scrollbar-color: white transparent;

    @media (max-width: 1000px){
        width: 80%;
    }
`;


export const Card = styled.div`
    width: 100%;
    background-color: ${colors.secondary} ;
    border-radius: 8px;
    height: 80px;
    margin: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: flex-start;
    transition: background-color 0.3s;
    cursor: pointer ;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

export const CardInfo = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    padding: 0 20px 0 20px;
    align-items: center;
`

export const Title = styled.h2`
    font-size: 1.5rem;
    margin: 0;
    color: ${colors.primary};
`;

export const Instructor = styled.p`
    font-weight: bold;
    color: ${colors.primary};
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`

export const CardSkeleton = styled.div`
    width: 100%;
    height: 80px;
    background-color: rgba(163, 163, 163, 0.25);
    border-radius: 8px;
    margin: 10px;
`

export const StaticSkeletonCard = styled.div`
    width: 100%;
    height: 80px;
    border: 1px solid ${colors.secondary} ;
    border-radius: 8px;
    margin: 10px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`

export const Select = styled.select`
    background-color: transparent ;
    border: 1px solid ${colors.primary} ;
    border-radius: 5px;
    padding: 10px;
    width: 150px;
    color: ${colors.primary};
`

export const InputsContainer = styled.div`
    display: flex ;
    width: 50%;
    gap: 10px;
    margin-bottom: 10px;
`

export const PaymentButton = styled.button`
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    min-width: 150px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 5px;
    background-color: #000;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: none;

    &::before, &::after {
        content: '';
        position: absolute;
        top: 25px;
        left: -2px; 
        width: 40px;
        height: 5px;
        background-color: gold;
        transform: rotate(-45deg);
        transform-origin: top left;
    }

    &::after {
        top: 10px;
    }

    &:hover {
        background-color: grey;
    }
`;


export const CashFlowProLogo = styled.img`
    position: absolute;
    display: none;
    width: 30px;
    height: 30px;
    top: 5px;
    right: 5px;
`

export const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.5rem;
    border: none;
    position: absolute;
    top: 10px;
    right: 10px;

    &:hover {
        opacity: 0.7;
    }
`

export const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    border-right: 1px solid ${colors.primary};
    height: 100%;

    @media (max-width: 850px){
        width: 100%;
        border-right: none;
        border-bottom: 1px solid ${colors.primary};
    }
`

export const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center ;
    width: 50%;
    height: 100%;

    @media (max-width: 850px){
        width: 100%;
    }
    
`

interface SlotButtonProps {
    remove?: boolean;
}

export const SlotButton = styled.button<SlotButtonProps>`
    background-color: ${props => props.remove ? colors.important : colors.primary};
`

export const SummaryContainer = styled.div``

export const SummaryItem = styled.div``

export const TimeInput = styled.input`
    background: #ffffff;
    border-radius: 5px;
    font-size: 16px;
    height: 36px;
    border: 1px solid ${colors.primary};
    color: #000;
    padding: 0 8px;
    -webkit-text-fill-color: #000;

    &::-webkit-datetime-edit-fields-wrapper,
    &::-webkit-datetime-edit-text,
    &::-webkit-datetime-edit-hour-field,
    &::-webkit-datetime-edit-minute-field,
    &::-webkit-datetime-edit-ampm-field {
        color: #000;
    }

    &::-webkit-calendar-picker-indicator {
        filter: invert(0);
    }

    &::-moz-datetime-edit-fields-wrapper,
    &::-moz-datetime-edit-text,
    &::-moz-datetime-edit-hour-field,
    &::-moz-datetime-edit-minute-field,
    &::-moz-datetime-edit-ampm-field {
        color: #000;
    }
`;
