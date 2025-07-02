// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { updateOrderStatus } from "../redux/ordersSlice";
// import moment from "moment";
// import toast from "react-hot-toast";

// export default function AdminOrders() {
//   const dispatch = useDispatch();
//   const orders = useSelector((state) => state.orders.list);

//   const handleMarkDelivered = (orderId) => {
//     dispatch(updateOrderStatus({ orderId, newStatus: "Delivered" }));
//     toast.success(`Order #${orderId} marked as Delivered`);
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Admin - All Orders
//       </h1>
//       {orders.length === 0 ? (
//         <p className="text-gray-500">No orders found.</p>
//       ) : (
//         <div className="space-y-6">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="border p-4 rounded-md shadow bg-white dark:bg-gray-800">
//               <div className="flex justify-between items-center mb-2">
//                 <p className="text-sm text-gray-500">
//                   {moment(order.createdAt).format("MMMM D, YYYY h:mm A")}
//                 </p>
//                 <p className="font-semibold text-secondary">
//                   Order #{order.id}
//                 </p>
//               </div>

//               <div className="text-sm mb-2">
//                 {order.items.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex justify-between items-center border-b py-2">
//                     <div>
//                       <p>
//                         {item.name} x {item.quantity}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {item.restaurantName}
//                       </p>
//                     </div>
//                     <p>${(item.quantity * item.price).toFixed(2)}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="text-sm text-gray-600 dark:text-gray-300">
//                 <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
//                 <p>Delivery Fee: ${order.deliveryFee.toFixed(2)}</p>
//                 <p className="font-bold text-black dark:text-white">
//                   Total: ${order.total.toFixed(2)}
//                 </p>
//               </div>

//               {/* Delivery Address */}
//               {order.address && (
//                 <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-3 rounded">
//                   <p className="font-semibold underline mb-1">
//                     Delivery Address
//                   </p>
//                   <p>
//                     {order.address.street}, {order.address.city},{" "}
//                     {order.address.state} {order.address.zipCode}
//                   </p>
//                   <p>Mobile: {order.address.mobileNumber}</p>
//                   <p>Instructions: {order.address.deliveryInstructions}</p>
//                 </div>
//               )}

//               {/* Admin Action */}
//               <div className="mt-4">
//                 {order.status !== "Delivered" ? (
//                   <button
//                     onClick={() => handleMarkDelivered(order.id)}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//                     Mark as Delivered
//                   </button>
//                 ) : (
//                   <p className="text-green-600 font-semibold">Delivered</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://your-backend.com/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `https://your-backend.com/api/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (orders.length === 0)
    return <p className="p-4 text-center">No orders found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl mb-6 font-semibold">Admin - All Orders</h1>
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 p-2">Order ID</th>
            <th className="border border-gray-300 p-2">User</th>
            <th className="border border-gray-300 p-2">Items</th>
            <th className="border border-gray-300 p-2">Total Price</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="border border-gray-300 p-2">{order._id}</td>
              <td className="border border-gray-300 p-2">{order.user.name}</td>
              <td className="border border-gray-300 p-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between mb-1">
                    <span>{item.name}</span>
                    <span>× {item.quantity}</span>
                  </div>
                ))}
              </td>
              <td className="border border-gray-300 p-2">
                £{order.totalPrice.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">{order.status}</td>
              <td className="border border-gray-300 p-2">
                {order.status !== "Delivered" && (
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => updateOrderStatus(order._id, "Delivered")}>
                    Mark Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
