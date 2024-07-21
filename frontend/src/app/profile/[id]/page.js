// Profile/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProfilePage = ({ params }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
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

  const handleUpdateUserDetails = async (e) => {
    e.preventDefault();

    // if (password && password !== confirmPassword) {
    //   toast.error("Passwords do not match");
    //   return;
    // }
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
      // if (password) {
      //   updatedDetails.password = password; // Include password only if it's changed
      // }
      await axios.put(
        `http://localhost:8000/api/users/${id}`,
        updatedDetails,
        config
      );
      toast.success("User details updated successfully");
      setUserDetails((prev) => ({ ...prev, ...updatedDetails }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Error updating user details");
    }
  };

  const handleEditClick = () => {
    setFirstname(userDetails.firstname);
    setLastname(userDetails.lastname);
    setEmail(userDetails.email);
    setPhone(userDetails.phone); // Handle case if phone is not present
    setImage(userDetails.image); // Handle case if phone is not present
    setPassword(""); // Handle case if phone is not present
    setIsEditing(true);
    setConfirmPassword("");
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
            <div className="w-full px-0 py-0 mx-auto mb-4 ">
              {isEditing ? (
                <div className="flex w-full lg:w-2/4">
                  <form onSubmit={handleUpdateUserDetails} className="w-full">
                    <div className="flex flex-col w-full gap-2 md:flex-row">
                      <div className="w-full mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-full mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Image</label>
                      <img
                        src={`http://localhost:8000/uploads/${image}`}
                        alt={firstname}
                        className="h-[50px] w-[50px] object-cover rounded-full"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className={`block w-full px-3 mt-1 border border-black rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm `}
                        onChange={handleFileChange}
                      />
                      {imageError && (
                        <span className="text-red-500 text-[14px] pt-4">
                          {imageError}
                        </span>
                      )}
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2 rounded-md shadow-sm w-full object-contain h-[250px]"
                        />
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-bold text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-1 text-gray-700 border rounded-md text-md"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#121212] rounded-md hover:bg-[#222222] focus:outline-none"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#121212] rounded-md hover:bg-[#222222] focus:outline-none"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="flex flex-col justify-between gap-2 lg:flex-row">
                    <div className="flex flex-col w-full px-0 py-3 lg:w-3/4 ">
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          First Name
                        </label>
                        <p className="text-lg text-gray-700">
                          {userDetails.firstname}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Last Name
                        </label>
                        <p className="text-lg text-gray-700">
                          {userDetails.lastname}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Email
                        </label>
                        <p className="text-lg text-gray-700">
                          {userDetails.email}
                        </p>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">
                          Phone
                        </label>
                        <p className="text-lg text-gray-700">
                          {userDetails.phone}
                        </p>
                      </div>
                    </div>
                    <hr className="lg:h-screen border-[0.4px] border-gray-300" />

                    <div className="flex flex-col w-full px-4 py-3 shadow-sm lg:w-1/4 text-nowrap">
                      <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                          <p className="text-lg text-gray-700">
                            {userDetails.followersCount}
                          </p>
                          <label className="block mb-2 text-sm font-bold text-gray-700">
                            Followers
                          </label>
                        </div>
                        <div className="flex flex-col items-center ">
                          <p className="text-lg text-gray-700">
                            {userDetails.followingCount}
                          </p>
                          <label className="block mb-2 text-sm font-bold text-gray-700">
                            Following
                          </label>
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-[#121212] rounded-md hover:bg-[#222222] focus:outline-none"
                        onClick={handleEditClick}
                      >
                        Edit Profile
                      </button>

                      <div className="flex flex-col py-2">
                        <label className="block mb-2 text-lg font-bold text-gray-700">
                          Followers
                        </label>
                        <ul className="flex flex-col gap-2">
                          {userDetails.followers.map((follower) => (
                            <li
                              key={follower._id}
                              className="text-[16px] text-gray-500 capitalize"
                            >
                              {follower.firstname} {follower.lastname}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col py-2">
                        <label className="block mb-2 text-lg font-bold text-gray-700 ">
                          Following
                        </label>
                        <ul className="flex flex-col gap-2">
                          {userDetails.following.map((followed) => (
                            <li
                              key={followed._id}
                              className="text-[16px] text-gray-500 capitalize"
                            >
                              {followed.firstname} {followed.lastname}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
