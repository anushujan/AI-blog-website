import React from "react";

export default function StartaWrite() {
  return (
    <>
      <div className="flex w-full flex-col gap-[30px] p-2">
        <div className="flex bg-[#fe8559] py-[20px] flex-col px-[10px] rounded-md gap-4 text-center w-full items-start justify-start">
          <p className="font-semibold text-center text-[#1c1c1c]">
            Writing on Qblog
          </p>
          <p className="text-start text-[#202020] text-[14px]">
            New writer FAQ Expert writing advice Grow your readership
          </p>
          <button
            className="w-[100px] rounded-full py-[5px] px-[12px] text-[12px] bg-black text-white border-gray-800 border-[1px] cursor-not-allowed"
            // onClick={() => toast.error("Please log in to follow users.")}
          >
            start writing
          </button>
        </div>
      </div>
    </>
  );
}
