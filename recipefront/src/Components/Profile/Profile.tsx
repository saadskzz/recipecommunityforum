import React, { useState, useRef, useEffect } from 'react';
import './Profile.css';
import '../Home/recipe.css';
import { useUploadProfilePicMutation, useUploadCoverPicMutation, useGetCurrentUserQuery, useUpdateBioMutation, useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../Slices/authSlice';
import { useGetPostsByUserIdQuery, useGetLikedPostsQuery } from '../../Slices/postSlice';
import initialProfile from '../../../initialprofile.jpg';
import initialCoverPic from '../../../initialbackgroundsmall.jpg';
import PostItem from '../PostPage/Post/PostItem';
import noPost from '../../../noPost.jpg';
import { Button, Tabs, Card, Row, Col, Typography, Divider, Avatar, Tooltip, message } from 'antd';
import { FiEdit2, FiUser, FiClock, FiHeart, FiBookmark, FiCamera } from 'react-icons/fi';
import { MdOutlineFoodBank } from 'react-icons/md';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  Bio?: string;
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
  bookmarkedPosts?: string[];
}

interface UserResponse {
  data: User;
}

// Define Recipe type based on the data structure
interface Recipe {
  _id: string;
  id?: string | number;
  title: string;
  content?: string;
  image?: string;
  duration?: string;
  likes?: any[];
  ingredients: [string];
  instructions?: string;
  recipeimg?: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  author?: {
    firstName: string;
    lastName: string;
  };
  createdAt?: string;
  discussionCategory?: {
    discussionCategory: string;
  };
  likesCount?: number;
  unlikesCount?: number;
  unlikes?: string[];
}

interface Following {
  _id: string;
  [key: string]: any;
}

