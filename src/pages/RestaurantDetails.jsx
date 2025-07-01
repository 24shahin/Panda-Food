import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuItemCard from "../components/MenuItemCard";
import { MapPin, Star, MessageSquare } from "lucide-react";
import OutSideClick from "../functions/click";
import { useParams } from "react-router-dom";

const restaurant = {
  name: "Pizza Palace",
  _id: 1,
  location: "123 Main St, New York",
  rating: 4.7,
  images: [
    "https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ0EqHI6h5QgFTXGG_1i2FADG1xulRbVtecA&s",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  ],
  menu: [
    {
      _id: 1,
      name: "Pepperoni Pizza",
      image: "https://source.unsplash.com/featured/?pepperoni-pizza",
      price: "12.99",
      rating: 4.5,
      sold: 230,
    },
    {
      _id: 2,
      name: "BBQ Chicken Pizza",
      image: "https://source.unsplash.com/featured/?bbq-chicken-pizza",
      price: "13.99",
      rating: 4.6,
      sold: 189,
    },
    {
      _id: 3,
      name: "Veggie Delight",
      image: "https://source.unsplash.com/featured/?veggie-pizza",
      price: "11.99",
      rating: 4.2,
      sold: 112,
    },
    {
      _id: 4,
      name: "Margherita",
      image: "https://source.unsplash.com/featured/?margherita",
      price: "10.99",
      rating: 4.7,
      sold: 321,
    },
    {
      _id: 5,
      name: "Cheesy Crust Pizza",
      image: "https://source.unsplash.com/featured/?cheese-pizza",
      price: "14.50",
      rating: 4.8,
      sold: 275,
    },
    {
      _id: 6,
      name: "Hawaiian Pizza",
      image: "https://source.unsplash.com/featured/?hawaiian-pizza",
      price: "13.25",
      rating: 4.4,
      sold: 187,
    },
    {
      _id: 7,
      name: "Meat Lovers",
      image: "https://source.unsplash.com/featured/?meat-pizza",
      price: "15.99",
      rating: 4.6,
      sold: 244,
    },
    {
      _id: 8,
      name: "Spinach & Feta",
      image: "https://source.unsplash.com/featured/?spinach-pizza",
      price: "12.25",
      rating: 4.5,
      sold: 132,
    },
    {
      _id: 9,
      name: "Buffalo Chicken",
      image: "https://source.unsplash.com/featured/?buffalo-pizza",
      price: "14.75",
      rating: 4.7,
      sold: 211,
    },
    {
      _id: 10,
      name: "Mushroom Pizza",
      image: "https://source.unsplash.com/featured/?mushroom-pizza",
      price: "11.75",
      rating: 4.3,
      sold: 165,
    },
    {
      _id: 11,
      name: "Four Cheese Pizza",
      image: "https://source.unsplash.com/featured/?cheese",
      price: "14.00",
      rating: 4.9,
      sold: 198,
    },
    {
      _id: 12,
      name: "Garlic Bread Pizza",
      image: "https://source.unsplash.com/featured/?garlic-pizza",
      price: "9.99",
      rating: 4.1,
      sold: 94,
    },
    {
      _id: 13,
      name: "Paneer Tikka Pizza",
      image: "https://source.unsplash.com/featured/?paneer-pizza",
      price: "13.50",
      rating: 4.6,
      sold: 153,
    },
    {
      _id: 14,
      name: "Tandoori Chicken Pizza",
      image: "https://source.unsplash.com/featured/?tandoori-pizza",
      price: "14.99",
      rating: 4.7,
      sold: 175,
    },
    {
      _id: 15,
      name: "Supreme Pizza",
      image: "https://source.unsplash.com/featured/?supreme-pizza",
      price: "15.25",
      rating: 4.8,
      sold: 210,
    },
  ],
};

