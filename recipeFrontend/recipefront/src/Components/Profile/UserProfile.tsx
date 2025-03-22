import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetCurrentUserQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUserByIdQuery // Add this new query
} from '../../Slices/authSlice';
import { useGetPostsByUserIdQuery } from '../../Slices/postSlice'; // Ensure this import
import './Profile.css'; // Reuse Profile.tsx styling
import initialProfile from '../../../initialprofile.jpg';
import initialCoverPic from '../../../initialbackgroundsmall.jpg';
import PostItem from '../PostPage/Post/PostItem'; // We'll create this component

const UserProfile = () => {
  const { userId } = useParams(); // Get userId from URL
  const [activeTab, setActiveTab] = useState('Posts');

  // Fetch the profile user's data
  const { data: user, isLoading: userLoading, isError: userError } = useGetUserByIdQuery(userId);

  // Fetch the profile user's posts
  const { data: posts, isLoading: postsLoading, isError: postsError } = useGetPostsByUserIdQuery(userId);

  // Fetch current user's data for follow/unfollow logic
  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;
  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const followingIds = followingData?.data.map(user => user._id) || [];

  // Follow/Unfollow mutations
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleFollow = async () => {
    try {
      await followUser(userId).unwrap();
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId).unwrap();
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  if (userLoading || postsLoading) return <div>Loading profile...</div>;
  if (userError || postsError) return <div>Error loading profile. Please try again later.</div>;

  const baseUrl = 'http://localhost:3000/';

  return (
    <div className="profile-container">
      <div className="banner">
        <img
          src={user?.data.coverPic ? `${baseUrl}${user.data.coverPic.replace(/\\/g, '/')}` : initialCoverPic}
          alt="Cover"
        />
      </div>
      <div className="profile-header">
        <div className="avatar-container">
          <img
            src={user?.data.profilePic ? `${baseUrl}${user.data.profilePic.replace(/\\/g, '/')}` : initialProfile}
            alt="Profile"
          />
        </div>
        <div className="profile-actions">
          {currentUserId && userId !== currentUserId && (
            followingIds.includes(userId) ? (
              <button className="follow-btn" onClick={handleUnfollow}>
                Unfollow
              </button>
            ) : (
              <button className="follow-btn" onClick={handleFollow}>
                Follow
              </button>
            )
          )}
        </div>
      </div>
      <div className="profile-info">
        <h1 className="username">{`${user?.data.firstName} ${user.data.lastName}`}</h1>
        <span className="handle">{`@${user?.data.firstName}${user?.data.lastName}`}</span>
        <p className="bio">{user?.data.Bio || 'No bio available'}</p>
        <div className="user-details">
          {user?.data.location && (
            <span className="location">
              <i className="fas fa-map-marker-alt"></i> {user.data.location}
            </span>
          )}
          {user?.data.website && (
            <span className="website">
              <i className="fas fa-link"></i>
              <a href={user.data.website} target="_blank" rel="noopener noreferrer">
                {user.data.website}
              </a>
            </span>
          )}
          {user?.data.joinDate && (
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
            <strong>{user?.data.following?.length || 0}</strong> Following
          </span>
          <span className="followers">
            <strong>{user?.data.followers?.length || 0}</strong> Followers
          </span>
        </div>
      </div>
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
      <div>
        {activeTab === 'Posts' ? (
          posts?.data.length > 0 ? (
            posts.data.map((post) => <PostItem key={post._id} post={post} />)
          ) : (
            <p>No posts available.</p>
          )
        ) : (
          <p>Liked posts are private and cannot be viewed.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;