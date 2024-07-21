import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

const tabs = [
  { id: "all", label: "All", query: "all", filterKeyword: "" },
  { id: "sports", label: "Sports", query: "sports", filterKeyword: "sport" },
  {
    id: "entertainment",
    label: "Entertainment",
    query: "media",
    filterKeyword: "media",
  },
  {
    id: "technology",
    label: "Technology",
    query: "technology",
    filterKeyword: "technology",
  },
  { id: "movie", label: "Movie", query: "movie", filterKeyword: "movie" },
  { id: "news", label: "News", query: "news", filterKeyword: "news" },
  {
    id: "programming",
    label: "Programming",
    query: "programming",
    filterKeyword: "program",
  },
];

const BlogNav = ({ onTabChange }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(router.query?.tab || "all");
  const containerRef = useRef(null);

  useEffect(() => {
    setActiveTab(router.query?.tab || "all");
  }, [router.query?.tab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.query);
    if (tab.query === "all") {
      router.push("/blogs"); // Navigate to /blogs for the 'All' tab
    } else {
      onTabChange(tab.filterKeyword); // Pass the filter keyword to the parent component
      router.push(`/blogs?tab=${tab.query}`, undefined, { shallow: true });
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div className="relative w-full mb-3 border-b border-gray-200">
        <button
          onClick={() => scroll("left")}
          className="absolute z-10 p-2 transform -translate-y-1/2 top-1/2 left-2"
        >
          {/* <IoArrowBackOutline className="text-gray-500" size={24} /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0"
            />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute z-10 p-2 transform -translate-y-1/2 top-1/2 right-2"
        >
          {/* <IoArrowForwardOutline className="text-gray-500" size={24} /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-180"
            width="1em"
            height="1em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0"
            />
          </svg>
        </button>
        <ul
          ref={containerRef}
          className="flex -mb-px overflow-x-auto text-sm font-medium text-center scroll-smooth webkit-scrollbar-none ps-[50px] pe-[20px] nav-container"
          id="blog-nav"
        >
          {tabs.map((tab) => (
            <li key={tab.id} className="me-2 " role="presentation">
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

export default BlogNav;
