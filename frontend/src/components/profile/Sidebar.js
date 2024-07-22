"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Sidebar({ id }) {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch user details when component mounts
    if (!token) {
      router.push("/blogs"); // Redirect to /blogs if token is not present
      return;
    }
    if (id) {
      fetchUserDetails(id);
    }
  }, [id]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      setUserDetails(response.data); // Assuming response.data contains user details
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    }
  };
  const handleEditClick = () => {
    const localStorageId = localStorage.getItem("userId"); // Retrieve the ID from local storage
    if (localStorageId) {
      router.push(`/profile/edit/${localStorageId}`);
    }
  };

  return (
    <>
      {userDetails ? (
        <div className="flex flex-col w-full gap-2 px-4 py-3 shadow-sm lg:w-1/4 text-nowrap">
          <div className="flex flex-col gap-4 ">
            <img
              src={`http://localhost:8000/uploads/${userDetails.image}`}
              alt={userDetails.firstname}
              className="object-cover w-24 h-24 rounded-full shadow-sm"
            />
            <p className="font-semibold">
              {userDetails.firstname} {userDetails.lastname}
            </p>
            <p className="font-regular text-[14px] text-gray-500">
              {userDetails.email}
            </p>
            <div className="flex justify-between lg:flex-col md:flex-row xl:flex-row">
              <div className="flex flex-row items-center gap-2 text-gray-600 text-md">
                <p className="">{userDetails.followersCount}</p>
                <p className="">Followers</p>
              </div>
              <div className="flex flex-row items-center gap-2 text-gray-600 text-md">
                <p className="">{userDetails.followingCount}</p>
                <p className="">Following</p>
              </div>
            </div>
            <button
              className="rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer flex items-center justify-center w-[140px]"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          </div>
          <div className="flex flex-col py-2 mt-2">
            <label className="block mb-2 text-[16px] font-semibold text-gray-800">
              Followers
            </label>
            <ul className="flex flex-col gap-2">
              {userDetails.followers.map((follower) => (
                <li
                  key={follower._id}
                  className="text-[14px] text-gray-500 capitalize"
                >
                  {follower.firstname} {follower.lastname}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col py-2">
            <label className="block mb-2 text-[16px] font-semibold text-gray-800">
              Following
            </label>
            <ul className="flex flex-col gap-2">
              {userDetails.following.map((followed) => (
                <li
                  key={followed._id}
                  className="text-[14px] text-gray-500 capitalize"
                >
                  {followed.firstname} {followed.lastname}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </>
  );
}
