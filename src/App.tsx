import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import Login from '../src/pages/login'
import TeacherHome from './pages/teacher-home'
import StudentHome from './pages/student-home'
import ManageSchedule from './pages/manage-schedule';
import ManageClasses from './pages/manage-classes';
import Profile from './pages/profile';
import Settings from './pages/settings';
import MyClasses from './pages/my-classes';
import ClassBrowser from './pages/class-browser';
import ForgotPassword from './pages/forgot-password';
import Register from './pages/register';
import ChangePassword from './pages/change-password';
import ResetPassword from './pages/reset-password';
import AdminHome from './pages/admin-home';
import LandingPage from './pages/landing-page';
import ExamViewer from './pages/exam-viewer';
import ExamDetail from './pages/exam-detail';
import ClassConfirm from './pages/confirm-class';
import Chat from './pages/chat-manager/Chat'
import TeacherFileManagement from './pages/teacher-file-management';
import StudentFileView from './pages/student-file-view';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teacher-home" element={<TeacherHome />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/manage-schedule" element={<ManageSchedule />} />
          <Route path="/manage-classes" element={<ManageClasses />} />
          <Route path="/my-classes" element={<MyClasses />} />
          <Route path="/exam-viewer" element={<ExamViewer />} />
          <Route path="/class-browser/:subjectId/:subjectName" element={<ClassBrowser />} />
          <Route path="/chat/:studentId/:teacherId/" element={<Chat />} />  {/* No nos olvidemos de agregar esto     :studentId/:teacherId*/ }
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/my-exams" element={<ExamViewer />} />
          <Route path="/exam/:examId" element={<ExamDetail />} />
          <Route path="/confirm-class/:reservationId/:teacherId" element={<ClassConfirm />} />
          <Route path="/teacher-files" element={<TeacherFileManagement/>} />
          <Route path="/student-files" element={<StudentFileView/>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;