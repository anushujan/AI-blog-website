"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";

import { showToastMessage } from "@/utils/toast";

export default function EditBlog({ params }) {
  const router = useRouter();
  const { id } = params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentErrors, setContentErrors] = useState([]);

  const [classification, setClassification] = useState("");

  useEffect(() => {
    const fetchBlogById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/${id}`
        );
        const { title, image, content, author } = response.data;
        setTitle(title);
        setContent(content);
        setImageUrl(image);
        setAuthor(author?._id); // Ensure author object is checked before accessing _id
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlogById();
  }, [id]);

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       const decodedToken = JSON.parse(atob(token.split(".")[1]));
  //       setAuthor(decodedToken.userId);
  //     }
  //   }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to /blogs if user is not logged in
      router.push("/blogs");
    } else {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setAuthor(decodedToken.userId);
    }
  }, [router]);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFile(file);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImagePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Set the file state if you are using a state management library

      // Create a FileReader to preview the image
      const reader = new FileReader();
      reader.onload = async (e) => {
        setImagePreview(e.target.result); // Set image preview

        // Prepare FormData to send the file
        const formData = new FormData();
        formData.append("file", file); // Use "file" as the key if your server expects it

        try {
          // Optionally get a token if authentication is required
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "http://127.0.0.1:9000/classify",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token ? `Bearer ${token}` : undefined, // Add token if available
              },
            }
          );
          // setImage(response.data); // Save classification result
          // setImage(e.target.result);
          setClassification(response.data.classification);
          // Show toast message based on classification result
          showToastMessage(response.data.classification);
          console.log("Classification result:", response.data);
        } catch (error) {
          console.error("Error classifying image:", error);
          toast.error("Failed to classify image"); // Show error message
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const data = {
        title,
        author,
        content,
        classification,
      };

      // if (imageFile) {
      //   data.image = imageFile;
      // }

      if (imageFile) {
        const base64Image = await convertToBase64(imageFile);
        data.image = base64Image;
      }

      const response = await axios.put(
        `http://localhost:8000/api/blogs/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Blog updated:", response.data);
      toast.success("Blog updated successfully");
      router.push(`/blog/${id}`);
    } catch (error) {
      console.error("Error updating blog:", error.response?.data?.error);
      toast.error(error.response?.data?.error || "Failed to update blog");
      setErrors({
        error: error.response?.data?.error || "Failed to update blog",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddContent = () => {
    setContent([...content, ""]);
  };

  const handleRemoveContent = (index) => {
    const updatedContent = [...content];
    updatedContent.splice(index, 1);
    setContent(updatedContent);
  };

  const handleContentChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index] = value;
    setContent(updatedContent);
  };

  return (
    <div className="w-full font-Sansationnormal">
      <Toaster />
      <div className="container px-4 py-4 mx-auto md:px-0">
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg">
          <div className="flex mb-4">
            <h2 className="text-lg font-normal uppercase text-nowrap">
              Edit Blog
            </h2>
            <div className="flex justify-end w-full gap-2">
              <button
                type="submit"
                className={`rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer ${
                  isSubmitting ? "opacity-50" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <span className="text-red-500 text-[14px] pt-1">
                {errors.title}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <div class="flex items-center justify-center w-full mt-3">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6 z-20">
                  <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linejoin="round"
                        d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"
                      />
                      <path
                        stroke-linejoin="round"
                        d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"
                      />
                      <path
                        stroke-miterlimit="10"
                        d="M18.994 15.5v5M16.5 18.005h5"
                      />
                    </g>
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  class="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-md absolute z-10 shadow-sm w-full object-contain h-[250px]"
                  />
                )}
                {imageUrl && (
                  <div className="absolute mb-2">
                    <img
                      src={imageUrl}
                      alt="Current Blog Image"
                      className="w-full object-contain h-[250px]"
                    />
                  </div>
                )}
              </label>
            </div>
            {errors.image && (
              <span className="text-red-500 text-[14px] pt-4">
                {errors.image}
              </span>
            )}
          </div>

          <div className="mb-4">
            {content.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between">
                  {/* <label className="block text-gray-700">
                    Content {index + 1}
                  </label> */}
                  <button
                    type="button"
                    className="absolute text-sm text-red-600 right-2 top-4 hover:text-red-800"
                    onClick={() => handleRemoveContent(index)}
                  >
                    <AiOutlineDelete className="w-5 h-5 text-red-600 cursor-pointer" />
                  </button>
                </div>
                <textarea
                  rows={6}
                  className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                  value={item}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  placeholder={`Content ${index + 1}`}
                />
                {contentErrors[index] && (
                  <span className="text-red-500 text-[14px] pt-1">
                    {contentErrors[index]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 mb-4">
            <button
              type="button"
              onClick={handleAddContent}
              className="rounded-full flex items-center gap-2  py-[5px] px-[10px] text-[14px] hover:text-white text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
                />
              </svg>
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
