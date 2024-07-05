import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Events1 from "./Assets/UpcomingEvents.png";
import Header from "./Header";
import Footer from "./Footer";
import map from "./Assets/Map.png";
import clock from "./Assets/Clock.png";
import calendar from "./Assets/Calendar.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";

export default function UpComingEvents() {
  const [userRole, setUserRole] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }

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
      <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
        <img
          loading="lazy"
          src={Events1}
          className="object-cover absolute inset-0 w-full h-full"
          alt="Events1"
        />
        <div className="relative z-10">Upcoming Events</div>
      </div>

      <div className="self-center mt-5 w-full max-w-[1266px] max-md:max-w-full">
        {eventsList.map((event) => (
          <div key={event.id} className="flex flex-col mb-10">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
              <img
                loading="lazy"
                src={event.imageURL}
                alt={event.eventTitle}
                className="w-1/2 h-auto shadow-sm aspect-[1.23] max-md:max-w-full mr-5"
                onClick={() => navigate(`/event/${event.id}`)}
              />
              <div className="flex flex-col ml-5 w-full">
                <div className="flex flex-col px-5 mt-3.5 text-3xl max-md:mt-10 max-md:max-w-full">
                  <div className="flex flex-col items-start text-black max-md:max-w-full">
                    <div className="self-stretch text-4xl font-medium max-md:max-w-full">
                      {event.eventTitle}
                    </div>
                    <div className="flex gap-4 mt-11 whitespace-nowrap max-md:mt-10">
                      <img
                        loading="lazy"
                        src={calendar}
                        className="self-start aspect-[0.91] fill-black w-[29px]"
                        alt="calendar1"
                      />
                      <div className="grow">{event.eventDate}</div>
                    </div>
                    <div className="flex gap-4 mt-7 whitespace-nowrap">
                      <img
                        loading="lazy"
                        src={clock}
                        alt="clock"
                        className="self-start w-8 aspect-square fill-black"
                      />
                      <div className="grow">{event.eventTiming}</div>
                    </div>
                    <div className="flex gap-4 mt-7 whitespace-nowrap">
                      <img
                        loading="lazy"
                        src={map}
                        alt="map"
                        className="aspect-[0.72] fill-black w-[23px]"
                      />
                      <div className="grow my-auto">{event.eventLocations}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 justify-between mt-12 text-2xl font-medium whitespace-nowrap max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                    <div
                      className="flex flex-1 justify-center items-center px-16 py-5 bg-white shadow-sm rounded-[50px] max-md:px-5"
                      onClick={() => navigate(`/event/${event.eventid}`)}
                    >
                      <div className="bg-clip-text bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)]">
                        Full Details
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-9 max-md:max-w-full">
                  {event.eventdescription}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
