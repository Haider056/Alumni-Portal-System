import React, { useState } from "react";
import Footer from "../Components/Footer";
import AdminHeader from "./AdminHeader";
import Job1 from "../Components/Assets/UpcomingEvents.png";
export default function PostNews() {
  const [newsData, setNewsData] = useState({
    newsTitle: "",
    newsDescription: "",
    newsImageURL: null 
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    const updatedValue = files ? files[0] : value;
    setNewsData({
      ...newsData,
      [name]: updatedValue
    });
  };

  const handlePostNews = async () => {
    try {
      const formData = new FormData();
      formData.append("newsTitle", newsData.newsTitle);
      formData.append("newsDescription", newsData.newsDescription);
      formData.append("newsImage", newsData.newsImage);
  
      const response = await fetch("http://localhost:3001/auth/createNews", {
        method: "POST",
        credentials: "include",
        body: formData
      });
  
      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message);
      } else {
        const responseData = await response.json();
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  

  return (
    <div className="flex flex-col bg-white">
      <AdminHeader />
      <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <img
          loading="lazy"
          src={Job1}
          className="object-cover absolute inset-0 w-full h-full"
          alt="Events1"
        />
        <div className="relative z-10">Past Job Or Internship</div>
      </div>
      <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <div className="relative z-10">Post Job Or Internship</div>
      </div>
      <div className="flex flex-col items-center px-20 mt-5">
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Enter News Title"
          name="newsTitle"
          onChange={handleChange}
        />
        <textarea
          className="w-full h-44 px-4 py-6 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Enter News Description"
          name="newsDescription"
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          className="w-full px-4 py-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
          name="newsImage" 
          onChange={handleChange}
        />
        <div
          onClick={handlePostNews}
          className="mx-auto px-16 py-4 mt-5 mb-5 text-2xl text-white bg-blue-500 rounded-full cursor-pointer"
        >
          Post News
        </div>
      </div>
      <Footer />
    </div>
  );
}
