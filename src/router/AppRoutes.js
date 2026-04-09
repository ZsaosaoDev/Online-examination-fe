import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminPage from "../pages/AdminPage";
import ManagerUserPage from "../pages/AdminPage/ManagerUserPage";
import ManagerTestPage from "../pages/AdminPage/ManagerTestPage";
import Login from "../pages/Login/Login";
import AuthCallback from "../pages/AuthCallback/AuthCallback";
import Register from "../pages/Register/Register";
import Verify from "../pages/Verify/Verify";
import ExamTaking from "../pages/Evaluation/ExamTaking";
import Gradebook from "../pages/Evaluation/Gradebook";
import JoinClassroom from "../pages/Classroom/JoinClassroom";

const AppRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/dashboard/exam/:id" element={<PageTransition><ExamTaking /></PageTransition>} />
                <Route path="/dashboard/gradebook/:examId" element={<PageTransition><Gradebook /></PageTransition>} />
                <Route path="/classrooms/join" element={<PageTransition><JoinClassroom /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/auth/verify" element={<PageTransition><Verify /></PageTransition>} />

                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<Navigate to="managerUser" replace />} />
                    <Route path="managerUser" element={<ManagerUserPage />} />
                    <Route path="managerTest" element={<ManagerTestPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AppRoutes;

