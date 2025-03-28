import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostsByCategoryQuery, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useBookmarkPostMutation } from '../../../Slices/authSlice';
import { useGetDiscussionByIdQuery } from '../../../Slices/discussionsApi';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import PostItem from './PostItem';
import './getpost.css';

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

function PostByCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: category, error: categoryError, isLoading: categoryLoading } = useGetDiscussionByIdQuery(categoryId);
  const { data: postsData, error: postsError, isLoading: postsLoading } = useGetPostsByCategoryQuery(categoryId);
  const posts = postsData?.data;

  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteSelfPost] = useDeleteSelfPostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

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
    try {
      await deleteSelfPost(postId).unwrap();
      console.log('Deleted post:', postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      await bookmarkPost(postId).unwrap();
      console.log('Bookmarked post:', postId);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
    }
  };

  if (categoryLoading || postsLoading) return <p>Loading...</p>;
  if (categoryError) return <p>Error fetching category: {(categoryError as any).message}</p>;
  if (postsError) return <p>Error fetching posts: {(postsError as any).message}</p>;

  return (
    <div>
      <h2>Posts in {category?.discussionCategory}</h2>
      <div className="post-style">
        {posts && posts.length > 0 ? (
          posts.map((post: Post) => (
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
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default PostByCategory;