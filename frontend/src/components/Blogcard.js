import React from "react";
const truncateTitle = (title) => {
  if (!title) return "";

  const words = title.split(" ");
  if (words.length <= 40) return title;

  return words.slice(0, 40).join(" ") + "...";
};

export default function Blogcard({ blog }) {
  return (
    <>
      <div
        key={blog._id}
        className="flex flex-col gap-2 bg-white shadow-sm md:flex-row"
      >
        <img
          src={`http://localhost:8000/uploads/${blog.image}`}
          alt={blog.title}
          className="h-[200px] md:w-[200px] w-full object-cover"
        />
        <div className="flex flex-col flex-1 gap-2 px-2 py-3 overflow-hidden">
          <h3 className="mt-2 text-lg font-semibold normal-case">
            {truncateTitle(blog.title)}
          </h3>
          <p className="flex mt-1 text-gray-700 md:hidden ">
            {Array.isArray(blog.content) && blog.content.length > 0
              ? blog.content[0].split(" ").slice(0, 10).join(" ") + "..."
              : "No content available"}
          </p>
          <p className="hidden mt-1 text-gray-700 md:flex lg:hidden">
            {Array.isArray(blog.content) && blog.content.length > 0
              ? blog.content[0].split(" ").slice(0, 20).join(" ") + "..."
              : "No content available"}
          </p>
          <p className="hidden mt-1 text-gray-700 lg:flex ">
            {Array.isArray(blog.content) && blog.content.length > 0
              ? blog.content[0].split(" ").slice(0, 30).join(" ") + "..."
              : "No content available"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {blog.author ? (
              <>
                <span className="font-bold">Author</span>{" "}
                {blog.author.firstname} {blog.author.lastname} | Created on{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </>
            ) : (
              "Author information not available"
            )}
          </p>
          <a
            href={`/blog/${blog._id}`}
            className="flex items-center gap-[2px] mt-2 text-black text-bold"
          >
            <p> Read more</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.3em"
              height="1.3em"
              viewBox="0 0 24 24"
              className="rotate-90"
            >
              <path
                fill="currentColor"
                d="M17.812 17.289L7.712 7.208V16.5h-1v-11h11v1H8.419L18.5 16.6z"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
