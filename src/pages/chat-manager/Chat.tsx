import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import styled from "styled-components";
import SideBar from "../../components/sidebar/sidebar";
import Topbar from "../../components/topbar";
import { Button } from "../../components/main-button/components";
import { InteractionBlocker } from "../../components/interaction-blocker/components";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import colors from "../../assets/colors";
import { RiCloseLargeFill } from "react-icons/ri";


interface Message {
  id: string;
  message: string;
  timestamp: Date; 
  studentId: string;
  teacherId: string;
  roomId: string;
  sender: string;
}

const socket: Socket = io("https://chat.fpenonori.com", {
  transports: ["websocket"],
  secure: true,
});

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [role, setRole] = useState("");
  const [studentName, setStudentName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {studentId, teacherId} = useParams();
  const {user} = useAuth();
  //@ts-ignore
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const URL = import.meta.env.VITE_API_URL;


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
    //@ts-ignore
    fetchStudentName(studentId);
    //@ts-ignore
    fetchTeacherName(teacherId);
    scrollToBottom();
  }, [user, messages]);


  const fetchStudentName = async (id: string) => {
    try {
      const response = await fetch(
        `${URL}students/${id}`
      , { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const student = await response.json();
      setStudentName(student.firstname +" "+ student.lastname);
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const fetchTeacherName = async (id: string) => {
    try {
      const response = await fetch(
        `${URL}teachers/${id}`
        , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user?.token}`,
          },
        });
      const teacher = await response.json();
      setTeacherName(teacher.firstname +" "+ teacher.lastname);

    } catch (error) {
      console.error("Error fetching teacher name:", error);
    }
  };

  useEffect(() => {
    if (studentId && teacherId) {


      socket.emit("joinRoom", { studentId, teacherId });

      socket.on("messageHistory", (history: Message[]) => {
        const filteredHistory = history.filter(
          (msg) => msg.message && msg.message.trim() !== ""
        );
        setMessages(filteredHistory);
        scrollToBottom();
      });

      socket.on("message", (newMessage: Message) => {
        if (newMessage.message && newMessage.message.trim() !== "") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        }
      });
    }

    return () => {
      socket.off("message");
      socket.off("messageHistory");
    };
  }, [studentId, teacherId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        message,
        studentId: studentId!,
        teacherId: teacherId!,
        roomId: `${studentId}-${teacherId}`,
        sender: role === "STUDENT" ? studentId! : teacherId!,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const navigate = useNavigate();

  const handleCloseChat = () => {
    navigate("/my-classes")
  };

  return (
    <MainContainer>
      <Topbar/>
      <SideBar/>
      {isLoading ? (<InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>) : (
        <Content>        
        <div className="chat-container">
          <div className="sender-name">{role === "STUDENT" ? teacherName : studentName}<CloseButton onClick={handleCloseChat}><RiCloseLargeFill/></CloseButton></div>
          <div className="message-history" ref={chatContainerRef}>
          {messages.map((msg, index) => {
            const isSender =
              role === "STUDENT"
                ? String(msg.sender) === String(studentId)
                : String(msg.sender) === String(teacherId);
  
            const currentDate = new Date(msg.timestamp).toDateString();
            const previousDate =
              index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;
  
            let dateSeparator = null;
            const today = new Date().toDateString();
            const dateLabel = currentDate === today ? "Today" : currentDate;
  
            if (currentDate !== previousDate) {
              const serverMessage = {
                id: `server-${index}`,
                message: ` ${dateLabel}`,
                timestamp: new Date(msg.timestamp), 
                sender: "server",
              };
  
              dateSeparator = (
                <div key={`server-msg-${index}`} className="server-message">
                  <p className="server-message-text">
                    {serverMessage.message}
                  </p>
                </div>
              );
            }
  
            const time = new Date(msg.timestamp);
            const formattedTimestamp = `${String(time.getHours()).padStart(
              2,
              "0"
            )}:${String(time.getMinutes()).padStart(2, "0")}`;
  
            return (
              <React.Fragment key={index}>
                {dateSeparator}
                <p className={isSender ? "sender-message" : "other-message"}>
                  {msg.message}
                  <br />
                  <em
                    style={{
                      fontSize: "0.85em",
                      color: "#fff",
                      textAlign: "right",
                      display: "block",
                    }}
                  >
                    {formattedTimestamp}
                  </em>
                </p>
              </React.Fragment>
            );
          })}
        </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message"
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </Content>

      )}
    </MainContainer>
  );
};
const MainContainer =  styled.div`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);
`

const Content = styled.div`
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
    }
`

const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.4rem;
    border: none;
    position: absolute;
    top: 0px;
    right: 10px;

    &:hover {
        opacity: 0.7;
    }
`

export default Chat;
