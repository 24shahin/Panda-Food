import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, MessageSquare } from "lucide-react";
import OutSideClick from "../functions/click";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useMyRestaurantQuery,
  useSelectedRestaurantQuery,
} from "../redux/apiSlice";
import { CiMenuKebab } from "react-icons/ci";
import AddMenu from "../components/Restaurant/AddMenu";

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
  const userInfo = useSelector((state) => state?.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const isVisitor = !!id;
  const isOwner = userInfo?.user?.role === "restaurant" && !id;

  const { data: selectedRestaurant, refetch: refetchSelectedRestaurant } =
    useSelectedRestaurantQuery(id, {
      skip: !isVisitor,
    });
  const {
    data: myRestaurantDetails,
    isLoading,
    refetch: refetchMyRestaurantDetails,
  } = useMyRestaurantQuery(undefined, { skip: !isOwner });

  const [restaurants, setRestaurants] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [commentBoxShow, setCommentBoxShow] = useState(false);
  const [userCommentShow, setUserCommentShow] = useState(false);
  const [menu, setMenu] = useState(false);

  const MenuRef = useRef(null);
  const commentRef = useRef(null);
  const userCommentShowRef = useRef(null);

  OutSideClick(MenuRef, () => setMenu(false));
  OutSideClick(commentRef, () => setCommentBoxShow(false));
  OutSideClick(userCommentShowRef, () => setUserCommentShow(false));

  useEffect(() => {
    if (isOwner && myRestaurantDetails) {
      setRestaurants(myRestaurantDetails);
    } else if (isVisitor && selectedRestaurant) {
      setRestaurants(selectedRestaurant);
    }
  }, [isOwner, isVisitor, myRestaurantDetails, selectedRestaurant]);

  useEffect(() => {
    if (!restaurants?.images) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % restaurants.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [restaurants]);

  if (isLoading || !restaurants) {
    return (
      <h1 className="text-2xl text-primary font-extrabold w-full h-screen flex items-center justify-center">
        Loading . . .
      </h1>
    );
  }
  const userId = id === undefined ? userInfo?.user?._id : id;

  const visitor = userInfo?.user?._id === restaurants?.user;

  return (
    <div className="bg-backgroundLight dark:bg-backgroundDark text-black dark:text-white min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-primary dark:bg-surfaceDark px-4 py-3 shadow-md dark:bg-backgroundDark  text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center ">
          <h2 className="text-xl font-semibold w-1/2">{restaurants.name}</h2>
          <div className="relative w-1/2 justify-end flex gap-x-5">
            <button
              className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded-md hover:bg-secondary/50 flex items-center justify-end"
              onClick={() => setUserCommentShow(true)}>
              <MessageSquare className="inline-block w-4 h-4 mr-1" />
              See User's Comment
            </button>
            {!visitor && (
              <button
                className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded-md hover:bg-secondary/50 flex items-center justify-end"
                onClick={() => setCommentBoxShow(true)}>
                <MessageSquare className="inline-block w-4 h-4 mr-1" />
                leave a Comment
              </button>
            )}
            {visitor && (
              <div className="relative">
                <div
                  className="text-white cursor-pointer bg-secondary/30 px-3 py-2 rounded-md hover:bg-secondary/50 flex items-center justify-end"
                  onClick={() => setMenu(true)}>
                  <CiMenuKebab className="inline-block" />
                </div>
                {menu && (
                  <div
                    className="absolute w-[400px] right-0 top-9 h-[200px] bg-[#885353f3] p-5 shadow-lg"
                    ref={MenuRef}>
                    <h3 className="text-lg mb-3">
                      Restaurant Details and add somethings
                    </h3>
                    <button
                      className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded hover:bg-secondary/50 flex items-center justify-end"
                      onClick={() => navigate("/restaurantOwner/addmenu")}>
                      Add a Menu item
                    </button>
                    <button
                      className="text-white cursor-pointer bg-secondary/30 px-3 py-1 rounded hover:bg-secondary/50 flex items-center justify-end mt-3"
                      onClick={() =>
                        navigate("/restaurant/dashboard/overview")
                      }>
                      Go to Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}
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
            key={restaurants?.images?.[currentImageIndex]}
            src={restaurants?.images?.[currentImageIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            alt={`image`}
            className="w-full h-full object-cover brightness-75 absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute bottom-4 left-[52px] text-white z-10">
          <h1 className="text-3xl font-bold">{restaurants.name}</h1>
          <p className="text-sm flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {restaurants.location}
          </p>
          <p className="text-sm flex items-center mt-1">
            <Star className="w-4 h-4 mr-1 text-yellow-300" />{" "}
            {restaurants.rating} / 5
          </p>
          <p className="text-sm flex items-center mt-1">
            Email : {restaurants.email}
          </p>
          <p className="text-sm flex items-center mt-1">
            Contact : {restaurants.contactNumber}
          </p>
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 gap-4">
        {restaurants?.restaurantMenuItem &&
        restaurants?.restaurantMenuItem.length > 0 ? (
          restaurants.restaurantMenuItem
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}>
                <AddMenu
                  item={item}
                  visitor={visitor}
                  restaurantId={restaurants?.user}
                  restaurantName={restaurants.name}
                  onItemUpdated={() => {
                    if (isOwner) {
                      refetchMyRestaurantDetails();
                    } else if (isVisitor) {
                      refetchSelectedRestaurant();
                    }
                  }}
                />
              </motion.div>
            ))
        ) : (
          <span>You need to add menu item for your restaurant</span>
        )}
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
