import React, { useState, useRef, useEffect } from 'react';
import './Profile.css';
import { useUploadProfilePicMutation, useUploadCoverPicMutation, useGetCurrentUserQuery, useUpdateBioMutation } from '../../Slices/authSlice';
import MyPosts from '../PostPage/Post/myPosts';
import LikedPosts from '../PostPage/Post/LikedPost';
import initialProfile from '../../../initialprofile.jpg';
import initialCoverPic from '../../../initialbackgroundsmall.jpg';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  Bio?: string; // Changed from 'bio' to 'Bio' to match backend schema
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
  const [updateBio] = useUpdateBioMutation();
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('Posts');
  const [bio, setBio] = useState<string>('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  const { data: user, isLoading, isError } = useGetCurrentUserQuery(undefined);
  const baseUrl = 'http://localhost:3000/';

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverPicInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.data) {
      setBio(user.data.Bio || ''); // Use 'Bio' to match backend field
    }
  }, [user]);

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setProfilePic(file);
      handleProfilePicUpload(file);
    }
  };

  const handleProfilePicUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      await uploadProfilePic(formData).unwrap();
      setProfilePic(null);
    } catch (error) {
      console.error('Profile Pic Upload Error:', error);
    }
  };

  const handleCoverPicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setCoverPic(file);
      handleCoverPicUpload(file);
    }
  };

  const handleCoverPicUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('coverPic', file);
      await uploadCoverPic(formData).unwrap();
      setCoverPic(null);
    } catch (error) {
      console.error('Cover Pic Upload Error:', error);
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBio(event.target.value);
  };

  const handleBioUpdate = async () => {
    try {
      if (bio !== user?.data.Bio) { // Use 'Bio' to match backend field
        await updateBio({ bio }).unwrap(); // Send bio as an object
      }
    } catch (error) {
      console.error('Bio Update Error:', error);
    } finally {
      setIsEditingBio(false); // Always close input, even on error or no change
      setEditProfile(false);  // Close edit mode
    }
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (isError) return <div>Error loading profile. Please try again later.</div>;

  return (
    <div className="profile-container">
      {user && (
        <React.Fragment key={user.data._id}>
          <div>
            <p className="edit" onClick={() => setEditProfile(!editProfile)}>
              edit
            </p>
            {editProfile && (
              <div className="edit-options">
                <span onClick={() => profilePicInputRef.current?.click()}>
                  Edit Profile Picture
                </span>
                <span onClick={() => coverPicInputRef.current?.click()}>
                  Edit Cover Picture
                </span>
                <span onClick={() => setIsEditingBio(true)}>
                  Edit Bio
                </span>
              </div>
            )}
            <input
              type="file"
              ref={profilePicInputRef}
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
              accept="image/*"
            />
            <input
              type="file"
              ref={coverPicInputRef}
              style={{ display: 'none' }}
              onChange={handleCoverPicChange}
              accept="image/*"
            />
          </div>
          <div className="banner">
            <img
              src={
                user.data.coverPic
                  ? `${baseUrl}${user.data.coverPic.replace(/\\\\/g, '/')}`
                  : initialCoverPic
              }
              alt="Cover"
            />
          </div>
          <div className="profile-header">
            <div className="avatar-container">
              <img
                src={
                  user.data.profilePic
                    ? `${baseUrl}${user.data.profilePic.replace(/\\/g, '/')}`
                    : initialProfile
                }
                alt="Profile"
              />
            </div>
            <div className="profile-actions">
              <button className="follow-btn">Follow</button>
            </div>
          </div>
          <div className="profile-info">
            <h1 className="username">{`${user.data.firstName} ${user.data.lastName}`}</h1>
            <span className="handle">{`@${user.data.firstName}${user.data.lastName}`}</span>
            {isEditingBio ? (
              <div className="bio-edit-container">
                <input
                  type="text"
                  className="bio-input"
                  value={bio}
                  onChange={handleBioChange}
                  placeholder="Enter your bio"
                  ref={bioInputRef}
                />
                <button 
                  className="bio-save-btn"
                  onClick={handleBioUpdate}
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="bio">{user.data.Bio || 'Add a bio'}</p> // Use 'Bio' to match backend field
            )}
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
                  <i className="fas fa-calendar-alt"></i> Joined{' '}
                  {new Date(user.data.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
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
      <div className="profile-tabs">
        {['Posts', 'Likes'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{activeTab === 'Posts' ? <MyPosts /> : <LikedPosts />}</div>
    </div>
  );
};

export default Profile;