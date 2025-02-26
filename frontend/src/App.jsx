import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layout/rootlayout/rootLayout';
import HomePage from './Pages/homepage/HomePage';
import SigninPage from './Pages/signinpage/SigninPage';
import DashboardLayout from './layout/dashboardlayout/DashboardLayout';
import Dashboard from './Pages/dashboard/Dashboard';
import Chatpage from "./Pages/chatpage/Chatpage";
import {SignedIn,SignedOut} from "@clerk/clerk-react";
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="signin" element={<ProtectedRoute><SigninPage /></ProtectedRoute>} />
                    <Route path="dashboard" element={<DashboardLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="chats/:id" element={<SignedIn><Chatpage /></SignedIn>} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
