import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");

    let valid = true;

    // Check for empty fields
    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/login`, {
        email,
        password,
      });

      const {
        token,
        email: userEmail,
        role: userRole,
        _id: userId,
      } = response.data;
      console.log(userId);
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", userRole);

      setEmail("");
      setPassword("");

      onClose();
      // onLoginSuccess();
      toast.success("Logged in successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Something went wrong.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-50 w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between w-full">
          <h2 className="mb-4 text-xl font-bold">Login</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
                d="m14.5 9.5l-5 5m0-5l5 5M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              className="block w-full px-3 py-3  mt-1 border-0 border-b-[1px] border-gray-400 rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-[#aeaeae] focus:border-gray-400 focus:bg-gray-50 sm:text-sm"
              placeholder="Enter your password"
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`rounded-full  py-[5px] px-[20px] text-[14px] text-white hover:text-black bg-[#222222]  border-[#222222] hover:bg-white border-[1px] cursor-pointer  ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
