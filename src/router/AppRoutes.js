import { Routes, Route, Navigate } from "react-router-dom";
import UserPage from "../pages/UserPage";
import AdminPage from "../pages/AdminPage";
import HomePage from "../pages/HomePage";
import ManagerUserPage from "../pages/AdminPage/ManagerUserPage";
import ManagerTestPage from "../pages/AdminPage/ManagerTestPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user" element={<UserPage />} />


            <Route path="/admin" element={<AdminPage />}>
                <Route index element={<Navigate to="managerUser" replace />} />
                {/* set default route to managerUser */}
                <Route path="managerUser" element={<ManagerUserPage />} />
                <Route path="managerTest" element={<ManagerTestPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
