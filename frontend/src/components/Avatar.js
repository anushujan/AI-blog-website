import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

const Avatar = ({ isLoggedIn, handleLogout, userImage }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load user details from localStorage on component mount
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    setUserEmail(email);
    setUserRole(role);
  }, []);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the parent component's handleLogout function
    setProfileMenuOpen(false); // Close the profile menu after logout
  };

  const handleProfileClick = () => {
    const userId = localStorage.getItem("userId"); // Fetch userId from localStorage
    if (userId) {
      router.push(`/profile/${userId}`); // Navigate to profile page with user ID
      setProfileMenuOpen(false); // Close the profile menu after navigation
    }
  };

  return (
    <div className="relative">
      {isLoggedIn ? (
        <button className="flex" onClick={toggleProfileMenu}>
          {/* Replace this with your actual profile avatar image or icon */}
          {userImage ? (
            <img
              src={`http://localhost:8000/uploads/${userImage}`}
              alt="User Avatar"
              className="object-cover w-8 h-8 rounded-full"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-600 cursor-pointer"
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
        </button>
      ) : (
        <IoPersonCircleOutline className="w-8 h-8 text-gray-600 cursor-pointer" />
      )}

      {/* Profile Dropdown */}
      {isLoggedIn && profileMenuOpen && (
        <div className="absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-52 ring-1 ring-black ring-opacity-5">
          {/* Dropdown items */}
          <div className="py-1">
            {/* Display user email and role */}
            <div className="px-4 py-2 text-sm text-gray-700">
              <p>{userEmail}</p>
              <p className="text-red-700">{userRole}</p>
            </div>
            <button
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              onClick={handleProfileClick}
            >
              Profile
            </button>
            {/*  <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
              Settings
            </button> */}
            <button
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
