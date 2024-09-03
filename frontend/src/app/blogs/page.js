"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import BlogNav from "@/components/BlogNav";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { IoPersonCircleOutline } from "react-icons/io5";
import Whotofollow from "@/components/Whotofollow";
import StartaWrite from "@/components/StartaWrite";

const BlogListingPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState(null); // Initialize state for loggedUserId
  const [isImageVisible, setIsImageVisible] = useState(false); // New state

  const toggleImageVisibility = () => {
    setIsImageVisible((prev) => !prev); // Toggle visibility
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab || null);
    fetchBlogs();
    fetchUsers();
    // Fetch loggedUserId from localStorage or wherever it's set after successful login
    const userId = localStorage.getItem("userId");
    setLoggedUserId(userId);
  }, [searchParams]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/blogs`);
      setBlogs(response.data.blogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      const response = await axios.get("http://localhost:8000/api/users");

      // Filter out the user with specific _id from the list of users
      // const filteredUsers = response.data.filter((user) => user._id !== "666b3bd26418c3f993b46a29");
      const filteredUsers = response.data.filter((user) => user._id !== userId);

      console.log(filteredUsers); // Verify filtered users in console
      setUsers(filteredUsers); // Update state with filtered users
      fetchFollowedUsers(userId);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleTabChange = (filterKeyword) => {
    setActiveTab(filterKeyword);
    router.push(`/blogs?tab=${filterKeyword}`, undefined, { shallow: true });
  };

  const fetchFollowedUsers = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/${userId}/followed`
      );
      const followedUserIds = response.data.map((user) => user._id);
      setFollowedUsers(followedUserIds);
    } catch (err) {
      console.error("Error fetching followed users:", err);
    }
  };

  const toggleFollow = async (followId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to follow users.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!loggedUserId) {
        throw new Error("Logged in user ID not found");
      }

      // Check if already following
      if (followedUsers.includes(followId)) {
        await axios.post(
          "http://localhost:8000/api/users/unfollow",
          { userId: loggedUserId, followId },
          config
        );
        setFollowedUsers((prev) => prev.filter((id) => id !== followId));
        toast.success("Successfully unfollowed user!");
      } else {
        await axios.post(
          "http://localhost:8000/api/users/follow",
          { userId: loggedUserId, followId },
          config
        );
        setFollowedUsers((prev) => [...prev, followId]);
        toast.success("Successfully followed user!");
      }
    } catch (err) {
      if (err.response && err.response.data.error === "User not found") {
        toast.error("User not found. Unable to follow.");
      } else if (
        err.response &&
        err.response.data.error === "Already following this user"
      ) {
        toast.error("Already following this user.");
      } else if (err.response && err.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setLoggedUserId(null);
        router.push("/login"); // Navigate to the login page
      } else {
        toast.error("An error occurred while following the user.");
      }
    }
  };

  // Filtered blogs based on activeTab state
  const filteredBlogs = activeTab
    ? blogs.filter((blog) => {
        const titleMatch = blog.title
          .toLowerCase()
          .includes(activeTab.toLowerCase());
        const contentMatch = blog.content
          .join(" ")
          .toLowerCase()
          .includes(activeTab.toLowerCase());
        return titleMatch || contentMatch; // Filter based on title or content
      })
    : blogs;

  // Filtered blogs based on activeTab state
  // const filteredBlogs = activeTab
  //   ? blogs.filter((blog) => {
  //       return blog.title.toLowerCase().includes(activeTab.toLowerCase()); // Filter based on keyword
  //     })
  //   : blogs;

  // Function to truncate blog title
  const truncateTitle = (title) => {
    if (!title) return "";

    const words = title.split(" ");
    if (words.length <= 40) return title;

    return words.slice(0, 40).join(" ") + "...";
  };

  return (
    <div className="text-black px-[16px]">
      <Toaster />

      <div className="container flex flex-col pb-6 mx-auto lg:flex-row-reverse">
        <div className="flex flex-col w-full h-full gap-2 p-2 bg-gray-0 lg:w-1/4 allUsersView">
          <StartaWrite />
          <Whotofollow
            users={users}
            loggedUserId={loggedUserId}
            followedUsers={followedUsers}
            toggleFollow={toggleFollow}
          />
        </div>
        <div className="flex flex-col w-full lg:w-3/4">
          <div className="w-full lg:w-3/4 ">
            <BlogNav onTabChange={handleTabChange} />
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : filteredBlogs.length === 0 ? (
            <p className="text-center text-gray-500">No blogs found</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex flex-col gap-2 bg-white shadow-sm md:flex-row"
                >
                  {blog.classification === "non-violent" && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-[200px] md:w-[200px] w-full object-cover"
                    />
                  )}
                  {blog.classification === "violent" && (
                    <div className="relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className={`h-[200px] md:w-[200px] w-full object-cover ${
                          isImageVisible ? "blur-0" : "blur-xl"
                        }`}
                      />
                      <button
                        onClick={toggleImageVisibility}
                        className="absolute p-2 bg-gray-700 bg-opacity-75 border rounded-full top-4 right-4"
                      >
                        {isImageVisible ? (
                          <AiOutlineEyeInvisible className="w-6 h-6 text-white" />
                        ) : (
                          <AiOutlineEye className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-[200px] md:w-[200px] w-full object-cover"
                  /> */}
                  <div className="flex flex-col flex-1 gap-2 px-2 py-3 overflow-hidden">
                    <h3 className="mt-2 text-lg font-semibold normal-case">
                      {truncateTitle(blog.title)}
                    </h3>
                    <p className="flex mt-1 text-gray-700 md:hidden ">
                      {Array.isArray(blog.content) && blog.content.length > 0
                        ? blog.content[0].split(" ").slice(0, 10).join(" ") +
                          "..."
                        : "No content available"}
                    </p>
                    <p className="hidden mt-1 text-gray-700 md:flex lg:hidden">
                      {Array.isArray(blog.content) && blog.content.length > 0
                        ? blog.content[0].split(" ").slice(0, 20).join(" ") +
                          "..."
                        : "No content available"}
                    </p>
                    <p className="hidden mt-1 text-gray-700 lg:flex ">
                      {Array.isArray(blog.content) && blog.content.length > 0
                        ? blog.content[0].split(" ").slice(0, 30).join(" ") +
                          "..."
                        : "No content available"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {blog.author ? (
                        <>
                          <span className="font-bold">Author</span>{" "}
                          {blog.author.firstname} {blog.author.lastname} |
                          Created on{" "}
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </>
                      ) : (
                        "Author information not available"
                      )}
                    </p>
                    <a
                      href={`/blog/${blog._id}`}
                      className="flex items-center gap-[2px] mt-2 text-black text-bold"
                    >
                      <p> Read more</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.3em"
                        height="1.3em"
                        viewBox="0 0 24 24"
                        className="rotate-90"
                      >
                        <path
                          fill="currentColor"
                          d="M17.812 17.289L7.712 7.208V16.5h-1v-11h11v1H8.419L18.5 16.6z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListingPage;
