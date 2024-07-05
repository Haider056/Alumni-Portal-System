import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Components/Footer";
import { useNavigate } from 'react-router-dom';
import Job1 from "../Components/Assets/UpcomingEvents.png";

const PostedEvents = () => {
  const [eventsList, setEventsList] = useState([]);
  const userEmail = localStorage.getItem('email');
  const navigate = useNavigate();

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
        setEventsList(data);
      } catch (error) {
        console.error("Error fetching Events:", error);
      }
    };

    fetchEvents();
  }, [userEmail]);

  const handleClick = () => {
    navigate('/postEvents');
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3001/auth/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setEventsList(eventsList.filter(event => event.id !== eventId));
      console.log(`Event with ID ${eventId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting event:", error);
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
        <div className="relative z-10">Posted News</div>
      </div>

      <div className="self-center mt-8 text-4xl font-medium text-black max-md:max-w-full">
        Past Events you did post
      </div>

      <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {eventsList.map((event, index) => (
            <div key={index} className="flex flex-col">
              <div className="border border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full bg-white rounded-2xl shadow-sm max-md:mt-6">
                <img
                  loading="lazy"
                  src={event.imageURL}
                  alt={event.eventTitle}
                  className="object-cover w-full h-44 rounded-t-2xl"
                />
                <div className="px-4 py-3">
                  <div className="text-3xl font-medium text-black">{event.eventTitle}</div>
                  <div className="mt-3 text-2xl text-gray-600">{event.eventDate}</div>
                  <div className="mt-3 text-2xl text-gray-600">{event.eventTiming}</div>
                  <button
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full text-lg font-medium"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
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
          Post Events
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default PostedEvents;
