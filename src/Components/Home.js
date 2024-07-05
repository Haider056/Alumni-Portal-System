import * as React from "react";
import './Styles/home.css'
import main from './Assets/ist.png'
import Footer from "./Footer";
import Header from "./Header";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



function Home() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successStories, setSuccessStories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');

    if (storedName) {
      setUserName(storedName);
    }
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


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/allEvents`, {
          credentials: 'include' 
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
       
        const latestEvents = data.slice(0, 3); 
        setEventsList(latestEvents);
      } catch (error) {
        console.error("Error fetching Events:", error);
      }
    };

    fetchEvents();
  }, []);
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
      console.log('Success Stories:', data);
      setSuccessStories(data.successStories);
    } catch (error) {
      console.error('Error fetching alumni success stories:', error);
    }
  };

  useEffect(() => {
    fetchSuccessStories();
  }, []);

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



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-white flex flex-col">
      {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}

      <h1>Welcome, {userName}!</h1>
      <div className="flex-col overflow-hidden self-center relative flex min-h-[719px] w-full max-w-[1304px] items-stretch mt-11 px-8 py-12 max-md:max-w-full max-md:mt-10 max-md:px-5">
        <img
          src={main}
          className="absolute h-full w-full object-cover object-center inset-0 rounded-lg"
          alt={"home1"}
        />

        <div className="relative text-black text-6xl font-medium mt-4 max-md:max-w-full max-md:text-4xl">
          IST Alumni Portal
        </div>

      </div>
      <div className="self-center flex w-full max-w-[1298px] items-stretch justify-between gap-5 mt-14 px-5 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
        <div className="text-blue-600 text-4xl font-medium grow shrink basis-auto">
          Job or internship
        </div>
        <Link to="/jobpage" className="text-black text-3xl font-medium my-auto">
          See more
        </Link>
      </div>
      <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        <div className="flex gap-5 flex-wrap">
          {jobs.slice(0, 6).map((job, index) => (
            <div key={index} className="flex flex-col w-[30%]">
              <Link to={`/JobDescription/${job.id}`} className="text-black">

                <div className="flex flex-col border border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                  <div className="text-3xl font-medium text-black">{job.jobTitle.slice(0, 40)}</div>
                  <div className="mt-6 text-2xl text-black">{job.jobDescription.slice(0, 60)}</div>
                  <div className="justify-center px-9 py-3 mt-7 text-black bg-white rounded-lg shadow-sm max-md:px-5">
                    {job.jobSalary.slice(0, 30)}
                  </div>
                  <div className="flex gap-4 justify-between mt-5 whitespace-nowrap">
                    <div className="overflow-hidden relative flex-col justify-center px-11 py-3.5 text-black aspect-[4.67] max-md:px-5">
                      {job.jobType}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>



      <div className="self-center flex w-full max-w-[1298px] items-stretch justify-between gap-5 mt-14 px-5 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
        <div className="text-blue-600 text-4xl font-medium grow shrink basis-auto">
          LATEST NEWS
        </div>
        <Link to="/News" className="text-black text-3xl font-medium my-auto">See more</Link>
      </div>
      <div className="self-center px-5 mb-12 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
          {newsList.map((news, index) => (
            <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
              <Link to={`/newsDescription/${news.id}`} className="flex flex-col grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                <div className="flex justify-between items-center">
                  <img src={news.newsImageURL || 'default_image_url'} alt="News Thumbnail" className="w-full h-auto rounded-lg mb-4" />
                </div>
                <div className="text-3xl font-medium text-black">{news.newsTitle}</div>
               
              </Link>
            </div>
          ))}
        </div>
      </div>


      <div className="flex flex-col items-center bg-white">
        <div className="flex gap-5 px-5 mt-9 w-full font-medium max-w-[1295px] max-md:flex-wrap max-md:max-w-full" />
        <div className="flex gap-5 px-5 mt-9 w-full font-medium max-w-[1295px] max-md:flex-wrap max-md:max-w-full" />
        <div className="self-center flex w-full max-w-[1299px] items-stretch justify-between gap-5 mt-14 px-5 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
        <div className="text-blue-600 text-4xl mt-12 font-medium grow shrink basis-auto max-md:max-w-full">
          Upcoming Events
        </div>
        <Link to="/Upcomingevents" className="text-black pt-9 text-3xl font-medium my-auto">
          See more
        </Link>
      </div>
        <div className="mt-6 w-full max-w-[1264px] max-md:max-w-full">
  <div className="flex flex-col gap-5 max-md:flex-col max-md:gap-0">
    {eventsList.map(event => (
      <div key={event.id} className="flex flex-row items-start max-md:w-full">
        <img
          loading="lazy"
          src={event.imageURL}
          alt={event.eventTitle}
          className="w-1/2 h-auto shadow-sm aspect-[1.23] max-md:max-w-full mr-5" 
        />
        <div className="flex flex-col" > 
          <div className="self-stretch text-4xl mt-1 mb-5 font-medium max-md:max-w-full ">{event.eventTitle}</div>
          <div className="flex text-4xl mb-8 gap-4 max-md:max-w-full">
            <div>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="flex text-4xl mb-8 gap-4 max-md:max-w-full">
            <div>{event.eventTiming}</div>
          </div>
          <div className="flex text-4xl gap-4 max-md:max-w-full">
            <div>{event.eventLocations}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>


      <div className="self-center flex w-full max-w-[1299px] items-stretch justify-between gap-5 mt-14 px-5 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
        <div className="text-blue-600 text-4xl mt-12 font-medium grow shrink basis-auto max-md:max-w-full">
          Alumni Success Stories
        </div>
        <Link to="/SuccessStories" className="text-black text-3xl font-medium my-auto">
          See more
        </Link>
      </div>
      <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        {successStories && successStories.length > 0 && (
          <div className="max-md:flex-col max-md:gap-0 max-md:">
            {successStories.slice(0, 2).map((story, index) => (
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


export default Home;