const sampleComments = [
  {
    _id: 1,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/100?img=1",
    time: "2 hours ago",
    text: "Amazing pizza! Loved the crust and the toppings.",
  },
  {
    _id: 2,
    name: "Sarah Smith",
    avatar: "https://i.pravatar.cc/100?img=2",
    time: "5 hours ago",
    text: "Quick delivery and fresh ingredients. Definitely ordering again.",
  },
  {
    _id: 3,
    name: "Ali Khan",
    avatar: "https://i.pravatar.cc/100?img=3",
    time: "1 day ago",
    text: "Delicious! Great service and presentation too.",
  },
];

export default function RestaurantDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [commentBoxShow, setCommentBoxShow] = useState(false);
  const [userCommentShow, setUserCommentShow] = useState(false);
  const commentRef = useRef(null);
  const userCommentShowRef = useRef(null);
  OutSideClick(commentRef, () => setCommentBoxShow(false));
  OutSideClick(userCommentShowRef, () => setUserCommentShow(false));
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % restaurant.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  const { id } = useParams();

  return (
    <div className="bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-primary dark:bg-surfaceDark px-4 py-3 shadow-md dark:bg-backgroundDark  text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center ">
          <h2 className="text-xl font-semibold w-1/2">{restaurant.name}</h2>
          <div className="relative w-1/2 justify-end flex gap-x-5">
            <button
              className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded-md hover:bg-secondary/50 flex items-center justify-end"
              onClick={() => setUserCommentShow(true)}>
              <MessageSquare className="inline-block w-4 h-4 mr-1" />
              See User's Comment
            </button>
            <button
              className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded-md hover:bg-secondary/50 flex items-center justify-end"
              onClick={() => setCommentBoxShow(true)}>
              <MessageSquare className="inline-block w-4 h-4 mr-1" />
              leave a Comment
            </button>
            {/* comment section */}
            {userCommentShow && (
              <div
                className="absolute w-full right-0 top-10 "
                ref={userCommentShowRef}>
                <div className="max-w-3xl mx-auto px-4 py-8 bg-backgroundLight dark:bg-backgroundDarkHover rounded dark:text-white text-black">
                  <h3 className="text-2xl font-semibold mb-4">
                    Customer Comments
                  </h3>
                  <div className="space-y-4">
                    {sampleComments.map((c, index) => (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className=" dark:bg-backgroundDark  dark:text-white text-black p-4 rounded-lg shadow-sm border border-gray-300 flex gap-4">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-sm">{c.name}</div>
                          <div className="text-xs text-mutedForeground mb-1">
                            {c.time}
                          </div>
                          <p className="text-sm">{c.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full h-64 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={restaurant.images[currentImageIndex]}
            src={restaurant.images[currentImageIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            alt={`Slide ${currentImageIndex}`}
            className="w-full h-full object-cover brightness-75 absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute bottom-4 left-[52px] text-white z-10">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-sm flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {restaurant.location}
          </p>
          <p className="text-sm flex items-center mt-1">
            <Star className="w-4 h-4 mr-1 text-yellow-300" />{" "}
            {restaurant.rating} / 5
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 gap-4">
        {restaurant.menu.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            restaurantId={restaurant._id}
            restaurantName={restaurant.name}
          />
        ))}
      </div>
      {/* comment Box */}
      {commentBoxShow && (
        <div
          className="fixed bottom-4 right-4 w-full max-w-sm z-40"
          ref={commentRef}>
          <div className="dark:bg-backgroundDarkHover rounded-xl shadow-lg border border-gray-300 px-4 py-3 bg-backgroundLight ">
            <label
              htmlFor="comment"
              className="text-sm font-semibold block mb-1 dark:text-white text-black">
              Leave a comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="2"
              className="w-full  rounded-md p-2 text-sm  text-black dark:text-white focus:outline-none"
              placeholder="Write something nice..."></textarea>
            <button className="mt-2 w-full text-sm bg-primary hover:bg-primary/90 text-white py-2 rounded-md">
              Post Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
