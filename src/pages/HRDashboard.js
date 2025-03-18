import { useState, useEffect } from "react";
import { User, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, addDoc, doc } from "firebase/firestore";

import JoineeComponent from "../components/JoineeComponent";
import CandidateComponent from "../components/CandidateComponent";

const SidebarItem = ({ text, active, onClick, Icon }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100 ${active ? "bg-blue-200" : ""}`} onClick={() => onClick(text)}>
    <Icon size={24} className="text-gray-500" />
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function HRDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [selectedSidebar, setSelectedSidebar] = useState("Joinees");

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  const handleAddCandidate = async () => {
    if (!newCandidateName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "candidates"), {
        name: newCandidateName,
        status: "pending",
      });
      setCandidates([...candidates, { id: docRef.id, name: newCandidateName, status: "pending" }]);
      setNewCandidateName("");
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const handleSidebarClick = (section) => {
    setSelectedSidebar(section);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            fullName: doc.data().fullName || "Unnamed User",
            role: doc.data().role,
            status: doc.data().status,
            joiningDate: doc.data().joiningDate || "N/A",
            dob: doc.data().dob || "N/A",
            contactNumber: doc.data().contactNumber || "N/A",
            address: doc.data().address || "N/A",
            emergencyContact: doc.data().emergencyContact || "N/A",
            previousEmployer: doc.data().previousEmployer || "N/A",
            jobTitle: doc.data().jobTitle || "N/A",
            documents: doc.data().documents?.governmentId ? [{ name: "Government ID", base64: doc.data().documents.governmentId }] : [],
          }))
          .filter((user) => user.role === "new-hire" && user.status === "pre");

        setUserData(usersList);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-GB");
  };

  const handleApproval = async (id, status) => {
    try {
      await updateDoc(doc(db, "users", id), { status });
      setUserData((prev) => prev.filter((user) => user.id !== id));
      setSelectedCandidate(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const downloadDocument = (base64, filename) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 min-w-[16rem] h-screen p-6 border-r shadow-md bg-white flex flex-col justify-between">
        <div>
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg text-lg font-bold shadow-md bg-gray-200 hover:bg-gray-300 mb-8">
            <User size={24} />
            <span>HR Name</span>
          </button>
          <SidebarItem text="Joinees" active={selectedSidebar === "Joinees"} onClick={() => handleSidebarClick("Joinees")} Icon={Users} />
          <SidebarItem text="Candidates" active={selectedSidebar === "Candidates"} onClick={() => handleSidebarClick("Candidates")} Icon={Users} />
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={22} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {selectedSidebar === "Joinees" && <JoineeComponent userData={userData} selectedCandidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate} loading={loading} handleApproval={handleApproval} downloadDocument={downloadDocument} formatDate={formatDate} />}
      {/* Inside return statement */}
      {selectedSidebar === "Candidates" && <CandidateComponent candidates={candidates} setCandidates={setCandidates} formatDate={formatDate} />}
    </div>
  );
}

export default HRDashboard;
