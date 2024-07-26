"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/profile/Sidebar";
import ProfileNav from "@/components/ProfileNav";
import Blogcard from "@/components/Blogcard";

const ProfilePage = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [blogs, setBlogs] = useState([]);
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/blogs");
      return;
    }

    if (id) {
      fetchUserDetails(id);
      if (activeTab === "home") {
        fetchUserBlogs(id);
      }
    }

    // if (id) {
    //   fetchUserDetails(id);
    // }

    // Check if router.query is defined and set the activeTab
    if (router.query && router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [id, router.query]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    }
  };

  const fetchUserBlogs = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userId}/blogs`
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      toast.error("Error fetching user blogs");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/profile/${id}?tab=${tab}`, undefined, { shallow: true });
  };

  return (
    <div className="w-full px-4 py-4">
      <div className="container py-0 mx-auto">
        <div className="flex flex-col justify-between gap-2 lg:flex-row">
          <div className="flex flex-col w-full px-0 py-3 lg:w-3/4">
            <ProfileNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              id={id}
            />
            <div className="lg:w-full">
              {activeTab === "home" && userDetails && (
                <div className="flex w-full flex-col gap-[30px] p-2">
                  {blogs.length > 0 ? (
                    <>
                      {blogs
                        .slice(0, showAllBlogs ? blogs.length : 3)
                        .map((blog) => (
                          <Blogcard key={blog._id} blog={blog} />
                        ))}
                      <div className="flex items-end justify-end w-full">
                        {!showAllBlogs && blogs.length > 3 && (
                          <button
                            onClick={() => setShowAllBlogs(true)}
                            className="rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white w-[120px] text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer"
                          >
                            View More
                          </button>
                        )}
                        {showAllBlogs && (
                          <button
                            onClick={() => setShowAllBlogs(false)}
                            className="rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white w-[120px] text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer"
                          >
                            View Less
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p>No blogs found.</p>
                  )}
                </div>
              )}
              {activeTab === "about" && (
                <div className="flex w-full flex-col gap-[30px] p-2">
                  <div className="flex bg-[#e9e9e9] py-[40px] flex-col px-[10px] rounded-md gap-4 text-center w-full items-center justify-start">
                    <p className="font-semibold text-center text-[#1c1c1c]">
                      Writing on Qblog
                    </p>
                    <p className="text-center text-[#202020] text-[14px]">
                      New writer FAQ Expert writing advice Grow your readership
                      dddd
                    </p>
                    <button className="w-[100px] rounded-full py-[5px] px-[12px] text-[12px] bg-black text-white border-gray-800 border-[1px] cursor-not-allowed">
                      Start writing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="lg:h-screen border-[0.4px] border-gray-300" />
          <Sidebar id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
