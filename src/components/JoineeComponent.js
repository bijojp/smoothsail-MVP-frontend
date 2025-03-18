import React from "react";

const JoineeComponent = ({ userData, selectedCandidate, setSelectedCandidate, loading, handleApproval, downloadDocument, formatDate }) => {
  return (
    <div className="flex">
      {/* Joinees List Sidebar */}
      <div className="w-64 min-w-[16rem] h-screen overflow-y-auto border-r shadow-md bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">Joinees</h2>
        {loading ? (
          <p className="text-gray-500">Loading joinees...</p>
        ) : (
          userData.map((user) => (
            <div key={user.id} className={`p-3 cursor-pointer rounded-lg transition ${selectedCandidate?.id === user.id ? "bg-blue-200" : "hover:bg-gray-100"}`} onClick={() => setSelectedCandidate(user)}>
              {user.fullName}
            </div>
          ))
        )}
      </div>

      {/* Joinee Details */}
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
          <p className="text-xl text-gray-500">Select a joinee to view details</p>
        )}
      </div>
    </div>
  );
};

export default JoineeComponent;
