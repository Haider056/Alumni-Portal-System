import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Job1 from "../Components/Assets/UpcomingEvents.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function PostAlumniSuccessStories() {
  const [alumniData, setAlumniData] = useState({
    alumni_name: "",
    graduation_year: "",
    department_name: "",
    success_story: "",
    alumni_email: "",
  });
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);
  useEffect(() => {
    const alumniName = localStorage.getItem("name");
    const alumniEmail = localStorage.getItem("email");
    if (alumniName) {
      setAlumniData((prevData) => ({
        ...prevData,
        alumni_name: alumniName,
        alumni_email: alumniEmail,
      }));
    }
  }, []);

  const handlePostJob = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/auth/createSuccessStory",
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(alumniData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    

    const updatedValue = name === 'graduation_year' ? parseInt(value) : value;
    
    setAlumniData({
      ...alumniData,
      [name]: updatedValue,
    });
  };

  return (
    <div className="flex flex-col bg-white">
         {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}
      <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <img
          loading="lazy"
          src={Job1}
          className="object-cover absolute inset-0 w-full h-full"
          alt="Events1"
        />
        <div className="relative z-10">Alumni Success Stories</div>
      </div>
      <div className="flex flex-col items-center px-20 mt-5 w-full max-md:px-5 max-md:max-w-full">
        <div className="justify-center items-center px-16 py-4 max-w-full border border-black text-2xl font-medium text-black whitespace-nowrap bg-white rounded-xl shadow-sm w-[500px] max-md:px-5">
          {alumniData.alumni_name && <span>{alumniData.alumni_name}</span>}
        </div>

        <div className="flex gap-5 justify-between mt-4 w-full text-xl lowercase whitespace-nowrap max-w-[1035px] text-neutral-500 max-md:flex-wrap max-md:max-w-full">
          <div className="flex-grow justify-center items-start py-4 pr-16 pl-2.5 bg-white rounded-xl shadow-sm max-md:pr-5 max-md:max-w-full">
            <label className="block text-lg max-w-full text-blue-600 w-[226px] font-semibold mb-2 uppercase">
              Graduation year
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Enter Graduation year"
              name="graduation_year"
              onChange={handleChange}
            />
          </div>
          <div className="flex-grow justify-center px- mt-3 py-1 items-start pr-16 pl-2.5 bg-white rounded-xl shadow-sm max-md:pr-5 max-md:max-w-full">
            <label className="block text-lg max-w-full text-blue-600 w-[226px] font-semibold mb-2 uppercase">
              DEPARTMENT
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Enter Department"
              name="department_name"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex-grow justify-center w-1/2 h-1/2 px- mt-3 py-1  items-start pr-16 pl-2.5 bg-white rounded-xl shadow-sm max-md:pr-5 max-md:max-w-full">
          <label className="block text-lg max-w-full text-blue-600 font-semibold mb-2 uppercase">
            Enter Success Story
          </label>
          <textarea
            className="w-full h-44  px-4 py-6 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Enter Success Stories"
            name="success_story"
            onChange={handleChange}
          ></textarea>
        </div>

        <div
          onClick={handlePostJob}
          className="mx-auto justify-center items-center mb-5 px-16 py-4 mt-12 text-2xl text-white bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] rounded-[50px] max-w-[300px] max-md:px-5 max-md:mt-10 cursor-pointer"
        >
          Post
        </div>
      </div>
      <Footer />
    </div>
  );
}
