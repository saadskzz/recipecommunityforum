import React, { useState, useRef, useEffect } from 'react';
import './Profile.css';
import '../Home/recipe.css';
import { useUploadProfilePicMutation, useUploadCoverPicMutation, useGetCurrentUserQuery, useUpdateBioMutation } from '../../Slices/authSlice';
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
  author?: {
    firstName: string;
    lastName: string;
  };
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
              {userRecipes.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {userRecipes.map((recipe: Recipe) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={recipe._id}>
                      <Card 
                        hoverable
                        cover={
                          <div className="recipe-image-container">
                            <img 
                              alt={recipe.title} 
                              src={recipe.image || noPost} 
                              className="recipe-image"
                            />
                          </div>
                        }
                        className="recipe-card"
                      >
                        <Title level={4} className="recipe-title">{recipe.title}</Title>
                        <div className="recipe-meta">
                          <span><FiClock /> {recipe.duration || '30 mins'}</span>
                          <span><FiHeart /> {recipe.likes?.length || 0}</span>
                        </div>
                        <Text className="recipe-description">{recipe.content?.substring(0, 60) || 'A delicious recipe...'}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="empty-recipes-container">
                  <MdOutlineFoodBank size={60} color="#e67e22" />
                  <Title level={4}>You haven't created any recipes yet</Title>
                  <Button type="primary" icon={<FiEdit2 />}>Create Your First Recipe</Button>
                </div>
              )}
            </TabPane>
            
            <TabPane tab="Saved Recipes" key="saved">
              {savedRecipes.length > 0 ? (
                <Row gutter={[24, 24]}>
                  {savedRecipes.map((recipe: Recipe) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={recipe._id}>
                      <Card 
                        hoverable
                        cover={
                          <div className="recipe-image-container">
                            <img 
                              alt={recipe.title} 
                              src={recipe.image || noPost} 
                              className="recipe-image"
                            />
                          </div>
                        }
                        className="recipe-card"
                      >
                        <Title level={4} className="recipe-title">{recipe.title}</Title>
                        <div className="recipe-meta">
                          <span><FiUser /> {recipe.author?.firstName || 'Unknown'}</span>
                          <span><FiHeart /> {recipe.likes?.length || 0}</span>
                        </div>
                        <Text className="recipe-description">{recipe.content?.substring(0, 60) || 'A delicious recipe...'}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="empty-recipes-container">
                  <FiBookmark size={60} color="#e67e22" />
                  <Title level={4}>You haven't saved any recipes yet</Title>
                  <Button type="primary">Discover Recipes</Button>
                </div>
              )}
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Profile;