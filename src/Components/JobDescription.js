import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Header from "./Header";
import Footer from "./Footer";
import job1 from "./Assets/Job1.png";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
function Jobdescription() {
    const navigate = useNavigate(); 
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          const parsedRole = JSON.parse(storedRole);
          setUserRole(parsedRole.role);
        }
      }, []);
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/auth/JobDescription/${jobId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                setJobDetails(data.postJobOrInternship); 
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const handleApply = () => {
        setIsApplyModalOpen(true);
    };

    const handleCloseApplyModal = () => {
        setIsApplyModalOpen(false);
    };
    const handleViewPortofolio = () => {
        navigate('/Portfolio')
    };
    const handleApplyWithPortfolio = async () => {
        try {
          
            const userEmail = localStorage.getItem('email');
           
            
            const response = await fetch('http://localhost:3001/auth/applyJob', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    jobId: jobId,
                    applicantEmail: userEmail
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                alert(JSON.stringify(responseData.message));

            } else {
             
                console.error('Job application failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error applying for the job:', error);
        } finally {
          
            handleCloseApplyModal();
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
           
<div className="flex justify-center items-center self-center px-16 py-12 mt-5 w-full bg-blue-600 max-w-[1300px] rounded-[100px] max-md:px-5 max-md:max-w-full">
                <img
                    loading="lazy"
                    src={job1}
                    alt="job1"
                    className="mt-36 mb-24 max-w-full aspect-[2.27] w-[856px] max-md:my-10"
                />
            </div>
            {jobDetails && (
                <div className="self-center w-1/2 mt-7 text-2xl font-medium text-black max-md:max-w-full">
                    <div className="font-semibold">{jobDetails.jobTitle}</div>
                    <br />
                    <br />
                    <span className="font-semibold">Responsibilities:</span>{" "}
                    {jobDetails.jobResponsibilities}
                    <br />
                    <br />
                    <span className="font-semibold">Requirements:</span>{" "} {jobDetails.jobRequirements}
                    <br />
                    <br />
                    <span className="font-semibold">Qualifications:</span>{" "} {jobDetails.jobQualifications}
                    <br />
                    <br />
                    <span className="font-semibold">Type: </span>{" "}{jobDetails.jobType}
                    <br />
                    <br />
                    <span className="font-semibold">Locations: </span>{" "}{jobDetails.jobLocations}
                    <br />
                    <br />
                    <span className="font-semibold">Salary: </span>{" "}{jobDetails.jobSalary}
                </div>


            )}


            <div className="justify-center items-center self-center px-16 py-6 mt-5 max-w-full rounded-[50px]  max-md:px-5" style={{ backgroundColor: 'blue', color: 'white', marginBottom: "40px" }} onClick={handleApply}>
                Apply Now
            </div>

            {isApplyModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md">
                        <h2 className="text-2xl font-semibold mb-4">Apply for the Job</h2>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleApplyWithPortfolio}>Apply with Portfolio</button>
                        <button className="bg-blue-500 text-white px-7 py-2 rounded-md" onClick={handleViewPortofolio}>View Portfolio</button>
                        <button className="bg-gray-500 text-white px-7 ml-3 py-2 rounded-md" onClick={handleCloseApplyModal}>Cancel</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Jobdescription;





