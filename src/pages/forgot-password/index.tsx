import { useState } from "react"
import { MainContainer, RightContainer, FormContainer, Form, InputText, Input, FormTitle, Button, ButtonsContainer, EmailSentNotification } from "./components"
import { useNavigate } from 'react-router-dom';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    try{
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/reset/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to reset password');
        }

    }catch(error){
        console.log(error);
    }   
        setIsLoading(false)
        setEmailSent(true);
        setTimeout(() => {
            setEmailSent(false);
            navigate('/');
        }, 3000);
    }

    const handleBackToLogin = () => {
        navigate('/');
    }

    return(
        <MainContainer>
           {emailSent && <EmailSentNotification>If the email exists in our database, you will receive a link to reset your password</EmailSentNotification>}
            <RightContainer>
                <FormContainer>
                    <FormTitle>Enter your email</FormTitle>
                    <Form onSubmit={(event) => handleResetPassword(event)}>
                        <InputText>Email:</InputText>
                        <Input type="email" id="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required ></Input>
                        <ButtonsContainer>
                            <Button type="submit" >{isLoading ?  <AnimatedLoadingLogo src={SimplifiedLogo}/> : "Confirm"}</Button>
                            <Button type="submit" secondary onClick={handleBackToLogin}>Back to login</Button>
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
        </MainContainer>
    )

}
export default ForgotPassword;