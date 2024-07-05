// Import necessary modules
import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Job1 from "../Components/Assets/UpcomingEvents.png";
export default function PostUpcomingEvents() {

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocations, setEventLocations] = useState("");
  const [eventTiming, setEventTiming] = useState(new Date());
  const [imageFile, setImageFile] = useState(null);
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [showAuditoriumBooking, setShowAuditoriumBooking] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  
 
  
  const handlePostEvent = () => {
    const formData = new FormData();
    formData.append("title", eventTitle);
    formData.append("description", eventDescription);
    formData.append("date", formatDate(eventDate));
    formData.append("locations", eventLocations);
    formData.append("timing", (eventTiming));
    if (imageFile) {
      formData.append("image", imageFile);
    }
  
    
    const bookAuditorium = () => {
      if (!showAuditoriumBooking) {
        return Promise.resolve(); 
      }
      
      const eventData = {
        eventTitle: eventTitle,
        eventDate: formatDate(eventDate),
        eventTime: formatTime(eventTiming),
        eventEndTime: formatTime(eventEndTime), 
      };
      
      return fetch("http://localhost:3001/auth/book", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          return response.json().then(data => {
            alert(data.message); 
            throw new Error("Failed to book auditorium"); 
          });
        }
      })
    }      
  
   
    bookAuditorium()
    .then(() => {
      return fetch("http://localhost:3001/auth/CreateEvents", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    })
    .then((response) => {
      if (response.ok) {
        alert("Event registered successfully");
      } else {
        throw new Error("Failed to register event");
      }
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert("Failed to register event");
    });
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-col items-center bg-white">
        <div className="relative overflow-hidden flex items-center justify-center pt-24 pr-16 pb-20 pl-20 w-full text-6xl font-semibold text-white min-h-[250px] max-md:px-5 max-md:pt-10 max-md:max-w-full max-md:text-4xl">
          <img
            loading="lazy"
            src={Job1}
            className="object-cover absolute inset-0 w-full h-full"
            alt="Events1"
          />
          <div className="relative z-10">Post Upcoming Events</div>
        </div>

        <div className="flex flex-col mt-5 px-5 max-w-[744px]">
       
          <div className="text-3xl font-medium text-black capitalize max-md:max-w-full">
            Event title
          </div>
          <input
            type="text"
            className="shrink-0 mt-6  border border-black bg-white rounded-xl shadow-sm h-[100px] max-md:max-w-full"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />

     
          <div className="mt-8 text-3xl font-medium text-black capitalize max-md:max-w-full">
            Event description
          </div>
          <textarea
            className="items-start pt-7 pr-16  border border-black pb-32 pl-5 mt-4 text-2xl whitespace-nowrap bg-white rounded-xl shadow-sm text-neutral-500 max-md:pr-5 max-md:pb-10 max-md:max-w-full"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>

      
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
      
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-3xl font-medium text-black capitalize max-md:mt-6">
                <div>Event date</div>
                <DatePicker
                  selected={eventDate}
                  onChange={(date) => setEventDate(date)}
                  className="border border-black w-full p-3 rounded-lg"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
     
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-3xl font-medium text-black capitalize max-md:mt-6">
                <div>Event locations</div>
                <input
                  type="text"
                  className="justify-center  border border-black items-start py-5 pr-16 pl-4 mt-5 text-base  whitespace-nowrap bg-white rounded-xl shadow-sm text-neutral-500 max-md:pr-5"
                  value={eventLocations}
                  onChange={(e) => setEventLocations(e.target.value)}
                />
              </div>
            </div>
          </div>

      
          <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-3xl font-medium text-black capitalize max-md:mt-6">
                <div>Event timing</div>
                <DatePicker
                  selected={eventTiming}
                  onChange={(date) => setEventTiming(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm:ss"
                  minTime={new Date().setHours(8, 0, 0)}
                  maxTime={new Date().setHours(23, 0, 0)}
                  className="border border-black w-full p-3 rounded-lg"
                />
              </div>
            </div>
    
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow text-base font-medium text-black max-md:mt-5">
                <div className="mt-5">Upload a Photo
                  <input
                    type="file"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 focus:outline-none focus:border-blue-500"
                    name="imageFile"
                    onChange={handleFileChange}
                  /></div>
              </div>
            </div>
          </div>

        
          <div className="mt-5 flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-6 w-6 text-blue-500"
              checked={showAuditoriumBooking}
              onChange={() => setShowAuditoriumBooking(!showAuditoriumBooking)}
            />
            <label htmlFor="auditoriumBooking" className="ml-2 text-xl font-medium text-black">
              Book Auditorium
            </label>
          </div>

      
          {showAuditoriumBooking && (
            <div className="mt-5">
         
              <div className="text-3xl font-medium text-black capitalize">
                Event date: {formatDate(eventDate)}
              </div>
         
              <div className="text-3xl font-medium text-black capitalize">
                Event start time
              </div>
              <DatePicker
                selected={eventTiming}
                onChange={(date) => setEventTiming(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm:ss"
                minTime={new Date().setHours(8, 0, 0)}
                maxTime={new Date().setHours(23, 0, 0)}
                className="border border-black w-full p-3 rounded-lg"
              />

          
              <div className="text-3xl font-medium text-black capitalize mt-5">
                Event end time
              </div>
              <DatePicker
                selected={eventEndTime}
                onChange={(date) => setEventEndTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm:ss"
                minTime={new Date().setHours(8, 0, 0)}
                maxTime={new Date().setHours(23, 0, 0)}
                className="border border-black w-full p-3 rounded-lg"
              />
            </div>
          )}
        </div>

 
        <div
          className="justify-center items-center self-center mb-7 px-10 py-4 mt-7 max-w-full text-2xl font-medium text-white whitespace-nowrap bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] rounded-[50px] w-[150px] max-md:px-5"
          onClick={handlePostEvent}
        >
          Post
        </div>
      </div>

      <Footer />
    </div>
  );
}