const Profile = () => {
  const [uploadProfilePic] = useUploadProfilePicMutation();
  const [uploadCoverPic] = useUploadCoverPicMutation();
  const [updateBio] = useUpdateBioMutation();
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('recipes');
  const [bio, setBio] = useState<string>('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unBookmarkPost] = useUnBookmarkPostMutation();

  const { data: user, isLoading, isError } = useGetCurrentUserQuery(undefined);
  const { data: posts, isLoading: postsLoading, isError: postsError } = useGetPostsByUserIdQuery(user?.data._id);
  const { data: likedPosts, isLoading: likedPostsLoading, isError: likedPostsError } = useGetLikedPostsQuery(undefined);
  const baseUrl = 'http://localhost:3000/';

  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverPicInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.data) {
      setBio(user.data.Bio || '');
      setBookmarkedPosts(user.data.bookmarkedPosts || []);
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
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Profile Pic Upload Error:', error);
      message.error('Failed to update profile picture');
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
      message.success('Cover image updated successfully');
    } catch (error) {
      console.error('Cover Pic Upload Error:', error);
      message.error('Failed to update cover image');
    }
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBio(event.target.value);
  };

  const handleBioUpdate = async () => {
    try {
      if (bio !== user?.data.Bio) {
        await updateBio({ bio }).unwrap();
        message.success('Bio updated successfully');
      }
    } catch (error) {
      console.error('Bio Update Error:', error);
      message.error('Failed to update bio');
    } finally {
      setIsEditingBio(false);
      setEditProfile(false);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      // Toggle bookmark status
      if (bookmarkedPosts.includes(postId)) {
        await unBookmarkPost(postId).unwrap();
        setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
      } else {
        await bookmarkPost(postId).unwrap();
        setBookmarkedPosts([...bookmarkedPosts, postId]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      message.error('Failed to update bookmark status');
    }
  };

  const handleFollow = async (userId: string) => {
    // Placeholder for follow functionality
    console.log('Follow user:', userId);
  };

  const handleUnfollow = async (userId: string) => {
    // Placeholder for unfollow functionality
    console.log('Unfollow user:', userId);
  };

  const handleDeletePost = async (postId: string) => {
    // Placeholder for delete post functionality
    console.log('Delete post:', postId);
  };

  if (isLoading || postsLoading || likedPostsLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Treat posts as recipes for this redesign
  const userRecipes = posts?.data || [];
  const savedRecipes = likedPosts?.data || [];
  console.log(userRecipes);

  return (
    <div className="profile-container">
      {user && (
        <>
          <div className="profile-header-container">
            <div className="cover-image-container">
              <img
                className="cover-image"
                src={
                  user.data.coverPic
                    ? `${baseUrl}${user.data.coverPic.replace(/\\\\/g, '/')}`
                    : initialCoverPic
                }
                alt="Cover"
              />
              <Tooltip title="Change cover image">
                <Button 
                  className="edit-cover-btn" 
                  icon={<FiCamera />} 
                  onClick={() => coverPicInputRef.current?.click()}
                />
              </Tooltip>
            </div>
            
            <div className="profile-info-container">
              <div className="profile-avatar-container">
                <Avatar 
                  size={120} 
                  src={
                    user.data.profilePic
                      ? `${baseUrl}${user.data.profilePic.replace(/\\/g, '/')}`
                      : initialProfile
                  }
                  alt={`${user.data.firstName} ${user.data.lastName}`}
                />
                <Tooltip title="Change profile picture">
                  <Button 
                    className="edit-avatar-btn" 
                    icon={<FiCamera />} 
                    onClick={() => profilePicInputRef.current?.click()}
                  />
                </Tooltip>
              </div>
              
              <div className="profile-details">
                <Title level={2}>{`${user.data.firstName} ${user.data.lastName}`}</Title>
                <Text type="secondary">{`@${user.data.firstName}${user.data.lastName}`}</Text>
                
                {isEditingBio ? (
                  <div className="bio-edit-container">
                    <input
                      type="text"
                      className="bio-input"
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="Tell us about your cooking style and favorite cuisines..."
                      ref={bioInputRef}
                    />
                    <Button type="primary" onClick={handleBioUpdate}>Save</Button>
                  </div>
                ) : (
                  <Paragraph 
                    className="bio-text" 
                    ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                  >
                    {user.data.Bio || 'No bio yet. Tell everyone about your cooking style!'}
                    <Button 
                      type="link" 
                      className="edit-bio-btn" 
                      onClick={() => setIsEditingBio(true)}
                      icon={<FiEdit2 />}
                    >
                      Edit
                    </Button>
                  </Paragraph>
                )}
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <Text strong>{userRecipes.length}</Text>
                    <Text type="secondary">Recipes</Text>
                  </div>
                  <div className="stat-item">
                    <Text strong>{user.data.followers?.length || 0}</Text>
                    <Text type="secondary">Followers</Text>
                  </div>
                  <div className="stat-item">
                    <Text strong>{user.data.following?.length || 0}</Text>
                    <Text type="secondary">Following</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
          
          <Divider />
          
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="profile-tabs"
          >
            <TabPane tab="My Recipes" key="recipes">
              <div className="tab-content-container">
                {userRecipes.length > 0 ? (
                  <div className="recipe-list">
                    {userRecipes.map((recipe: Recipe) => (
                      <PostItem 
                        key={recipe._id}
                        post={recipe as any}
                        currentUser={user?.data}
                        followingIds={user?.data.following?.map((f: Following) => f._id) || []}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                        handleDeletePost={handleDeletePost}
                        handleBookmarkPost={handleBookmarkPost}
                        bookmarkedPosts={bookmarkedPosts}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-recipes-container">
                    <MdOutlineFoodBank size={60} color="#e67e22" />
                    <Title level={4}>You haven't created any recipes yet</Title>
                    <Button type="primary" icon={<FiEdit2 />}>Create Your First Recipe</Button>
                  </div>
                )}
              </div>
            </TabPane>
            
            <TabPane tab="Saved Recipes" key="saved">
              <div className="tab-content-container">
                {savedRecipes.length > 0 ? (
                  <div className="recipe-list">
                    {savedRecipes.map((recipe: Recipe) => (
                      <PostItem 
                        key={recipe._id}
                        post={recipe as any}
                        currentUser={user?.data}
                        followingIds={user?.data.following?.map((f: Following) => f._id) || []}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                        handleDeletePost={handleDeletePost}
                        handleBookmarkPost={handleBookmarkPost}
                        bookmarkedPosts={bookmarkedPosts}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-recipes-container">
                    <FiBookmark size={60} color="#e67e22" />
                    <Title level={4}>You haven't saved any recipes yet</Title>
                    <Button type="primary">Discover Recipes</Button>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Profile;