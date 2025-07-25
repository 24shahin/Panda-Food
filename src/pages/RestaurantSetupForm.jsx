import React, { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ImagePlus } from "lucide-react";
import dataURLtoBlob from "../functions/imagesConvertor";
import { useDispatch, useSelector } from "react-redux";
import {
  useUploadImagesMutation,
  useRegisterRestaurantMutation,
} from "../redux/apiSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RestaurantSetupForm() {
  const userInfo = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const [uploadImages, { isLoading, error }] = useUploadImagesMutation();
  const [registerRestaurant] = useRegisterRestaurantMutation();

  const [ImageError, setImageError] = useState("");
  const [imageStore, setImageStore] = useState([]);

  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
    images: [],
  });

  const handleImageChange = (e) => {
    const File = Array.from(e.target.files);
    File.forEach((img) => {
      if (
        img.type !== "image/webp" &&
        img.type !== "image/jpeg" &&
        img.type !== "image/gif" &&
        img.type !== "image/png"
      ) {
        File.filter((item) => item.name !== img.name);
        setImageError(
          `${img.name} is not supported ! Only gpj, webp, png, gif files are supported.`
        );
        return;
      } else if (img.size > 1024 * 1024 * 5) {
        File.filter((item) => item.name !== img.name);
        setImageError(
          `${img.name} is too large. Please choose file atlest under 5MB file`
        );
        return;
      }
      const renderFiles = new FileReader();
      renderFiles.readAsDataURL(img);
      renderFiles.onload = (UploadImage) => {
        setImageStore((PrevImage) => [...PrevImage, UploadImage.target.result]);
      };
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      const restaurantImage = imageStore.map((item) => dataURLtoBlob(item));
      const path = `${userInfo.user._id}/restaurant_images`;
      let formData = new FormData();
      formData.append("path", path);
      restaurantImage.forEach((img) => {
        formData.append("file", img);
      });

      const responsImage = await uploadImages({
        formData,
        path,
        token: userInfo.token,
      }).unwrap();
      const registerRestaurantInfo = await registerRestaurant({
        name: form.name,
        location: form.location,
        contactNumber: form.contact,
        email: form.email,
        images: responsImage,
      }).unwrap();

      toast.success("Successfully register for restaurant business");
      setTimeout(() => {
        navigate(`/restaurant/${registerRestaurantInfo.user}`);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <div className="w-full h-screen bg-[url('https://img.freepik.com/free-photo/top-view-fast-food-mix-grilled-lamb-meat-cucumber-tomato-french-fries-arugula-salad-with-salmon-parmesan-cheese-grilled-chicken-breast-with-fresh-greens-bread-bas_141793-3996.jpg')] blur-[3px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full">
        <motion.div
          className="max-w-3xl mx-auto p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            🍽️ Setup Your Restaurant
          </h2>

          <div className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <div>
              <label className="block font-semibold mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Contact Number</label>
              <input
                type="tel"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Upload Images</label>
              <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline">
                <ImagePlus className="w-5 h-5" />
                Choose Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              {imageStore.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imageStore.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="preview"
                      className="rounded shadow border object-cover h-24"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              disabled={isLoading}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
              onClick={() => handleSubmit()}>
              <UploadCloud className="w-5 h-5" />
              {isLoading
                ? "Submiting... Restaurant setup"
                : "Submit Restaurant"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
