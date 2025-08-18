import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDeliveryAddress } from "../redux/ordersSlice";
import toast from "react-hot-toast";
import { useUserdeliveryaddressMutation } from "../redux/apiSlice";

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userdeliveryaddress] = useUserdeliveryaddressMutation();

  const [address, setAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    mobileNumber: "",
    deliveryInstructions: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🧠 Fetch saved address on mount
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // const { data } = await axios.get("/api/address", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setAddress(data);
        // dispatch(setDeliveryAddress(data)); // Store in Redux too
      } catch (err) {
        console.log("No saved address found");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [dispatch, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Address couldn't save. Some error happened");
      return;
    }

    try {
      const sendaddress = await userdeliveryaddress({ data: address });

      toast.success("Address saved successfully");

      dispatch(setDeliveryAddress(address));

      setTimeout(() => {
        navigate("/checkout");
      }, 1500);
    } catch (error) {
      console.error("Address Save Error:", error);
      toast.error("Failed to save address");
    }
  };

  if (loading) return <p className="text-center py-8">Loading address...</p>;

  return (
    <div className="max-w-md mx-auto p-6 dark:bg-backgroundDarkHover rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        Delivery Address
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Street */}
        <div className="mb-4">
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

        {/* Apartment */}
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

        {/* City & State */}
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
              className={`w-full px-3 py-2 border dark:text-white ${
                errors.city ? "border-red-500" : "border-gray-300"
              } rounded-md placeholder-[#9e9c9c] dark:placeholder-gray-400`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label
              className="block text-gray-700 mb-2 dark:text-white"
              htmlFor="state">
              State*
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border dark:text-white ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-md placeholder-[#9e9c9c] dark:placeholder-gray-400`}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
        </div>

        {/* ZIP */}
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
            className={`w-full px-3 py-2 border dark:text-white ${
              errors.zipCode ? "border-red-500" : "border-gray-300"
            } rounded-md placeholder-[#9e9c9c] dark:placeholder-gray-400`}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2 dark:text-white"
            htmlFor="mobileNumber">
            Mobile Number*
          </label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={address.mobileNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border dark:text-white ${
              errors.mobileNumber ? "border-red-500" : "border-gray-300"
            } rounded-md placeholder-[#9e9c9c] dark:placeholder-gray-400`}
            placeholder="Mobile Number"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        {/* Instructions */}
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

        {/* Buttons */}
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
