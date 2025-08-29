import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  useAddSearchHistoryMutation,
  useSearchQueryMutation,
} from "../redux/apiSlice";
import { Link } from "react-router-dom";

function SearchBox() {
  const inputFocus = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    inputFocus.current.focus();
  }, []);
  const [searchQuery] = useSearchQueryMutation();
  const [addSearchHistory] = useAddSearchHistoryMutation();
  //   const [removeSearchHistory] = useRemoveSearchHistoryMutation();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  //   const { data: getSearchhHistory, refetch } = useGetSearchhHistoryQuery(
  //     undefined,
  //     {
  //       refetchOnMountOrArgChange: true,
  //     }
  //   );
  const handleSearch = async () => {
    try {
      if (searchText == "") {
        setSearchText();
      } else {
        const response = await searchQuery(searchText).unwrap();
        const resuarantArray = response.restaurants;
        const menuItemArray = response.menuItems;
        const finalArray = [...resuarantArray, ...menuItemArray];
        setSearchResult(finalArray);
        console.log(finalArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddSearchUser = async (searchUser) => {
    try {
      const respons = await addSearchHistory({
        searchUser: searchUser,
      }).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(searchResult);

  return (
    <div className="overflow-y-auto py-2 px-4">
      <div className="flex gap-x-2 relative overflow-hidden bg-transparent border-b border-b-secondary_color pb-2 text-black">
        <div
          className={`text-black cursor-pointer ${
            showSearch
              ? "absolute -left-6 transition-all ease-out duration-200"
              : "left-0"
          }`}
          onClick={() => inputFocus.current.focus()}>
          <Search />
        </div>
        <div className="w-[91%] ">
          <input
            type="text"
            placeholder="Search"
            className={`w-full focus:outline-none bg-white font-gilNormal`}
            ref={inputFocus}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setShowSearch(false)}
            onKeyUp={() => handleSearch()}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3">
        {searchText == "" ||
          (searchResult == "" && (
            <p className="font-gilBold text-sm ">Recent searches</p>
          ))}
        <div>
          {/* {getSearchhHistory &&
            searchResult == "" &&
            getSearchhHistory.map((searchUser) => (
              <div
                className="flex justify-between items-center mt-2"
                key={searchUser?.user?._id}>
                <div
                  className="flex items-center gap-x-2 "
                  onClick={() => handleAddSearchUser(searchUser?.user?._id)}>
                  <NavLink to={`/profile/${searchUser?.user?.username}`}>
                    <img
                      src={searchUser?.user?.profilePicture || avater}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  </NavLink>
                  <NavLink to={`/profile/${searchUser?.user?.username}`}>
                    <span className="font-gilNormal text-black text-base">
                      {searchUser?.user?.fname + " " + searchUser?.user?.lname}
                    </span>
                  </NavLink>
                </div>
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-full text-black hover:bg-blue cursor-pointer "
                  onClick={() => handleRemoveSearch(searchUser?.user?._id)}>
                  <CrossIcon />
                </div>
              </div>
            ))} */}
        </div>
        {searchResult?.map((item) => (
          <div
            className="flex items-center gap-x-2 mt-2"
            key={item._id}
            onClick={() =>
              handleAddSearchUser(item.user || item.restaurant.user._id)
            }>
            <Link to={`/restaurant/${item.user}`}>
              <img
                src={item?.image || item?.images[0]}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            </Link>
            <Link to={`/restaurant/${item.user || item.restaurant.user._id}`}>
              <span className="font-gilNormal text-black text-base">
                {item?.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBox;
