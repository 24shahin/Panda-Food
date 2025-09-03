import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search } from "lucide-react";
import {
  useAddSearchHistoryMutation,
  useGetSearchhHistoryQuery,
  useRemoveSearchHistoryMutation,
  useSearchQueryMutation,
} from "../redux/apiSlice";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { X as CrossIcon } from "lucide-react";
function SearchBox({ setShowSearchBox }) {
  const inputFocus = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    inputFocus.current.focus();
  }, []);
  const [searchQuery] = useSearchQueryMutation();
  const [addSearchHistory] = useAddSearchHistoryMutation();
  const [removeSearchHistory] = useRemoveSearchHistoryMutation();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { data: getSearchhHistory, refetch } = useGetSearchhHistoryQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const handleSearch = async () => {
    try {
      if (searchText === "") {
        setSearchResult([]);
      } else {
        const response = await searchQuery(searchText).unwrap();
        const restaurantArray = response.restaurants || [];
        const menuItemArray = response.menuItems || [];
        const finalArray = [...restaurantArray, ...menuItemArray];
        setSearchResult(finalArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddSearchUser = async ({ menuItem, restaurant }) => {
    try {
      await addSearchHistory({ menuItem, restaurant }).unwrap();
      refetch();
      setShowSearchBox(false);
    } catch (error) {
      console.log(error);
    }
  };

  const DebounceRemoveSearch = useCallback(
    debounce(async (searchId) => {
      try {
        const response = await removeSearchHistory(searchId).unwrap();
        if (response.message === "Search history entry deleted") {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }, 300),
    [removeSearchHistory, refetch]
  );
  const handleRemoveSearch = (searchId) => {
    DebounceRemoveSearch(searchId);
  };
  return (
    <div className=" py-2 px-4 overflow-hidden h-full">
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
        <div className="w-[91%] h-[10%]">
          <input
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none bg-transparent font-gilNormal placeholder-[#d8cfcf] dark:placeholder-gray-400"
            ref={inputFocus}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setShowSearch(false)}
            onKeyUp={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-3 h-[90%] overflow-hidden overflow-y-auto pb-7">
        {searchText === "" && searchResult.length === 0 && (
          <p className="font-gilBold text-sm dark:text-white text-black">
            Recent searches
          </p>
        )}
        {/* ✅ Recent search history */}
        <div className="overflow-hidden overflow-y-auto">
          {getSearchhHistory &&
            searchResult.length === 0 &&
            getSearchhHistory.history?.map((search) => {
              const item = search.restaurant || search.menuItem;

              const isRestaurant = !!search.restaurant;
              return (
                <div
                  className="flex justify-between items-center mt-2"
                  key={search._id}>
                  <div
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => {
                      handleAddSearchUser(
                        isRestaurant
                          ? {
                              menuItem: null,
                              restaurant: search.restaurant._id,
                            }
                          : { menuItem: search.menuItem._id, restaurant: null }
                      );
                    }}>
                    <Link
                      to={`/restaurant/${
                        item?.user?._id || item.restaurant?.user?._id
                      }${!isRestaurant ? `?highlight=${item._id}` : ""}`}>
                      <img
                        src={
                          search.restaurant?.images?.[0] ||
                          search.menuItem?.image
                        }
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </Link>
                    <Link
                      to={`/restaurant/${
                        item?.user?._id || item.restaurant?.user?._id
                      }${!isRestaurant ? `?highlight=${item._id}` : ""}`}>
                      <span className="font-gilNormal text-black dark:text-white text-base">
                        {isRestaurant
                          ? search.restaurant?.name
                          : search.menuItem?.name}{" "}
                      </span>
                    </Link>
                  </div>
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-full dark:text-white text-black hover:bg-blue cursor-pointer"
                    onClick={() => handleRemoveSearch(search._id)}>
                    <CrossIcon size={16} />
                  </div>
                </div>
              );
            })}
        </div>
        {/* ✅ Search results */}
        {searchResult?.map((item) => {
          const isRestaurant = !!item.location;
          return (
            <div
              className="flex items-center gap-x-2 mt-2"
              key={item._id}
              onClick={() => {
                handleAddSearchUser(
                  isRestaurant
                    ? { menuItem: null, restaurant: item._id }
                    : { menuItem: item._id, restaurant: null }
                );
              }}>
              <Link
                to={`/restaurant/${item.user || item.restaurant?.user?._id}${
                  !isRestaurant ? `?highlight=${item._id}` : ""
                }`}>
                <img
                  src={item?.image || item?.images?.[0]}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <Link
                to={`/restaurant/${item.user || item.restaurant?.user?._id}${
                  !isRestaurant ? `?highlight=${item._id}` : ""
                }`}>
                <span className="font-gilNormal text-black dark:text-white text-base">
                  {item?.name}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SearchBox;
