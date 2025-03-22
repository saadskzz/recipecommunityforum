import React, { useState, useEffect } from 'react';
import { useGetFollowedPostsQuery, useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import './getpost.css';
import PostItem from './PostItem'; // Adjust the path as needed

// Updated Post interface to include likes, unlikes, and profilePic
interface Post {
  _id: string; // Changed to string for consistency
  title: string;
  ingredients: [string];
  instructions: string;
  recipeimg: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string; // Optional field for user profile picture
  };
  discussionCategory: {
    discussionCategory: string;
  };
  createdAt: string;
  likes: string[]; // Array of user IDs who liked the post
  unlikes: string[]; // Array of user IDs who unliked the post
  likesCount: number;
  unlikesCount: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic?: string; // Optional field for current user's profile picture
}

interface UserResponse {
  data: User;
}

function FollowedPost() {
  const [downvote] = useUnlikePostMutation();
  const [upvote] = useLikePostMutation();

  // Updated handler functions to use string IDs
  const handleUpvote = async (id: string) => {
    await upvote({ id });
  };

  const handleDownvote = async (id: string) => {
    await downvote({ id });
  };

  const { data: posts, error, isLoading } = useGetFollowedPostsQuery(undefined);
  console.log('followed', posts);

  const { data: currentUser } = useGetCurrentUserQuery(undefined);
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

  const handleFollow = async (userIdToFollow: string) => {
    try {
      await followUser(userIdToFollow).unwrap();
      setFollowingIds((prev) => [...prev, userIdToFollow]);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow: string) => {
    try {
      await unfollowUser(userIdToUnfollow).unwrap();
      setFollowingIds((prev) => prev.filter((id) => id !== userIdToUnfollow));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  // Placeholder functions for delete and bookmark (to be implemented as needed)
  const handleDeletePost = async (postId: string) => {
    console.log('Delete post:', postId);
    // Add delete logic here if required (e.g., useDeletePostMutation)
  };

  const handleBookmarkPost = (postId: string) => {
    console.log('Bookmark post:', postId);
    // Add bookmark logic here if required
  };

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>No posts Currently by followed People</p>}
      {posts && posts.data?.length === 0 && <p>No posts from followed users yet.</p>}
      {posts && posts.data?.map((post: Post) => (
        <PostItem
          key={post._id}
          post={post}
          currentUser={currentUser?.data} // Pass current user for profile pic and ownership checks
          followingIds={followingIds}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          handleDeletePost={handleDeletePost}
          handleBookmarkPost={handleBookmarkPost}
        />
      ))}
    </div>
  );
}

export default FollowedPost;