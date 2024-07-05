import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Job1 from "../Components/Assets/UpcomingEvents.png";
import { useNavigate } from 'react-router-dom';
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
const PostedSuccessStories = () => {
    const [successStories, setSuccessStories] = useState([]);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          const parsedRole = JSON.parse(storedRole);
          setUserRole(parsedRole.role);
        }
      }, []);
    const fetchSuccessStories = async () => {
        const userEmail = localStorage.getItem('email');
        try {
            const response = await fetch(`http://localhost:3001/auth/successStories/${userEmail}`, {
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

    const handleClick = () => {
        navigate('/PostAlumniSuccessStories');
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3001/auth/deleteSuccessStory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                    'Content-Type': 'application/json' 
                },
                credentials: 'include' 
            });
            
            // Update the success stories after deletion
            fetchSuccessStories();
        } catch (error) {
            console.error('Error deleting success story:', error);
        }
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
                    alt="AlumniSuccess"
                />
                <div className="relative z-10">Alumni Success Stories</div>
            </div>
            <div className="self-center mt-8 text-4xl font-medium text-black max-md:max-w-full">
                Your Success Stories From past
            </div>
            <div className="self-center px-5 mt-7 w-full max-w-[1307px] max-md:max-w-full">
                {successStories && successStories.length > 0 && (
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                        {successStories.map((story, index) => (
                            <div key={index} className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col border border-gray-500 grow px-4 pt-9 pb-5 mx-auto w-full text-xl bg-white rounded-2xl shadow-sm max-md:mt-6">
                                    <div className="text-3xl font-medium text-black">{story.alumni_name}</div>
                                    <div className="mt-2 text-xl text-black">{story.department_name}, Class of {story.graduation_year}</div>
                                    <div className="mt-6 text-2xl text-black">{story.success_story.slice(0, 80)}</div>
                                    <div className="mt-5 text-sm text-gray-500">{new Date(story.created_at).toLocaleDateString()}</div>
                                    <button className="mt-5 bg-[#0d6ee1] text-white py-2 px-4 rounded-full text-lg md:text-xl font-medium tracking-wide" onClick={() => handleDelete(story.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-center my-6">
                <button className="bg-[#0d6ee1] text-white py-2  px-4 rounded-full text-lg md:text-xl font-medium tracking-wide" onClick={handleClick}>Add More</button>
            </div>
            <Footer />
        </div>
    );
};

export default PostedSuccessStories;
