import { useState, useEffect } from "react";
import { User, LogOut, Users, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const SidebarItem = ({ text, active, onClick, Icon }) => (
  <div className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition hover:bg-gray-100 ${active ? "bg-blue-200" : ""}`} onClick={() => onClick(text)}>
    <Icon size={24} className="text-gray-500" />
    <span className="text-lg font-semibold">{text}</span>
  </div>
);

function ITAdminDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSidebar, setSelectedSidebar] = useState("Candidates");

  const [showAssetForm, setShowAssetForm] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [category, setCategory] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddAsset = async () => {
    if (!assetName) {
      alert("Asset Name is required!");
      return;
    }

    const newAsset = {
      assetName,
      assignedTo: assignedTo || "Unassigned",
      category,
      purchaseDate,
    };

    try {
      await addDoc(collection(db, "assets"), newAsset);
      setAssets([...assets, newAsset]); // Update UI immediately
      setAssetName("");
      setAssignedTo("");
      setCategory("");
      setPurchaseDate("");
      setShowAssetForm(false);
    } catch (error) {
      console.error("Error adding asset:", error);
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      setLoadingAssets(true);
      try {
        const querySnapshot = await getDocs(collection(db, "assets"));
        const assetList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAssets(assetList);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
      setLoadingAssets(false);
    };

    fetchAssets();

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
          .filter((user) => user.role === "new-hire");

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
            <span>IT Admin</span>
          </button>
          <SidebarItem text="Candidates" active={selectedSidebar === "Candidates"} onClick={() => setSelectedSidebar("Candidates")} Icon={Users} />
          <SidebarItem text="Assets" active={selectedSidebar === "Assets"} onClick={() => setSelectedSidebar("Assets")} Icon={Box} />
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600">
          <LogOut size={22} />
          <span className="text-lg font-semibold">Log Out</span>
        </button>
      </div>

      {/* Candidates List Sidebar */}
      {selectedSidebar === "Candidates" && (
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
      )}

      {/* Candidate Details */}
      <div className="flex-auto p-6">
        {selectedSidebar === "Candidates" && selectedCandidate ? (
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

            {/* Assigned Assets */}
            <h2 className="mt-6 text-xl font-semibold">Assigned Assets</h2>
            {assets.some((asset) => asset.assignedTo === selectedCandidate.fullName) ? (
              <ul className="mt-2">
                {assets
                  .filter((asset) => asset.assignedTo === selectedCandidate.fullName)
                  .map((asset) => (
                    <li key={asset.id} className="p-2 border rounded bg-gray-100 mt-2">
                      {asset.assetName} - {asset.category}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No assets assigned.</p>
            )}

            {/* Uploaded Documents */}
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
          </div>
        ) : selectedSidebar === "Assets" ? (
          <div className="bg-white p-6 shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4">Assets</h1>

            {/* Add Asset Button */}
            <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setShowAssetForm(!showAssetForm)}>
              {showAssetForm ? "Cancel" : "Add Asset"}
            </button>

            {/* Add Asset Form */}
            {showAssetForm && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-semibold mb-2">Add New Asset</h2>

                <input type="text" placeholder="Asset Name" value={assetName} onChange={(e) => setAssetName(e.target.value)} className="w-full p-2 border rounded mb-2" />

                {/* Assigned To - Autocomplete Dropdown */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Assign to (Optional)"
                    value={assignedTo}
                    onChange={(e) => {
                      setAssignedTo(e.target.value);
                      setDropdownVisible(true); // Show dropdown when typing
                    }}
                    onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Hide dropdown on blur after a delay
                    className="w-full p-2 border rounded mb-2"
                  />
                  {dropdownVisible && assignedTo && (
                    <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-auto rounded shadow-md">
                      {userData
                        .filter((user) => user.fullName.toLowerCase().includes(assignedTo.toLowerCase()))
                        .map((user) => (
                          <li
                            key={user.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onMouseDown={() => {
                              setAssignedTo(user.fullName);
                              setDropdownVisible(false); // Hide dropdown immediately on selection
                            }}
                          >
                            {user.fullName}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded mb-2" />

                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="w-full p-2 border rounded mb-2" />

                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleAddAsset}>
                  Save Asset
                </button>
              </div>
            )}

            {/* Assets Table */}
            {loadingAssets ? (
              <p className="text-gray-500">Loading assets...</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border border-gray-300 text-left">Asset Name</th>
                    <th className="p-3 border border-gray-300 text-left">Assigned To</th>
                    <th className="p-3 border border-gray-300 text-left">Category</th>
                    <th className="p-3 border border-gray-300 text-left">Purchase Date</th>
                    <th className="p-3 border border-gray-300 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length > 0 ? (
                    assets.map((asset) => (
                      <tr key={asset.id} className="border border-gray-300">
                        <td className="p-3 border border-gray-300">{asset.assetName}</td>
                        <td className="p-3 border border-gray-300">{asset.assignedTo || "Unassigned"}</td>
                        <td className="p-3 border border-gray-300">{asset.category}</td>
                        <td className="p-3 border border-gray-300">{asset.purchaseDate || "N/A"}</td>
                        <td className="p-3 border border-gray-300">{asset.assignedTo ? "Assigned" : "Available"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-gray-500">
                        No assets available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p className="text-xl text-gray-500">Select a candidate to view details</p>
        )}
      </div>
    </div>
  );
}

export default ITAdminDashboard;
