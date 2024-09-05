import { useState } from "react"
import { MainContainer, LeftContainer, RightContainer, Image, FormContainer, Form, InputText, Input, FormTitle, Button, ToggleVisibilityButton, ButtonsContainer, AnimatedStars, Star, ForgotPass } from "./components"
import { AiTwotoneEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/Logo.png"
import MultiSelectDropdown from "../../components/multi-select-dropdown";

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleSelectOptions = (selected: string[]) => {
        setSelectedOptions(selected);
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password, repassword, selectedOptions);
        navigate("/");
    }

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' },
        { value: 'option5', label: 'Option 5' },
        { value: 'option6', label: 'Option 6' },
        { value: 'option7', label: 'Option 7' },
        { value: 'option8', label: 'Option 8' },
        { value: 'option9', label: 'Option 9' },
        { value: 'option10', label: 'Option 10' },
        { value: 'option11', label: 'Option 11' },
        { value: 'option12', label: 'Option 12' },
        { value: 'option13', label: 'Option 13' },
        { value: 'option14', label: 'Option 14' },
        { value: 'option15', label: 'Option 15' },
    ]

    return(
        <MainContainer>
            <LeftContainer>
                <Image src={Logo}></Image>
            </LeftContainer>
            <RightContainer>
            <AnimatedStars xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                <Star cx="100" cy="100" r="2" delay="2s"/>
                <Star cx="200" cy="200" r="2" delay="0s"/>
                <Star cx="300" cy="300" r="2" delay="1s"/>
                <Star cx="500" cy="100" r="2" delay="0s"/>
                <Star cx="600" cy="500" r="2" delay="0s"/>
                <Star cx="700" cy="300" r="2" delay="1s"/>
                <Star cx="100" cy="500" r="2" delay="2s"/>
                <Star cx="300" cy="600" r="2" delay="1s"/>
                <Star cx="650" cy="50" r="2" delay="1s"/>
            </AnimatedStars>
                <FormContainer>
                    <FormTitle>Welcome!</FormTitle>
                    <Form onSubmit={(event) => handleRegister(event)}>
                        <InputText>Email:</InputText>
                        <Input type="email" id="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} required ></Input>
                        <InputText>Password:</InputText>
                        <div style={{ position: 'relative' }}>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="password" 
                                placeholder="Password..." 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ paddingRight: '30px' }}
                            />
                            <ToggleVisibilityButton
                                onClick={() => setIsVisible(!isVisible)}
                                type="button"
                            >
                                {isVisible ? <AiTwotoneEyeInvisible /> : <AiOutlineEye />}
                            </ToggleVisibilityButton>
                        </div>
                        <InputText>Repeat password:</InputText>
                            <Input 
                                type={isVisible ? 'text' : 'password'} 
                                id="repassword" 
                                placeholder="Password..." 
                                value={repassword} 
                                onChange={(e) => setRepassword(e.target.value)} 
                                required 
                                style={{ paddingRight: '30px' }}
                            />
                        <InputText>Subjects:</InputText>
                        <MultiSelectDropdown options={options} onSelect={handleSelectOptions}/>

                        <ButtonsContainer>
                            <Button type="submit" >Register</Button>
                            <ForgotPass to="/">Already have an account?</ForgotPass>
                        </ButtonsContainer>
                    </Form>
                </FormContainer>
            </RightContainer>
        </MainContainer>
    )

}
export default Register;