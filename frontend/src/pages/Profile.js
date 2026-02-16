import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/Profile.css';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProfile(data.user);
      setFormData(data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
        setIsEditing(false);
        fetchProfile();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <h2>My Profile</h2>
          {message && <div className="message">{message}</div>}

          <div className="profile-card">
            {!isEditing ? (
              <div className="profile-view">
                <div className="profile-field">
                  <label>Name:</label>
                  <p>{profile?.first_name} {profile?.last_name}</p>
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <p>{profile?.email}</p>
                </div>
                <div className="profile-field">
                  <label>Phone:</label>
                  <p>{profile?.phone || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Department:</label>
                  <p>{profile?.department || 'Not provided'}</p>
                </div>
                <div className="profile-field">
                  <label>Role:</label>
                  <p>{profile?.role}</p>
                </div>
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <input
                    type="text"
                    value={formData.role}
                    disabled
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
