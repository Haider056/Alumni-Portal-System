import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './Footer';
import Header from "./Header";
import AlumniHeader from "../Alumni/AlumniHeader";
import AdminHeader from "../Admin/AdminHeader";
export default function CreatePortfolio() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    about: '',
    education: '',
    address: '',
    number: '',
    experience: '',
    companyName: '',
    designation: '',
    startDate: null,
    endDate: '',
    experienceDescription: '',
    skills: '',
  });
  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);
  useEffect(() => {
    // Fetch user email from local storage or wherever you store it
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      setFormData(prevState => ({ ...prevState, email: userEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? formatDate(formData.startDate) : null,
        endDate: formData.endDate ? formatDate(formData.endDate) : null,
      };
    
      const token = localStorage.getItem('token');
    
      const response = await fetch('http://localhost:3001/auth/CreatePortfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formattedData),
      });
    
      const responseData = await response.json();
    
      if (response.ok) {
        alert(JSON.stringify(responseData.message));
      } else {
        throw new Error(responseData.message || 'Failed to create portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Error creating portfolio. Please try again later.');
    }
  }    

  const formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <div className="bg-white font-poppins">
         {userRole === 'alumni' ? (
        <AlumniHeader />
      ) : userRole === 'student' ? (
        <Header />
      ) : userRole === 'admin' ? (
        <AdminHeader />
      ) : null}
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
        <h1 className="text-3xl font-semibold mb-12">Create Your Portfolio</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <InputField label="Email" name="email" type="email" value={formData.email} readOnly />
          <InputField label="Name" name="name" type="text" value={formData.name} onChange={handleChange} />
          <InputField label="Profession" name="profession" type="text" onChange={handleChange} />
          <InputField label="About Me" name="about" type="textarea" onChange={handleChange} />
          <InputField label="Education" name="education" type="text" onChange={handleChange} />
          <InputField label="Address" name="address" type="text" onChange={handleChange} />
          <InputField label="Number" name="number" type="text" onChange={handleChange} />
          <fieldset className="mb-6">
            <legend className="text-xl font-medium text-gray-600 mb-2">Work Experience</legend>
            <InputField label="Company Name" name="companyName" type="text" onChange={handleChange} />
            <InputField label="Designation" name="designation" type="text" onChange={handleChange} />
            <div className="flex gap-4">
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className="border border-gray-300 w-full p-3 rounded-lg"
                dateFormat="yyyy-MM-dd"
                placeholderText="Start Date"
              />
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                className="border border-gray-300 w-full p-3 rounded-lg"
                dateFormat="yyyy-MM-dd"
                placeholderText="End Date"
              />
            </div>
            <InputField label="Description" name="experienceDescription" type="textarea" onChange={handleChange} />
          </fieldset>
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-medium text-gray-600">Add Professional Experience</h2>
          </div>
          <InputField label="Skills" name="skills" type="text" onChange={handleChange} />
          <button type="submit" className="mt-4 bg-blue-600 text-white rounded-full px-8 py-3 w-full">
            Save
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

function InputField({ label, type = "text", name, value, onChange, readOnly }) {
  return (
    <div className="mb-6">
      {label && <label className="block text-xl font-medium text-gray-600 mb-2">{label}</label>}
      {type === "textarea" ? (
        <textarea
          className="border border-gray-300 w-full p-3 rounded-lg"
          name={name}
          value={value}
          onChange={onChange}
        ></textarea>
      ) : (
        <input
          type={type}
          className="border border-gray-300 w-full p-3 rounded-lg"
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
