import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';
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
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="/confirm-class/:reservationId/:teacherId" element={<ClassConfirm />} />

          <Route
            path="/teacher-home"
            element={
              <ProtectedRoute>
                <TeacherHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-home"
            element={
              <ProtectedRoute>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-schedule"
            element={
              <ProtectedRoute>
                <ManageSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-classes"
            element={
              <ProtectedRoute>
                <ManageClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-classes"
            element={
              <ProtectedRoute>
                <MyClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-viewer"
            element={
              <ProtectedRoute>
                <ExamViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/class-browser/:subjectId/:subjectName"
            element={
              <ProtectedRoute>
                <ClassBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:studentId/:teacherId/"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-exams"
            element={
              <ProtectedRoute>
                <ExamViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId"
            element={
              <ProtectedRoute>
                <ExamDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-files"
            element={
              <ProtectedRoute>
                <TeacherFileManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-files"
            element={
              <ProtectedRoute>
                <StudentFileView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
