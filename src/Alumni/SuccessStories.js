import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Job1 from "../Components/Assets/UpcomingEvents.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function SuccessStories() {
  const [successStories, setSuccessStories] = useState([]);
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/AllSuccessStories/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        setSuccessStories(data.successStories);
      } catch (error) {
        console.error('Error fetching Success Story:', error);
      }
    };

    fetchSuccessStories();
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
      <div className="relative overflow-hidden w-full min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <img
          loading="lazy"
          src={Job1}
          className="object-cover w-full h-full"
          alt="Events1"
        />
        <div className="absolute inset-0 flex items-center justify-center text-6xl font-semibold text-white z-10">Success Stories</div>
      </div>
      <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
    {successStories && successStories.length > 0 && (
        <div className="max-md:flex-col max-md:gap-0 max-md:">

            {successStories.map((story, index) => (
                <div key={index} className="flex flex-col w-full max-md:ml-0">
                    <div className="flex flex-col border mt-5 mb-5 border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                        <div className="text-3xl font-medium text-black">{story.alumni_name}</div>
                        <div className="mt-2 text-xl text-black">{story.department_name}, Class of {story.graduation_year}</div>
                        <div className="mt-6 text-2xl text-black">{story.success_story}</div>
                        <div className="mt-5 text-sm text-gray-500">{new Date(story.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>
      <Footer />
    </div>
  );
}
