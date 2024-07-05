import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
function NewsDescription() {

    const { newsId } = useParams();
    const [newsDetails, setnewsDetails] = useState(null);
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          const parsedRole = JSON.parse(storedRole);
          setUserRole(parsedRole.role);
        }
      }, []);
    useEffect(() => {
        const fetchnewsDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/news/${newsId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setnewsDetails(data.newsID);
            } catch (error) {
                console.error('Error fetching news details:', error);
            }
        };

        fetchnewsDetails();
    }, [newsId]);

    return (
        <div className="flex flex-col bg-white">
             {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}

            {newsDetails && (
                <>
                    <div className="flex flex-col grow text-xl mt-12 font-medium text-white whitespace-nowrap max-md:mt-8 max-md:max-w-full justify-center items-center">
                        <div style={{ width: '85%', height: '35vw' }}>
                            <img
                                loading="lazy"
                                src={newsDetails.newsImageURL}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                alt={`News thumbnail`}
                                className='rounded-lg'
                            />
                        </div>
                    </div>



                    <div className="self-center w-1/2 mt-7 text-2xl font-medium text-black max-md:max-w-full">
                        <div className="font-semibold">{newsDetails.newsTitle}</div>
                        <br />
                        <br />
                        <span className="font-semibold"></span>{" "}
                        {newsDetails.newsDescription}
                        <br />
                        <br />
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}

export default NewsDescription;
