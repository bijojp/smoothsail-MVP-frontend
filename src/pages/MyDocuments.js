import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { CloudDownload } from "lucide-react";

function MyDocuments({ onUpload }) {
  const [existingDocument, setExistingDocument] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().documents?.governmentId) {
          setExistingDocument(docSnap.data().documents.governmentId);
        }
      }
    };
    fetchDocument();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const user = auth.currentUser;

    if (file && user) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64
      reader.onload = async () => {
        const base64String = reader.result;
        console.log("Base64 Document:", base64String); // Log Base64 string

        try {
          const userRef = doc(db, "users", user.email);
          await setDoc(userRef, { documents: { governmentId: base64String } }, { merge: true });
          console.log("Document uploaded to Firestore");
          setExistingDocument(base64String); // Update displayed document
          onUpload(); // Call parent function to mark step as completed
        } catch (error) {
          console.error("Error uploading document:", error);
        }
      };
    }
  };

  const downloadPDF = () => {
    if (!existingDocument) return;
    const user = auth.currentUser;
    if (!user) return;

    const link = document.createElement("a");
    link.href = existingDocument;
    link.download = `government_id_${user.email}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold">Upload Required Documents</h1>
      <p className="mt-2 text-gray-600">Please upload your government ID for onboarding:</p>
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-1">Government ID (e.g., Passport, Driver's License)</label>
        {existingDocument && (
          <div className="flex items-center space-x-2 mb-2">
            <CloudDownload className="h-6 w-6 text-green-500" />
            <button onClick={downloadPDF} className="text-blue-600 hover:underline">
              Download File
            </button>
          </div>
        )}
        <input type="file" className="w-full p-2 border rounded" onChange={handleFileChange} />
        <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleFileChange}>
          Upload Document
        </button>
      </div>
    </div>
  );
}

export default MyDocuments;
