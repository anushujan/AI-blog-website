// Profile/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/profile/Sidebar";
import ProfileNav from "@/components/ProfileNav";

const ProfilePage = ({ params }) => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  const { id } = params;
  console.log(id);

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

  return (
    <>
      <div className="w-full px-4 py-4">
        <div className="container py-0 mx-auto">
          {userDetails ? (
            <>
              <div className="flex flex-col justify-between gap-2 lg:flex-row">
                <div className="flex flex-col w-full px-0 py-3 lg:w-3/4 ">
                  <div className="lg:w-1/2">
                    <ProfileNav id={id}/>
                  </div>
                </div>
                <hr className="lg:h-screen border-[0.4px] border-gray-300" />
                <Sidebar id={id} />
              </div>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
