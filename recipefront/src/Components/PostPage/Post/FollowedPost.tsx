import React, { useState, useEffect } from 'react';
  import { useGetFollowedPostsQuery, useLikePostMutation, useUnlikePostMutation, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation, useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
import { message } from 'antd';
import './getpost.css';
import PostItem from './PostItem'; 
import noPost from '../../../../noPost.jpg'

interface Post {
  _id: string; 
  title: string;
  ingredients: [string];
  instructions: string;
  recipeimg: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string; 
  };
  discussionCategory: {
    discussionCategory: string;
  };
  createdAt: string;
  likes: string[]; 
  unlikes: string[]; 
  likesCount: number;
  unlikesCount: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string; 
}

interface UserResponse {
  data: User;
}

function FollowedPost() {
  const [downvote] = useUnlikePostMutation();
  const [upvote] = useLikePostMutation();
  const [deletePost] = useDeleteSelfPostMutation();
  
  const handleUpvote = async (id: string) => {
    await upvote({ id });
  };

  const handleDownvote = async (id: string) => {
    await downvote({ id });
  };

  const { data: posts, error, isLoading } = useGetFollowedPostsQuery(undefined);
  console.log('followed', posts);

  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnBookmarkPostMutation();
  
  const handleFollow = async (userIdToFollow: string) => {
    try {
      await followUser(userIdToFollow).unwrap();
      setFollowingIds((prev) => [...prev, userIdToFollow]);
    } catch (error) {
      console.error('Failed to follow user:', error);
      message.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userIdToUnfollow: string) => {
    try {
      await unfollowUser(userIdToUnfollow).unwrap();
      setFollowingIds((prev) => prev.filter((id) => id !== userIdToUnfollow));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      message.error('Failed to unfollow user');
    }
  };


  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId).unwrap();
      message.success('Post deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
      message.error('Failed to delete post');
    }
  
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      const isBookmarked = currentUser?.data?.bookmarkedPosts?.includes(postId);
      
      if (isBookmarked) {
        await unbookmarkPost(postId).unwrap();
        message.success('Recipe removed from favorites');
      } else {
        await bookmarkPost(postId).unwrap();
        message.success('Recipe added to favorites');
      }
      
      // Refresh currentUser to get updated bookmarked posts
      refetchCurrentUser();
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      message.error('Failed to update favorites');
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    
      {error && (
        <div className='error-content'> 
          <div className='no-post-style'>
            <img src={noPost} alt="no post" />
          </div>
          <p>No posts from people you follow</p> 
        </div>
      )}
        
      {posts && posts.data?.length === 0 && (
        <div className='error-content'> 
          <div className='no-post-style'>
            <img src={noPost} alt="no post" />
          </div>
          <p>No posts from people you follow yet</p>
        </div>
      )}
      
      {posts && posts.data?.map((post: Post) => (
        <div key={post._id}> 
          <PostItem
            post={post}
            currentUser={currentUser?.data}
            followingIds={followingIds}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            handleDeletePost={handleDeletePost}
            handleBookmarkPost={handleBookmarkPost}
          />
        </div>
      ))}
    </div>
  );
}

export default FollowedPost;