import { useNavigate } from 'react-router-dom';
import { Content, ExamCard, ExamInfo, ExamTitle, MainContainer } from './components';
import SideBar from '../../components/sidebar/sidebar';
import Logo from '../../components/top-down-logo';
import Topbar from '../../components/topbar';
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/useAuth';

interface Choice {
  choice_id: string;
  choice_text: string;
  is_correct: boolean;
}

interface Question {
  question_id: string;
  question_text: string;
  choices: Choice[];
}

interface Exam {
  exam_id: string;
  exam_name: string;
  teacher: {
    firstname: string;
    lastname: string;
  };
  subject: string;
  questions: Question[];
}

const ExamViewer = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const { user } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  const handleExamClick = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  useEffect(() => {
    if (!user?.id) {
      setExams([]);
      return;
    }

    const getAllExamsByStudentId = async () => {
      try {
        const response = await fetch(`${URL}exam/get-student-exams-by/${user.id}`);
        if (!response.ok) {
          setExams([]);
          return;
        }
        const data = await response.json();
        setExams(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExams([]);
      }
    };

    getAllExamsByStudentId();
  }, [URL, user?.id]);

  return (
    <MainContainer>
        <SideBar/>
        <Topbar/>
        <Logo/>
        <Content>
          {exams.length === 0 ? (
            <h2>No exams available.</h2>
          ) : (
          <>
            {exams.map((exam) => (
                <ExamCard key={exam.exam_id} onClick={() => handleExamClick(exam.exam_id)}>
                <ExamTitle>{exam.exam_name}</ExamTitle>
                <ExamInfo>Teacher: {exam.teacher.firstname} {exam.teacher.lastname}</ExamInfo>
                <ExamInfo>Subject: {exam.subject}</ExamInfo>
                <ExamInfo>Questions: {exam.questions.length}</ExamInfo>
                </ExamCard>
            ))}
          </>
          )}
          
      </Content>
    </MainContainer>
  );
};

export default ExamViewer;
