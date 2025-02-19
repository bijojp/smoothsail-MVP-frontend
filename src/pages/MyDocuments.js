import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function MyDocuments({ onUpload }) {
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
          onUpload(); // Call parent function to mark step as completed
        } catch (error) {
          console.error("Error uploading document:", error);
        }
      };
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h1 className="text-3xl font-bold">Upload Required Documents</h1>
      <p className="mt-2 text-gray-600">Please upload your government ID for onboarding:</p>
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-1">Government ID (e.g., Passport, Driver's License)</label>
        <input type="file" className="w-full p-2 border rounded" onChange={handleFileChange} />
      </div>
    </div>
  );
}

export default MyDocuments;
