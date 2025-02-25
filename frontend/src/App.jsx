import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/homepage/Homepage";
import Dashboard from "./Pages/dashboard/Dashboard";
import Chatpage from "./Pages/chatpage/Chatpage";
import RootLayout from "./layout/rootlayout/rootLayout";
import DashboardLayout from "./layout/dashboardlayout/DashboardLayout";
import Signinpage from "./Pages/signinpage/Signinpage";
import SignupPage from "./Pages/signuppage/signupPage";
import { RedirectToSignIn } from "@clerk/clerk-react";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                {/* add outlet in rootlayout for nested */}
                  <Route index element={<Homepage />} />
                  <Route path="/dashboard" element={<DashboardLayout/>} >
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard/chats/:id" element={<Chatpage />} />
                  </Route>
                  <Route path="/signin" element={<Signinpage />} />
                  <Route path="/signup" element={<SignupPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
