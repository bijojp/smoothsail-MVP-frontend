import { useState } from "react";

function MyDocuments({ onUpload }) {
  // Receive the onUpload function as a prop
  const [documents, setDocuments] = useState({
    governmentId: null,
    proofOfAddress: null,
    educationalCertificates: null,
    previousEmploymentProof: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleSubmit = () => {
    // Handle the form submission logic here, e.g., upload files to Firebase
    console.log("Submitting documents:", documents);

    // Call the parent function to mark the document step as completed
    onUpload();
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold">Upload Required Documents</h1>
      <p className="mt-2 text-gray-600">Please upload the following required documents for onboarding:</p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Government ID (e.g., Passport, Driver's License)</label>
          <input type="file" name="governmentId" className="w-full p-2 border rounded" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Proof of Address</label>
          <input type="file" name="proofOfAddress" className="w-full p-2 border rounded" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Educational Certificates</label>
          <input type="file" name="educationalCertificates" className="w-full p-2 border rounded" onChange={handleFileChange} />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Previous Employment Proof</label>
          <input type="file" name="previousEmploymentProof" className="w-full p-2 border rounded" onChange={handleFileChange} />
        </div>
      </div>

      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleSubmit}>
        Upload Documents
      </button>
    </div>
  );
}

export default MyDocuments;
