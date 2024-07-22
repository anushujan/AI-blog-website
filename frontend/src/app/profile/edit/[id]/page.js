// Profile/edit/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/profile/Sidebar";

export default function Page({ params }) {
  const { id } = params;
  console.log(id);

  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const [imageError, setImageError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

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
      const userData = response.data;
      setUserDetails(userData); // Assuming response.data contains user details

      // Update state variables with user details
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setEmail(userData.email);
      setPhone(userData.phone);
      setImage(userData.image);
      console.log(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    }
  };

  

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedDetails = {
        firstname,
        lastname,
        email,
        phone,
        password,
        image,
      };
      if (password) {
        updatedDetails.password = password; // Include password only if it's changed
      }
      await axios.put(
        `http://localhost:8000/api/users/${id}`,
        updatedDetails,
        config
      );
      toast.success("User details updated successfully");
      setUserDetails((prev) => ({ ...prev, ...updatedDetails }));
      //   setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Error updating user details");
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setImagePreview(e.target.result); // Set image preview
      };
      reader.readAsDataURL(file);
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
                  <form onSubmit={handleUpdateUserDetails} className="lg:w-3/4">
                    <div className="w-1/2 mb-4">
                      <label className="block text-gray-700">Image</label>
                      <div class="flex items-start justify-start w-full mt-3">
                        <label
                          for="dropzone-file"
                          class="flex  flex-col items-center justify-center w-48 h-48 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                              <span class="font-semibold text-[12px] text-center">Click to upload</span>{" "}
                              or drag and drop
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 text-[12px] text-center">
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
                          <img
                            src={`http://localhost:8000/uploads/${userDetails.image}`}
                            alt={userDetails.firstname}
                            className="absolute z-10 object-cover w-48 h-48 rounded-full shadow-sm"
                          />

                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="absolute z-10 object-cover w-48 h-48 rounded-full shadow-sm"
                            />
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col w-full gap-2 md:flex-row">
                      <div className="w-full mb-4">
                        <label className="block text-gray-600 text-[14px]">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-full mb-4">
                        <label className="block text-gray-600 text-[14px]">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 text-[14px]">
                        Email
                      </label>
                      <input
                        type="email"
                        className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-600 text-[14px]">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-600 text-[14px]">
                        Password
                      </label>
                      <input
                        type="password"
                        className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-600 text-[14px]">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer"
                      >
                        update
                      </button>
                    </div>
                  </form>
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
}
