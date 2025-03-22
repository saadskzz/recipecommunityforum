import React, { useState, useEffect } from 'react';
import { useGetLikedPostsQuery, useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import { useGetPostCommentsQuery, useCreateCommentMutation } from '../../../Slices/commentSlice';
import './getpost.css';
import PostItem from './PostItem'; // Adjust the path as needed

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

function LikedPosts() {
  const { data: posts, error, isLoading } = useGetLikedPostsQuery(undefined);
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

  const handleDeletePost = async (postId: string) => {
    console.log('Delete post:', postId);
  };

  const handleBookmarkPost = (postId: string) => {
    console.log('Add to bookmarks:', postId);
  };

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>You have not liked any post yet</p>}
      {posts && Array.isArray(posts.data) && posts.data.map((post: Post) => (
        <PostItem
          key={post._id}
          post={post}
          currentUser={currentUser?.data}
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

export default LikedPosts;