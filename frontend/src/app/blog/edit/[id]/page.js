"use client";
import React from "react";
import EditBlogForm from "@/components/form/EditBlogForm";
import { toast, Toaster } from "react-hot-toast";

export default function EditBlog({ params }) {
  const { id } = params;

  return (
    <div className="w-full font-Sansationnormal">
      <Toaster />
      <div className="container px-4 py-4 mx-auto md:px-0">
        <EditBlogForm id={id}/>
      </div>
    </div>
  );
}
