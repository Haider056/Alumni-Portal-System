import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Components/Footer";
import Job1 from "../Components/Assets/UpcomingEvents.png";
import { useNavigate } from 'react-router-dom';

const PostedNews = () => {
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/getnews`, {
          credentials: 'include' 
        });
        const data = await response.json();
        if (data && data.news && data.news.length > 0) {
          setNewsList(data.news);
          console.log(data.news);
        } else {
          console.log("Data is empty or null.");
        }
      } catch (error) {
        console.error("Error fetching News:", error);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`http://localhost:3001/auth/news/${idToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setNewsList(prevNewsList => prevNewsList.filter(news => news.id !== idToDelete));
      } else {
        console.error('Failed to delete news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleClick = () => {
    navigate('/PostNews');
  };

  return (
    <div className="flex flex-col bg-white">
      <AdminHeader />
      <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <img loading="lazy" src={Job1} className="object-cover absolute inset-0 w-full h-full" alt="Events1" />
        <div className="relative z-10">Posted News</div>
      </div>
      <div className="self-center mt-8 text-4xl font-medium text-black max-md:max-w-full">
        Past News
      </div>
      <div className="self-center px-5 mb-12 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          {newsList.map((news, index) => (
            <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                <div className="flex justify-between items-center">
                  <img src={news.newsImageURL || 'default_image_url'} alt="News Thumbnail" className="w-full h-auto rounded-lg mb-4" />
                </div>
                <div className="text-3xl font-medium text-black">{news.newsTitle}</div>
                <div className="mt-2 text-black">{news.newsDescription.slice(0, 100)}...</div>
                <button className="text-red-500 font-medium mt-2" onClick={() => handleDelete(news.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center my-6">
          <button
            className="bg-[#0d6ee1] text-white py-2 px-4 rounded-full text-lg md:text-xl font-medium tracking-wide"
            onClick={handleClick}
          >
            Post News
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostedNews;
