import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Components/Footer";
import Job1 from "../Components/Assets/UpcomingEvents.png";
export default function PostJoborInternship() {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobResponsibilities, setJobResponsibilities] = useState("");
    const [jobRequirements, setJobRequirements] = useState("");
    const [jobQualifications, setJobQualifications] = useState("");
    const [jobType, setJobType] = useState("");
    const [jobLocations, setJobLocations] = useState("");
    const [jobSalary, setJobSalary] = useState("");
 

    const handlePostJob = async () => {
      
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
    
    
     
    
        try {
            const response = await fetch(
                "http://localhost:3001/auth/createJobOrInternship",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jobTitle,
                        jobDescription,
                        jobResponsibilities,
                        jobRequirements,
                        jobQualifications,
                        jobType,
                        jobLocations,
                        jobSalary,
                        postedBy: name,
                        postedByEmail: email,
                    }),
                }
            );
        
            if (response.ok) {
                const responseData = await response.json();
                alert(responseData.message);
            }
            
        }
         
        catch (error) {
            console.error("Error posting job or internship:", error);
            alert("Error posting job or internship. Please try again later.");

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
                <div className="relative z-10">Post Job Or Internship</div>
            </div>
            <div className="flex flex-col self-center px-5 mt-8 max-w-full w-[709px]">
                <label htmlFor="jobTitle" className="text-xl font-medium text-black">
                    Job Title:
                </label>
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-2 py-1"
                />
                <label htmlFor="jobDescription" className="text-xl font-medium text-black">
                    Job Description:
                </label>
                <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-4 py-2 h-48"
                    placeholder="Enter Job Description"
                />

                <label htmlFor="jobResponsibilities" className="text-xl font-medium text-black">
                    Job Responsibilities:
                </label>
                <textarea
                    id="jobResponsibilities"
                    value={jobResponsibilities}
                    onChange={(e) => setJobResponsibilities(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-4 py-2 h-48"
                    placeholder="Enter Job Responsibilities"
                />

                <label htmlFor="jobRequirements" className="text-xl font-medium text-black">
                    Job Requirements:
                </label>
                <textarea
                    id="jobRequirements"
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-4 py-2 h-48"
                    placeholder="Enter Job Requirements"
                />

                <label htmlFor="jobQualifications" className="text-xl font-medium text-black">
                    Job Qualifications:
                </label>
                <textarea
                    id="jobQualifications"
                    value={jobQualifications}
                    onChange={(e) => setJobQualifications(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-4 py-2 h-48"
                    placeholder="Enter Job Qualifications"
                />

                <div className="flex gap-5 justify-between mt-5 font-medium capitalize max-md:flex-wrap max-md:max-w-full">
                    <div className="flex-auto self-start mt-2.5 text-3xl">Job Type</div>
                    <div className="flex gap-3">
                        <div
                            onClick={() => setJobType("Project Base")}
                            className={`py-3.5 px-5 mt-3 whitespace-nowrap rounded-xl shadow-sm cursor-pointer ${
                                jobType === "Project Base"
                                    ? "bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            Project Base
                        </div>
                        <div
                            onClick={() => setJobType("Full time")}
                            className={`py-3.5 px-5 mt-3 whitespace-nowrap rounded-xl shadow-sm cursor-pointer ${
                                jobType === "Full time"
                                    ? "bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            Full time
                        </div>
                        <div
                            onClick={() => setJobType("Part Time")}
                            className={`py-3.5 px-5 mt-3 whitespace-nowrap rounded-xl shadow-sm cursor-pointer ${
                                jobType === "Part Time"
                                    ? "bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            Part Time
                        </div>
                        <div
                            onClick={() => setJobType("internship")}
                            className={`py-3.5 px-5 mt-3 whitespace-nowrap rounded-xl shadow-sm cursor-pointer ${
                                jobType === "internship"
                                    ? "bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            internship
                        </div>
                    </div>
                </div>

                <label htmlFor="jobLocations" className="text-xl font-medium text-black">
                    Job Locations:
                </label>
                <input
                    type="text"
                    value={jobLocations}
                    onChange={(e) => setJobLocations(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-2 py-1"
                    placeholder="Enter Job Locations"
                />

                <label htmlFor="jobSalary" className="text-xl font-medium text-black">
                    Job Salary:
                </label>
                <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="text-2xl font-medium text-black capitalize max-md:max-w-full border border-black px-2 py-1"
                    placeholder="Enter Job Salary"
                />

                <div
                    onClick={handlePostJob}
                    className="mx-auto justify-center items-center px-16 py-4 mt-12 text-2xl text-white bg-[linear-gradient(127deg,#0D6EE1_1.95%,#00065B_97.06%)] rounded-[50px] max-w-[300px] max-md:px-5 max-md:mt-10 cursor-pointer"
                >
                    Post
                </div>
            </div>
            <div className="self-center mt-12 text-3xl font-medium text-red-500 max-md:mt-10 max-md:max-w-full">
                This Job Ad will expire in 30 days
            </div>
            <Footer />
        </div>
    );
}
