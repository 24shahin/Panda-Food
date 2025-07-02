// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { useUpdateProfileMutation } from "../redux/authApiSlice";
// import { setUser } from "../redux/authSlice";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "" });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const updatedUser = await updateProfile(formData).unwrap();
      //   dispatch(setUser(updatedUser.user));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 mt-10 shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary dark:text-white">
        Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            value={formData.email}
            disabled
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            New Password (optional)
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          //   disabled={isLoading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-orange-600 transition">
          {/* {isLoading ? "Saving..." : "Update Profile"} */} jbdovbdso
        </button>
      </form>
    </div>
  );
}
