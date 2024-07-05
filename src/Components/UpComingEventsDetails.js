import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Events1 from "./Assets/UpcomingEvents.png";
import Header from "./Header";
import Footer from "./Footer";
import map from "./Assets/Map.png";
import clock from "./Assets/Clock.png";
import calendar from "./Assets/Calendar.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";

export default function EventDetails() {
  const { id } = useParams();
  const [userRole, setUserRole] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/event/${id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching Event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

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
          src={Events1}
          className="object-cover absolute inset-0 w-full h-full"
          alt="Events1"
        />
        <div className="relative z-10">Event Details</div>
      </div>

      <div className="flex flex-col self-center px-5 mt-5 w-full text-3xl text-black max-w-[1200px] max-md:max-w-full">
        <img
          loading="lazy"
          src={event.imageURL}
          alt={event.eventTitle}
          className="w-full shadow-sm aspect-[1.49] max-md:max-w-full"
        />
        <div className="mt-8 text-4xl font-medium max-md:max-w-full">
          {event.eventTitle}
        </div>
        <div className="flex gap-4 self-start mt-8 whitespace-nowrap">
          <img
            loading="lazy"
            src={calendar}
            alt="calendar"
            className="self-start aspect-[0.91] fill-black w-[29px]"
          />
          <div className="grow">{event.eventDate}</div>
        </div>
        <div className="flex gap-4 self-start mt-7 whitespace-nowrap">
          <img
            loading="lazy"
            src={clock}
            alt="clock1"
            className="self-start w-8 aspect-square fill-black"
          />
          <div className="grow">{event.eventTiming}</div>
        </div>
        <div className="flex gap-4 self-start mt-7 whitespace-nowrap">
          <img
            loading="lazy"
            src={map}
            alt="map1"
            className="aspect-[0.72] fill-black w-[23px]"
          />
          <div className="grow my-auto">{event.eventLocations}</div>
        </div>
        <div className="mt-9 max-md:max-w-full">
          {event.eventDescription}
        </div>
        <div className="shrink-0 mt-11 h-0.5 max-md:mt-10 max-md:max-w-full" />
        
        <div className="shrink-0 mt-4 h-0.5 max-md:max-w-full" />
      </div>
      <Footer />
    </div>
  );
}
