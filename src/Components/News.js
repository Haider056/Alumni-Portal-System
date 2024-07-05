import React, { useState, useEffect } from "react";
import Header from "./Header";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
import Footer from "./Footer";
import Searchh from "./Assets/search.png";
import News1 from "./Assets/News1.png";
import { Link } from 'react-router-dom';
export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/getnews`, {
          credentials: "include",
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

  return (
    <div className="flex flex-col bg-white">
         {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}
      <div className="flex flex-col px-14 mt-5 w-full max-md:px-5 max-md:max-w-full">
        <div
          className="justify-center items-end pr-28 pb-20 pl-16 italic font-medium text-white whitespace-nowrap pt-[501px] rounded-[100px] text-[200px] max-md:pt-10 max-md:pr-8 max-md:pl-5 max-md:max-w-full max-md:text-4xl"
          style={{
            backgroundImage: `url(${News1})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          News
        </div>
        <div className="flex gap-5 justify-between self-center px-10 py-4 mt-5 max-w-full text-2xl bg-white shadow-sm rounded-[50px] text-zinc-600 w-[660px] max-md:flex-wrap max-md:px-5">
          <div className="flex-auto my-auto">Search News</div>
          <img
            loading="lazy"
            src={Searchh}
            className="w-12 aspect-square"
            alt="image1"
          />
        </div>
        <div className="mx-11 mt-12 mb-12 max-md:mr-2.5 max-md:max-w-full">
          {newsList.map((news, index) => (
            <div
              className={`flex gap-5 max-md:flex-col max-md:gap-0 ${index % 2 === 0 ? "" : "flex-row-reverse"
                }`}
              key={index}
            >
              <div className="flex flex-col w-[43%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow text-xl font-medium text-white whitespace-nowrap max-md:mt-8 max-md:max-w-full">
                  <img
                    loading="lazy"
                    src={news.newsImageURL}
                    className="w-full aspect-[1.27] max-md:max-w-full"
                    alt={`News thumbnail ${index}`}
                  />
                  <div
                    className="justify-center items-center self-center px-16 py-6 mt-5 max-w-full rounded-[50px]  max-md:px-5"
                    style={{ backgroundColor: "blue", color: "white" }}
                  >
                     <Link to={`/newsDescription/${news.id}`} className="text-white">Read More</Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[57%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col mt-3.5 font-medium text-black max-md:mt-10 max-md:max-w-full">
                  <div className="text-4xl max-md:max-w-full">{news.newsTitle}</div>
                  <div className="mt-9 text-2xl max-md:max-w-full">
                    {news.newsDescription && news.newsDescription.slice(0, 300)}...
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
      <Footer />
    </div>
  );
}
