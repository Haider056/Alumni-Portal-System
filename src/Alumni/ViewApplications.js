import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Background from '../Components/Assets/background.png';
import {  useParams } from 'react-router-dom';
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function ViewApplication() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
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
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/jobApplications/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("Application213",data);
                if (response.ok) {
                    setApplications(data.applications);
                } else {
                    console.error('Error fetching job applications:', data.message);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching job applications:', error);
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id]);

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
                        <h1 className="text-3xl md:text-5xl">ViewApplication</h1>
                    </div>
                    {loading && (
                        <div className="px-4 md:px-10 text-center">
                            <p className="text-lg">Loading...</p>
                        </div>
                    )}
                    {!loading && applications.length === 0 && (
                        <div className="px-4 md:px-10 text-center">
                            <p className="text-lg">No applications found for this job.</p>
                        </div>
                    )}
                    {!loading && applications.length > 0 && (
                        <div className="px-4 md:px-10">
                            {applications.map(application => (
                                <div key={application.id} className="mt-4 md:mt-8">
                                    <h4 className="text-xl md:text-2xl text-[#767676] font-medium">Applicant: {application.applicant_name}</h4>
                                    <p className="text-base md:text-lg">
                                        <strong>Email:</strong> {application.applicant_email}<br />
                                        <strong>Name:</strong> {application.name}<br />
                                        <strong>Application Status:</strong> {application.application_status}<br />
                                        <strong>Applied At:</strong> {new Date(application.applied_at).toLocaleString()}<br />
                                        <strong>Profession:</strong> {application.profession}<br />
                                        <strong>Experience:</strong> {application.experience}<br/>
                                        <strong>about:</strong> {application.about}<br />
                                        <strong>Education:</strong> {application.education}<br />
                                        <strong>Number:</strong> {application.number}<br />
                                        <strong>Experience:</strong> {application.experience}<br />
                                        <strong>Skills:</strong> {application.skills}<br />
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
