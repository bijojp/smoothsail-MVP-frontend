import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth"; // for updating Firebase Authentication profile

function AboutMeForm({ onSubmit }) {
  // Accept onSubmit as a prop
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    contactNumber: "",
    address: "",
    emergencyContact: "",
    previousEmployer: "",
    jobTitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("User not logged in");
        setLoading(false);
        return;
      }

      // Update profile in Firebase Authentication (if needed)
      await updateProfile(user, {
        displayName: formData.fullName, // You can add other fields like email or photoURL
      });

      // Update Firestore profile data
      const userRef = doc(db, "users", user.email);
      await setDoc(userRef, { ...formData }, { merge: true });

      setMessage("Profile updated successfully!");

      // Trigger the move to "My Documents" after profile update
      onSubmit(); // Call the onSubmit function passed as prop
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. " + error.message); // Display specific error message
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Date of Birth", name: "dob", type: "date" },
          { label: "Contact Number", name: "contactNumber", type: "tel" },
          { label: "Address", name: "address", type: "text" },
          { label: "Emergency Contact", name: "emergencyContact", type: "tel" },
          { label: "Previous Employer", name: "previousEmployer", type: "text" },
          { label: "Job Title", name: "jobTitle", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block font-semibold">{label}</label>
            <input type={type} name={name} className="w-full p-2 border rounded" value={formData[name]} onChange={handleChange} required />
          </div>
        ))}

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </button>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
}

export default AboutMeForm;
