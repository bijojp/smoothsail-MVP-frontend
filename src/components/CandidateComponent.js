import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { Check, X, Trash2 } from "lucide-react";

const CandidateComponent = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    dob: "",
    contactNumber: "",
    address: "",
    previousEmployer: "",
    jobTitle: "",
    status: "awaiting",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "candidates"));
        const filteredCandidates = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((candidate) => candidate.status === "awaiting");

        setCandidates(filteredCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const addCandidate = async () => {
    if (!newCandidate.fullName.trim()) return alert("Full Name is required");

    try {
      const docRef = await addDoc(collection(db, "candidates"), newCandidate);
      setCandidates([...candidates, { ...newCandidate, id: docRef.id }]);
      setNewCandidate({
        fullName: "",
        dob: "",
        contactNumber: "",
        address: "",
        previousEmployer: "",
        jobTitle: "",
        status: "awaiting",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const selectCandidate = async (id) => {
    try {
      await updateDoc(doc(db, "candidates", id), { status: "selected" });
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error selecting candidate:", error);
    }
  };

  const rejectCandidate = async (id) => {
    try {
      await updateDoc(doc(db, "candidates", id), { status: "rejected" });
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error rejecting candidate:", error);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await updateDoc(doc(db, "candidates", id), { status: "deleted" });
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Candidates List</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Candidate
        </button>
      </div>

      {/* Candidate Table */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {["Full Name", "Date of Birth", "Contact", "Job Title", "Actions"].map((header, index) => (
                <th key={index} className="p-2 border w-1/5 truncate">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-gray-300">
                <td className="p-2 border w-1/5 truncate">{candidate.fullName}</td>
                <td className="p-2 border w-1/5 truncate">{candidate.dob}</td>
                <td className="p-2 border w-1/5 truncate">{candidate.contactNumber}</td>
                <td className="p-2 border w-1/5 truncate">{candidate.jobTitle}</td>
                <td className="p-2 border w-1/5 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {/* Select (Green Check) */}
                    <button onClick={() => selectCandidate(candidate.id)} className="text-green-500 hover:text-green-700 inline-flex">
                      <Check size={20} />
                    </button>
                    {/* Reject (Yellow Cross) */}
                    <button onClick={() => rejectCandidate(candidate.id)} className="text-yellow-500 hover:text-yellow-700 inline-flex">
                      <X size={20} />
                    </button>
                    {/* Delete (Red Trash) */}
                    <button onClick={() => deleteCandidate(candidate.id)} className="text-red-500 hover:text-red-700 inline-flex">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Candidate Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-2xl font-bold mb-4">Add Candidate</Dialog.Title>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {[
              ["Full Name", "fullName", "text"],
              ["Date of Birth", "dob", "date"],
              ["Contact Number", "contactNumber", "text"],
              ["Address", "address", "text"],
              ["Previous Employer", "previousEmployer", "text"],
              ["Job Title", "jobTitle", "text"],
            ].map(([label, name, type]) => (
              <div key={name}>
                <label className="block font-semibold">{label}</label>
                <input type={type} name={name} value={newCandidate[name]} onChange={handleInputChange} className="border p-2 w-full rounded" />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={addCandidate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Candidate
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default CandidateComponent;
