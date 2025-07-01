import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../redux/ordersSlice";
import toast from "react-hot-toast";

const AddressForm = ({ onSave, initialAddress = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: initialAddress.street || "",
    city: initialAddress.city || "",
    state: initialAddress.state || "",
    zipCode: initialAddress.zipCode || "",
    mobileNumber: initialAddress.mobileNumber || "",
    apartment: initialAddress.apartment || "",
    deliveryInstructions: initialAddress.deliveryInstructions || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile Number is required";
    if (!address.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(setDeliveryAddress(address));
      toast.success("Address success save");
      setTimeout(() => {
        navigate("/checkout");
      }, 1500);
    } else {
      toast.error(`Address couldn't save. Some error happened`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6  dark:bg-backgroundDarkHover rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        Delivery Address
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="street">
            Street Address*
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleChange}
            className={`w-full px-3 py-2 border dark:text-white placeholder-[#9e9c9c] dark:placeholder-gray-400 ${
              errors.street ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            placeholder="123 Main St"
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="apartment">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={address.apartment}
            onChange={handleChange}
            className="w-full px-3 py-2 border dark:text-white border-gray-300 rounded-md placeholder-[#9e9c9c] dark:placeholder-gray-400"
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 mb-2 dark:text-white"
              htmlFor="city">
              City*
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border dark:text-white placeholder-[#9e9c9c] dark:placeholder-gray-400 ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="state">
              State*
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border dark:text-white placeholder-[#9e9c9c] dark:placeholder-gray-400 ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="zipCode">
            ZIP Code*
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            className={`w-full px-3 py-2 border dark:text-white placeholder-[#9e9c9c] dark:placeholder-gray-400 ${
              errors.zipCode ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="MobileNumber">
            Mobile Number*
          </label>
          <input
            type="text"
            id="MobileNmber"
            name="mobileNumber"
            value={address.mobileNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border dark:text-white placeholder-[#9e9c9c] dark:placeholder-gray-400 ${
              errors.mobileNumber ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            placeholder="Mobile Number"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="deliveryInstructions">
            Delivery Instructions (Optional)
          </label>
          <textarea
            id="deliveryInstructions"
            name="deliveryInstructions"
            value={address.deliveryInstructions}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-white resize-none placeholder-[#9e9c9c] dark:placeholder-gray-400"
            placeholder="Gate code, building instructions, etc."
            rows="3"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700">
            Save Address & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
