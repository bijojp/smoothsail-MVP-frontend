import React, { useState } from "react";
import { Dialog } from "@headlessui/react"; // For the modal

const CandidateComponent = ({ candidates, setCandidates, formatDate }) => {
  const [newCandidate, setNewCandidate] = useState({
    fullName: "",
    dob: "",
    contactNumber: "",
    address: "",
    emergencyContact: "",
    previousEmployer: "",
    jobTitle: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const addCandidate = () => {
    if (!newCandidate.fullName.trim()) return alert("Full Name is required");
    setCandidates([...candidates, { ...newCandidate, id: Date.now() }]);
    setNewCandidate({
      fullName: "",
      dob: "",
      contactNumber: "",
      address: "",
      emergencyContact: "",
      previousEmployer: "",
      jobTitle: "",
    });
    setIsModalOpen(false);
  };

  const deleteCandidate = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
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
                  <button onClick={() => deleteCandidate(candidate.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
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
              ["Emergency Contact", "emergencyContact", "text"],
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
