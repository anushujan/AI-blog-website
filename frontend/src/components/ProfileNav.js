import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const tabs = [
  { id: "home", label: "Home", query: "home", filterKeyword: "home" },
  { id: "about", label: "About", query: "about", filterKeyword: "about" },
];

const ProfileNav = ({ onTabChange, id }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure router.query is defined before accessing tab
    if (router.query && router.query.tab) {
      setActiveTab(router.query.tab);
    } else {
      setActiveTab("home"); // Default to "home" if tab is undefined
    }
  }, [router.query]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.query);
    if (onTabChange) {
      onTabChange(tab.filterKeyword); // Notify parent component of the tab change
    }
  };

  return (
    <div className="relative">
      <div className="relative w-full mb-3 border-b border-gray-200">
        <ul
          ref={containerRef}
          className="flex -mb-px overflow-x-auto text-sm font-medium text-center scroll-smooth webkit-scrollbar-none"
          id="blog-nav"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2" role="presentation">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(tab);
                }}
                className={`inline-block px-4 py-4 rounded-t-lg cursor-pointer ${
                  activeTab === tab.query
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 border-b-2 border-transparent"
                }`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileNav;
