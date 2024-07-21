import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function UserCard({
  user,
  toggleFollow,
  loggedUserId,
  followedUsers,
}) {
  useEffect(() => {
    console.log("====================================");
    console.log(user.image + "dsfsdfs");
    console.log("====================================");
  }, []);
  return (
    <>
      <div key={user._id} className="flex flex-row items-start gap-2">
        {/* <IoPersonCircleOutline className="w-10 h-10 text-gray-600" /> */}
        {user.image ? (
          <img
            src={`http://localhost:8000/uploads/${user.image}`}
            alt={user.firstname}
            className="h-[50px] w-[50px] object-cover rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[50px] w-[50px] text-gray-600 cursor-pointer"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor">
              <circle cx="12" cy="10" r="3" stroke-linecap="round" />
              <circle cx="12" cy="12" r="9" />
              <path
                stroke-linecap="round"
                d="M18 18.706c-.354-1.063-1.134-2.003-2.219-2.673C14.697 15.363 13.367 15 12 15s-2.697.363-3.781 1.033c-1.085.67-1.865 1.61-2.219 2.673"
              />
            </g>
          </svg>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-nowrap text-[14px] font-bold capitalize">
            {`${user.firstname} ${user.lastname}`}
          </p>
          <p className="text-nowrap text-[14px] font-normal">
            {`${user.email}`}
          </p>
          {loggedUserId ? (
            followedUsers.includes(user._id) ? (
              <button
                className=" rounded-full w-[80px] py-[5px] px-[12px] text-[12px] text-white bg-gray-800 border-gray-800 border-[1px] cursor-pointer"
                onClick={() => toggleFollow(user._id)}
              >
                Following
              </button>
            ) : (
              <button
                className="w-[80px] rounded-full py-[5px] px-[12px] text-[12px] text-black border-gray-800 border-[1px] cursor-pointer "
                onClick={() => toggleFollow(user._id)}
              >
                Follow
              </button>
            )
          ) : (
            <button
              className="w-[80px] rounded-full py-[5px] px-[12px] text-[12px] text-black border-gray-800 border-[1px] cursor-not-allowed"
              onClick={() => toast.error("Please log in to follow users.")}
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </>
  );
}
