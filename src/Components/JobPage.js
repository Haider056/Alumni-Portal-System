import * as React from "react";
import job1 from "./Assets/Job1.png";
import Searchh from "./Assets/search.png";
import Footer from "./Footer";
import Header from "./Header";
import { useState, useEffect } from 'react';
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function JobPage() {

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/AllPostedJobs/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            'Content-Type': 'application/json' 
          },
          credentials: 'include' 
        });
        const data = await response.json();
        console.log(data);
        setJobs(data.allPostJobsOrInternships);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error);
        setIsLoading(false);
      }
    };
  
    fetchJobs();
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const userJobs = jobs && jobs.filter(job => job);
  return (
    <div className="flex flex-col bg-white">
         {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}
      <div className="flex justify-center items-center self-center px-16 py-12 mt-5 w-full bg-blue-600 max-w-[1300px] rounded-[100px] max-md:px-5 max-md:max-w-full">
        <img
          loading="lazy"
          src={job1}
          alt="job1"
          className="mt-36 mb-24 max-w-full aspect-[2.27] w-[856px] max-md:my-10"
        />
      </div>
      <div className="flex gap-5 justify-between self-center px-8 py-4 mt-5 max-w-full text-2xl bg-white shadow-sm rounded-[50px] text-zinc-600 w-[660px] max-md:flex-wrap max-md:px-5">
        <div className="flex-auto self-start mt-5">
          Search Job or Internship
        </div>
        <img
          loading="lazy"
          src={Searchh}
          alt="Search Icon"
          className="w-12 aspect-square"
        />
      </div>
      <div className="flex flex-col px-20 mt-8 w-full max-md:px-5 max-md:max-w-full">
        <div className="text-4xl font-medium text-blue-600 max-md:max-w-full">
          Job or internship
        </div>
       
        <div className="self-center px-5 mt-7 mb-5 w-full max-w-[1307px] max-md:max-w-full">
  <div className="flex gap-5 flex-wrap">
    {userJobs && userJobs.map((job, index) => (
      <div key={index} className="flex flex-col w-[30%]">
        <div className="flex flex-col border border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
          <div className="text-3xl font-medium text-black">{job.jobTitle.slice(0, 30)}</div>
          <div className="mt-6 text-2xl text-black">{job.jobDescription.slice(0, 80)}</div>
          <div className="justify-center px-9 py-3 mt-7 text-black bg-white rounded-lg shadow-sm max-md:px-5">
            {job.jobSalary.slice(0, 30)}
          </div>
          <div className="flex gap-4 justify-between mt-5 whitespace-nowrap">
            <div className="overflow-hidden relative flex-col justify-center px-11 py-3.5 text-black aspect-[4.67] max-md:px-5">
              {job.jobType}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
        
        
      </div>
      <Footer/>
    </div>
  );
}


