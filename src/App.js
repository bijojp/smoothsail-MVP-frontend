import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import NewHireDashboard from "./NewHireDashboard";
import HRDashboard from "./HRDashboard";
import ITAdminDashboard from "./ITAdminDashboard";

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
