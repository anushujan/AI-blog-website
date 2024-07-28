import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const SignupModal = ({ isOpen, onClose, onSignupSuccess }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [imageError, setImageError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // const roleOptions = [
  //   { value: "user", label: "User" },
  //   { value: "admin", label: "Admin" },
  // ];

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFirstnameError("");
    setLastnameError("");
    setPhoneError("");
    setAddressError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    // setRoleError("");

    let valid = true;

    if (!firstname) {
      setFirstnameError("First name is required.");
      valid = false;
    }

    if (!lastname) {
      setLastnameError("Last name is required.");
      valid = false;
    }

    if (!phone) {
      setPhoneError("Phone number is required.");
      valid = false;
    }

    // if (!address) {
    //   setAddressError("Address is required.");
    //   valid = false;
    // }

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
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      valid = false;
    }

    // if (!role) {
    //   setRoleError("Role is required.");
    //   valid = false;
    // }

    if (!valid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/users`, {
        firstname,
        lastname,
        phone,
        address,
        email,
        password,
        confirmPassword,
        role,
        image,
      });
      const { token, email: userEmail, role: userRole } = response.data;

      // localStorage.setItem("token", token);
      // localStorage.setItem("userEmail", userEmail);
      // localStorage.setItem("userRole", userRole);

      // Clear all form fields after successful signup
      setFirstname("");
      setLastname("");
      setPhone("");
      setAddress("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("user");

      setImage("");

      onClose();
      onSignupSuccess();
      toast.success("Signed up successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
    setIsLoading(false);
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
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-scroll  ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="z-50 w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg mt-[140px] md:mt-0">
        <h2 className="mb-4 text-xl font-bold">Sign Up</h2>
        <form onSubmit={handleSignup} className="">
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <div class="flex items-start justify-start w-full mt-3">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center h-32 w-32 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6 z-20">
                  <svg
                    class="w-12 h-12 mb-0 text-gray-500 dark:text-gray-400"
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
                    className="absolute z-10 object-cover w-32 h-32 rounded-full shadow-sm "
                  />
                )}
                {imageError && (
                  <span className="text-red-500 text-[14px] pt-4">
                    {imageError}
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="flex flex-col w-full gap-4 mb-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstname"
                type="text"
                value={firstname}
                onChange={(e) => {
                  setFirstname(e.target.value);
                  setFirstnameError("");
                }}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Enter your first name"
              />
              {firstnameError && (
                <p className="mt-1 text-sm text-red-500">{firstnameError}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastname"
                type="text"
                value={lastname}
                onChange={(e) => {
                  setLastname(e.target.value);
                  setLastnameError("");
                }}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Enter your last name"
              />
              {lastnameError && (
                <p className="mt-1 text-sm text-red-500">{lastnameError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full gap-4 mb-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Enter your phone number"
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-500">{phoneError}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressError("");
                }}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Enter your address"
              />
              {/* {addressError && (
                <p className="mt-1 text-sm text-red-500">{addressError}</p>
              )} */}
            </div>
          </div>

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
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col w-full gap-4 mb-4 md:flex-row">
            <div className="flex-1">
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
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Enter your password"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
                placeholder="Confirm your password"
              />
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-500">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </div>

          {/* <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setRoleError("");
              }}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#121212] focus:border-[#121212] sm:text-sm"
            >
              <option value="">Select role...</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {roleError && (
              <p className="mt-1 text-sm text-red-500">{roleError}</p>
            )}
          </div> */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              Close
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white bg-[#121212] rounded-md hover:bg-[#222222] focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
