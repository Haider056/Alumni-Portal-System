import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Background from './Assets/background.png';
import { useNavigate } from 'react-router-dom';
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function Portfolio() {
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          const parsedRole = JSON.parse(storedRole);
          setUserRole(parsedRole.role);
        }
      }, []);
    useEffect(() => {
        const fetchPortfolio = async () => {
            const userEmail = localStorage.getItem('email');
            try {
            
                const response = await fetch(`http://localhost:3001/auth/portfolio/${userEmail}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include' 
                });
                const data = await response.json();
                setPortfolio(data.portfolio);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                setLoading(false);
            }
        };
    
        fetchPortfolio();
    }, []);

    const handleClick = () => {
        navigate('/CreatePortfolio');
    };

    return (
        <div>
              {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}
            <div id="NewRootRoot" className="flex flex-col md:flex-row w-full">
                <div id="Portfolio1" className="bg-white flex flex-col gap-12 w-full p-4 md:p-10">
                    <div id="FI" className="relative text-white font-semibold uppercase text-center py-16 md:py-24 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${Background}), linear-gradient(to right, rgba(13, 110, 225, 0.8), rgba(13, 110, 225, 0.8))`
                        }}>
                        <h1 className="text-3xl md:text-5xl">Portfolio</h1>
                    </div>
                    {!loading && !portfolio && (
                        <div className="px-4 md:px-10 text-center">
                            <p className="text-lg">Portfolio does not exist.</p>
                            <button className="bg-[#0d6ee1] text-white py-2 px-4 rounded-full text-lg md:text-xl font-medium tracking-wide" onClick={handleClick}>Create Portfolio</button>
                        </div>
                    )}
                    {portfolio && (
                        <div className="px-4 md:px-10">
                            <div className="flex flex-col md:flex-row md:justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-medium text-[#094bb4]">{portfolio.name}</h2>
                                    <h3 className="text-xl md:text-2xl font-medium">{portfolio.profession}</h3>
                                </div>
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                        <div className="flex flex-col">
                                            <span className="text-lg md:text-xl text-[#767676]">Email:</span>
                                            <span className="text-base md:text-lg">{portfolio.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg md:text-xl text-[#767676]">Number:</span>
                                            <span className="text-base md:text-lg">{portfolio.number}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-lg md:text-xl text-[#767676]">Address:</span>
                                        <div className="text-base md:text-lg">{portfolio.address}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-8">
                                <h4 className="text-xl md:text-2xl text-[#767676] font-medium">About Me</h4>
                                <p className="text-sm md:text-base">
                                    {portfolio.about}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-8">
                                <h4 className="text-xl md:text-2xl text-[#767676] font-medium">Education</h4>
                                <p className="text-sm md:text-base">
                                    {portfolio.education}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-8">
                                <h4 className="text-xl md:text-2xl text-[#767676] font-medium">Work Experience</h4>
                                <p className="text-sm md:text-base">
                                    <strong>Company Name:</strong> {portfolio.companyName}<br />
                                    <strong>Designation:</strong> {portfolio.designation}<br />
                                    <strong>Start Date:</strong> {new Date(portfolio.startDate).toLocaleDateString()}<br />
                                    <strong>End Date:</strong> {new Date(portfolio.endDate).toLocaleDateString()}<br />
                                    <strong>Experience Description:</strong> {portfolio.experienceDescription}
                                </p>
                            </div>

                            <div className="mt-4 md:mt-8">
                                <h4 className="text-xl md:text-2xl text-[#767676] font-medium">Skills</h4>
                                <ul className="list-none space-y-1 text-sm md:text-base">
                                    <li>{portfolio.skills}</li>
                                </ul>
                            </div>
                            <div className="flex justify-center my-6">
                                <button className="bg-[#0d6ee1] text-white py-2 px-4 rounded-full text-lg md:text-xl font-medium tracking-wide" onClick={handleClick}>Edit</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
