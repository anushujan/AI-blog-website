"use client";
import React, { useEffect, useState } from "react"; // Import useRouter from 'next/router'
import BlogNav from "@/components/BlogNav";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";

export default function BlogDetail({ params }) {
  const router = useRouter();
  const id = params.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchBlogBySlug = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/${id}`
        );
        setBlog(response.data);
        setLoading(false);
        // Check if logged-in user is the author
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const userId = decodedToken.userId;
          if (userId === response.data.author._id) {
            setIsAuthor(true);
          }
          setIsLoggedIn(true);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogBySlug();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/blog/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8000/api/blogs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Blog deleted:", response.data);
      toast.success("Blog deleted successfully");
      // Redirect or handle deletion confirmation as needed
      router.push("/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      toast.error("Error deleting blog");
    }
  };

  return (
    <div className="text-black px-[16px]">
      <Toaster />
      <div className="container py-6 mx-auto xl:px-[150px]">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {blog && (
          <>
            <h2 className="uppercase text-2xl font-bold text-start text-[#0c0c0c]">
              {blog.title}
            </h2>
            <div className="flex flex-col gap-0 items-left">
              <p className="mt-2 text-sm text-gray-500">
                <span className="font-bold">Author</span>{" "}
                {blog.author.firstname} {blog.author.lastname} | Created on{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              {isLoggedIn && isAuthor && (
                <div className="flex mt-4">
                  <button
                    onClick={handleEdit}
                    className="mr-2 text-sm font-medium text-white rounded-md focus:outline-none"
                  >
                    <IoCreateOutline className="w-6 h-6 text-gray-600 cursor-pointer" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm font-medium text-white"
                  >
                    <AiOutlineDelete className="w-6 h-6 text-red-600 cursor-pointer"/>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white">
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
              {/* <p className="mt-3 text-gray-700">{blog.content}</p> */}
              {Array.isArray(blog.content) &&
                blog.content.map((paragraph, index) => (
                  <p key={index} className="mt-3 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              {/* If blog.content is not an array or is empty, render a message */}
              {!Array.isArray(blog.content) ||
                (blog.content.length === 0 && (
                  <p className="mt-3 text-gray-700">
                    Content not available or in an unexpected format.
                  </p>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
