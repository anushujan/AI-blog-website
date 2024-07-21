"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { IoCreateOutline } from "react-icons/io5";
import Avatar from "./Avatar";
import { navLinks, logo } from "@/constant/data"; // Import your navigation links and logo
import LoginModal from "./LoginModal";
import { toast } from "react-hot-toast";
import SignupModal from "./SignupModal";
import { CiSearch } from "react-icons/ci";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [userImage, setUserImage] = useState(null);

  const fetchUserData = async (token, userId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserImage(data.image); // Assuming the image URL is in the data.image property
      } else {
        // Handle error
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Check if there is a token in localStorage to determine if user is logged in
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setIsLoggedIn(true);
      fetchUserData(token, userId);
    }
  }, []);

  const handleWriteClick = () => {
    router.push("/blogs/create");
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Clear token on logout
    localStorage.removeItem("userEmail"); // Clear userEmail on logout
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <div className="bg-[#fff] items-center flex fixed w-full z-50 shadow-sm px-[16px] ">
        <div className="flex justify-between items-center container mx-auto text-black lg:px-0 py-[14px]">
          <div className="flex items-center gap-6 ">
            <logo className="">
              <Link href="/">
                <p className="font-semibold font-outfit text-[20px]">QBLOG</p>
                {/* <Image src={logo} alt="logo" width={42} /> */}
              </Link>
            </logo>
            <div className="relative">
              <CiSearch className="absolute w-6 h-6 left-2 top-2 text-[#808080]" />
              <input
                className="rounded-full py-[8px] ps-[40px] text-[14px] text-black  border-[#808080] border-[1px] cursor-pointer focus:outline-none"
                placeholder="search"
              />
            </div>
            {/* <nav className="list-none gap-[29px] items-center flex text-[16px] font-Sansationnormal opacity-100">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href; // Determine if this link is active
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative transition duration-150 text-[#454545] hover:text-black capitalize`}
                  >
                    {link.name}
                    <div
                      className={`absolute bottom-0 left-0 h-[2px] transition-all duration-150 ${
                        isActive ? "w-full bg-red-500" : "w-0 bg-transparent"
                      }`}
                    ></div>
                  </Link>
                );
              })}
            </nav> */}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={handleWriteClick}
              >
                <IoCreateOutline className="w-6 h-6 text-gray-600 cursor-pointer" />
                <span className="text-gray-600">Write</span>
              </div>
            ) : (
              ""
            )}

            {/* Conditionally render profile avatar or login/signup options */}
            {isLoggedIn ? (
              <Avatar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                userImage={userImage}
              />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  className="font-normal text-black"
                  onClick={handleLoginClick}
                >
                  Sign In
                </button>
                <span className="text-[26px]"> /</span>
                <button
                  className="rounded-full  py-[5px] px-[20px] text-[14px] hover:text-white text-black hover:bg-[#222222]  border-[#222222] border-[1px] cursor-pointer"
                  onClick={handleSignupClick}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      </div>
    </>
  );
}
