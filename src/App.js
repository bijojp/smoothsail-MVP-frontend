import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewHireDashboard from "./pages/NewHireDashboard";
import HRDashboard from "./pages/HRDashboard";
import ITAdminDashboard from "./pages/ITAdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/new-hire" element={<NewHireDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/it-admin" element={<ITAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
