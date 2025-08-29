import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  useDeliveryManRegisterimagesMutation,
  useDeliveryManRegisterMutation,
  useEditDeliveryManRegisterMutation,
} from "../../redux/apiSlice";
import dataURLtoBlob from "../../functions/imagesConvertor";
export default function RegisterDeliveryMan() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    image: "",
    vehicleNumber: "",
    drivingLicence: "",
  });
  const [imageError, setImageError] = useState("");
  const [Image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [DeliveryManRegister, { error }] = useDeliveryManRegisterMutation();
  const [editDeliveryManRegister] = useEditDeliveryManRegisterMutation();
  const [deliveryManRegisterimages] = useDeliveryManRegisterimagesMutation();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const allowedTypes = [
        "image/webp",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP, or GIF images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target.result);
      reader.readAsDataURL(file);

      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name) {
      return alert("Name is required.");
    }
    try {
      setIsLoading(true);
      const addedeliveryMan = await DeliveryManRegister(form).unwrap();
      if (form.image && form.image instanceof File) {
        const blob = await dataURLtoBlob(Image);
        const path = `DeliveryMan_images/${addedeliveryMan._id}`;
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("path", path);
        const uploaded = await deliveryManRegisterimages({
          formData,
          path,
        }).unwrap();
        await editDeliveryManRegister({
          id: addedeliveryMan._id,
          data: { image: uploaded[0].url },
        }).unwrap();
      }
      setIsLoading(false);
      toast.success(" Delivery Man Registration successfully Done");
      setTimeout(() => navigate(`/deliverymanlogin`), 2000);
    } catch (err) {
      console.error("Error:", err);
      toast.error(`${err?.data?.message}`);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-backgroundLight dark:bg-backgroundDark px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.form
        onSubmit={handleRegister}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}>
        <h2 className="text-3xl font-bold text-center text-green-600 dark:text-white">
          Create Account Delivery Man{" "}
        </h2>
        <div className="flex gap-5 w-full flex-wrap">
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="01*****"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Vehicle Number"
              value={form.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Driving Licence (Optional)
            </label>
            <input
              type="text"
              name="drivingLicence"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Driving Licence"
              value={form.drivingLicence}
              onChange={handleChange}
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="mt-1 w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-[48%] ">
            <label className="w-full text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 cursor-pointer w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="w-[48%] flex justify-center items-center">
            {Image && (
              <img
                src={Image}
                alt="preview"
                className="w-28 h-28 rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300">
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error.data?.message || "Registration failed"}
          </p>
        )}
        <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
          Already have a delivery man account?{" "}
          <a
            href="/deliverymanlogin"
            className="text-green-600 hover:underline font-semibold">
            Login
          </a>
        </p>
      </motion.form>
    </motion.div>
  );
}
