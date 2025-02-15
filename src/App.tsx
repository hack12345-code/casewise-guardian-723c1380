import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthHandler } from "@/components/AuthHandler";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Support from "./pages/Support";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <Router>
      <AuthHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/support" element={<Support />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
