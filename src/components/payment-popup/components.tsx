import styled from "styled-components";
import colors from "../../assets/colors";

export const PopUpContainer = styled.div`
    z-index: 1000; 
    position: fixed;
    width: 100vw ;
    height: 100vh;
`

export const PopUp = styled.div`
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 50px;
    border-radius: 8px;
    z-index: 900; 
    color: ${colors.primary};
    border: 2px solid #ccc;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    width: 50vw;
    height: 50vh;

    @media (max-width: 1500px){
        width: 80%;
    }

    @media (max-width: 850px){
        flex-direction: column;
        height: 80%;
    }
`
