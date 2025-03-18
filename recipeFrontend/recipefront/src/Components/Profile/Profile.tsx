// src/components/Profile.tsx
import React, { useState } from 'react';
import './Profile.css';
import { useUploadProfilePicMutation, useUploadCoverPicMutation, useGetCurrentUserQuery } from '../../Slices/authSlice';
import MyPosts from '../PostPage/Post/myPosts';
import LikedPosts from '../PostPage/Post/LikedPost';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
  following?: any[];
  followers?: any[];
  profilePic?: string;
  coverPic?: string;
  email?: string;
  role?: string;
  verified?: boolean;
}

interface UserResponse {
  data: User;
}

const Profile = () => {
  const [uploadProfilePic] = useUploadProfilePicMutation();
  const [uploadCoverPic] = useUploadCoverPicMutation();
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('Posts');

  const { data: user, isLoading, isError } = useGetCurrentUserQuery(undefined);
  console.log(user);
  const baseUrl = 'http://localhost:3000/';

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePic(event.target.files[0]);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePic) return;
    try {
      const formData = new FormData();
      formData.append('profilePic', profilePic, profilePic.name);
      const response = await uploadProfilePic(formData).unwrap();
      console.log('Profile Pic Upload Response:', response);
    } catch (error) {
      console.error('Profile Pic Upload Error:', error);
    }
  };

  const handleCoverPicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverPic(event.target.files[0]);
    }
  };

  const handleCoverPicUpload = async () => {
    if (!coverPic) return;
    try {
      const formData = new FormData();
      formData.append('coverPic', coverPic, coverPic.name);
      const response = await uploadCoverPic(formData).unwrap();
      console.log('Cover Pic Upload Response:', response);
    } catch (error) {
      console.error('Cover Pic Upload Error:', error);
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error loading profile. Please try again later.</div>;

  return (
    <div className="profile-container">
      {user && (
        <React.Fragment key={user.data._id}>
          {/* Banner Image */}
          <div className="banner">
            <img 
              src={user.data.coverPic 
                ? `${baseUrl}${user.data.coverPic.replace(/\\\\/g, "/")}` 
                : "https://via.placeholder.com/1500x200"} 
              alt="cover Image"
            />
          </div>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={user.data.profilePic 
                  ? `${baseUrl}${user.data.profilePic.replace(/\\/g, "/")}` 
                  : "https://via.placeholder.com/140"} 
                alt="profile Image"
              />
            </div>
            <div className="profile-actions">
              <button className="follow-btn">Follow</button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <h1 className="username">{`${user.data.firstName} ${user.data.lastName}`}</h1>
            <span className="handle">{`@${user.data.firstName}${user.data.lastName}`}</span>
            
            <p className="bio">{user.data.bio || "Web developer | Tech enthusiast | Coffee lover"}</p>

            <div className="user-details">
              {user.data.location && (
                <span className="location">
                  <i className="fas fa-map-marker-alt"></i> {user.data.location}
                </span>
              )}
              {user.data.website && (
                <span className="website">
                  <i className="fas fa-link"></i>
                  <a href={user.data.website} target="_blank" rel="noopener noreferrer">
                    {user.data.website}
                  </a>
                </span>
              )}
              {user.data.joinDate && (
                <span className="join-date">
                  <i className="fas fa-calendar-alt"></i> Joined {new Date(user.data.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>

            <div className="stats">
              <span className="following">
                <strong>{user.data.following?.length || 0}</strong> Following
              </span>
              <span className="followers">
                <strong>{user.data.followers?.length || 0}</strong> Followers
              </span>
              
            </div>
          </div>
        </React.Fragment>
      )}

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        {["Posts",  "Likes"].map((tab, index) => (
          <button 
            key={index} 
            className={`tab ${tab === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'Posts' ? <MyPosts /> : <LikedPosts/>}
      </div>
    </div>
  );
};

export default Profile;