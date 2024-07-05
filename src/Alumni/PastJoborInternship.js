import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useNavigate } from 'react-router-dom';
import Job1 from "../Components/Assets/UpcomingEvents.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";

const PastJoborInternship = () => {
  const [jobs, setJobs] = useState([]);
  const userEmail = localStorage.getItem('email');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
    fetchJobs();  // eslint-disable-next-line
  }, []); 

  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs..."); 
      const response = await fetch(`http://localhost:3001/auth/PostedJobs/${userEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log("Fetched jobs:", data); 
      setJobs(data.postJobsOrInternships || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3001/auth/DeleteJob/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        fetchJobs();
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleClick = () => {
    navigate('/PostJoborInternship');
  };
  
  const handleViewApplications = (jobId) => {
    navigate(`/viewApplication/${jobId}`);
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
        <div className="relative z-10">Past Job Or Internship</div>
      </div>
      <div className="self-center mt-8 text-4xl font-medium text-black max-md:max-w-full">
        Past Job or internship you did post
      </div>
      <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {jobs.map((job, index) => (
            <div key={index} className="flex flex-col">
              <div className="border border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                <div className="text-3xl font-medium text-black">{job.jobTitle}</div>
                <div className="mt-6 text-2xl text-black">{job.jobRequirements}</div>
                <div className="justify-center px-9 py-3 mt-7 text-black bg-white rounded-lg shadow-sm max-md:px-5">
                  {job.jobSalary}
                </div>
                <div className="flex gap-4 justify-between mt-5 whitespace-nowrap">
                  <div className="overflow-hidden relative flex-col justify-center px-11 py-3.5 text-black aspect-[4.67] max-md:px-5">
                    {job.jobType}
                  </div>
                  <div className="overflow-hidden relative flex-col justify-center items-center mr-3 py-3.5 font-medium text-red-500 aspect-[4.67] w-[290px] max-md:px-5">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleViewApplications(job.id)}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  <div className="whitespace-nowrap">
                    <div className="overflow-hidden relative py-3.5 font-medium text-red-500 aspect-[4.67] w-[290px] max-md:px-5 mx-auto">
                      <button
                        className="cursor-pointer"
                        onClick={() => deleteJob(job.id)}
                      >
                        Delete Job Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center my-6">
        <button
          className="bg-[#0d6ee1] text-white py-2 px-4 rounded-full text-lg md:text-xl font-medium tracking-wide"
          onClick={handleClick}
        >
          Post Job
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default PastJoborInternship;
