import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AppShell, PageHeader, FormSection, FormActions, Notice } from './ui';

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
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setUserRole(parsedRole.role);
    }
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem('email');
    if (userEmail) setFormData((prevState) => ({ ...prevState, email: userEmail }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const formatDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

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
        setStatus({ tone: 'success', text: responseData.message || 'Portfolio saved.' });
      } else {
        throw new Error(responseData.message || 'Failed to create portfolio');
      }
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setStatus({ tone: 'danger', text: 'Error saving portfolio. Please try again later.' });
    }
  };

  return (
    <AppShell role={userRole}>
      <PageHeader
        eyebrow="Profile"
        title="Edit portfolio"
        description="Recruiters see this when you apply. Keep it short, specific and current."
        actions={<Link to="/Portfolio" className="btn btn-secondary">Cancel</Link>}
      />
      <div className="page py-8">
        <form onSubmit={handleSubmit} className="card px-8 pt-8">
          {status && <div className="mb-6"><Notice tone={status.tone}>{status.text}</Notice></div>}

          <FormSection title="Basics" description="Your name and headline appear at the top of every application.">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="Ayesha Khan" />
              <InputField label="Email" name="email" type="email" value={formData.email} readOnly />
            </div>
            <InputField label="Profession" name="profession" onChange={handleChange} placeholder="Software Engineer" />
            <InputField label="About" name="about" type="textarea" onChange={handleChange} placeholder="Two or three sentences about what you do and what you are looking for." />
          </FormSection>

          <FormSection title="Contact & education">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Phone" name="number" onChange={handleChange} placeholder="+92 300 0000000" />
              <InputField label="City / address" name="address" onChange={handleChange} placeholder="Islamabad" />
            </div>
            <InputField label="Education" name="education" onChange={handleChange} placeholder="BS Computer Science, IST (2019 – 2023)" />
          </FormSection>

          <FormSection title="Work experience" description="Your most recent or most relevant role.">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Company" name="companyName" onChange={handleChange} placeholder="Northwind Labs" />
              <InputField label="Designation" name="designation" onChange={handleChange} placeholder="Software Engineer" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Start date</label>
                <DatePicker selected={formData.startDate} onChange={(date) => handleDateChange(date, 'startDate')} className="input" dateFormat="yyyy-MM-dd" placeholderText="YYYY-MM-DD" />
              </div>
              <div>
                <label className="label">End date</label>
                <DatePicker selected={formData.endDate} onChange={(date) => handleDateChange(date, 'endDate')} className="input" dateFormat="yyyy-MM-dd" placeholderText="Present" />
              </div>
              <InputField label="Total experience" name="experience" onChange={handleChange} placeholder="2 years" />
            </div>
            <InputField label="Description" name="experienceDescription" type="textarea" onChange={handleChange} placeholder="What you built, owned or improved." />
          </FormSection>

          <FormSection title="Skills" description="Comma separated. These show as tags on your profile.">
            <InputField label="Skills" name="skills" onChange={handleChange} placeholder="React, Node.js, SQL" />
          </FormSection>

          <FormActions note="Changes replace your current portfolio.">
            <Link to="/Portfolio" className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary">Save portfolio</button>
          </FormActions>
        </form>
      </div>
    </AppShell>
  );
}

function InputField({ label, type = 'text', name, value, onChange, readOnly, placeholder }) {
  return (
    <div>
      {label && <label className="label" htmlFor={`pf-${name}`}>{label}</label>}
      {type === 'textarea' ? (
        <textarea id={`pf-${name}`} className="input" rows={4} name={name} value={value} onChange={onChange} placeholder={placeholder}></textarea>
      ) : (
        <input id={`pf-${name}`} type={type} className="input" name={name} value={value} onChange={onChange} readOnly={readOnly} placeholder={placeholder} />
      )}
    </div>
  );
}
