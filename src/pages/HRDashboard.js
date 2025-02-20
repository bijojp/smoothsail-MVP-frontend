import { useState, useEffect } from "react";
import { User, LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

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
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
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
          <SidebarItem text="Joinees" active={true} onClick={() => {}} Icon={Users} />
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={22} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {/* Candidates List Sidebar */}
      <div className="w-64 min-w-[16rem] h-screen overflow-y-auto border-r shadow-md bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">Candidates</h2>
        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : (
          userData.map((user) => (
            <div key={user.id} className={`p-3 cursor-pointer rounded-lg transition ${selectedCandidate?.id === user.id ? "bg-blue-200" : "hover:bg-gray-100"}`} onClick={() => setSelectedCandidate(user)}>
              {user.fullName}
            </div>
          ))
        )}
      </div>

      {/* Candidate Details */}
      <div className="flex-auto p-6">
        {selectedCandidate ? (
          <div className="bg-white p-6 shadow-md rounded">
            <h1 className="text-2xl font-bold">{selectedCandidate.fullName}</h1>
            <p className="text-gray-600">Joining Date: {selectedCandidate.joiningDate !== "N/A" ? formatDate(selectedCandidate.joiningDate) : "N/A"}</p>
            <table className="mt-4 w-full border-collapse border border-gray-300">
              <tbody>
                {[
                  ["Date of Birth", selectedCandidate.dob],
                  ["Contact Number", selectedCandidate.contactNumber],
                  ["Address", selectedCandidate.address],
                  ["Emergency Contact", selectedCandidate.emergencyContact],
                  ["Previous Employer", selectedCandidate.previousEmployer],
                  ["Job Title", selectedCandidate.jobTitle],
                ].map(([label, value], index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="p-2 font-semibold w-48">{label}</td>
                    <td className="p-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="mt-6 text-xl font-semibold">Uploaded Documents</h2>
            {selectedCandidate.documents.length > 0 ? (
              <ul className="mt-2">
                {selectedCandidate.documents.map((doc, index) => (
                  <li key={index} className="p-2 border rounded bg-gray-100 mt-2">
                    <button onClick={() => downloadDocument(doc.base64, `${doc.name}.pdf`)} className="text-blue-600 underline">
                      {doc.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
            <div className="mt-6 flex space-x-4">
              <button onClick={() => handleApproval(selectedCandidate.id, "approved")} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Approve
              </button>
              <button onClick={() => handleApproval(selectedCandidate.id, "denied")} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Deny
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xl text-gray-500">Select a candidate to view details</p>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
