import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostsByCategoryQuery, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
import { useGetDiscussionByIdQuery } from '../../../Slices/discussionsApi';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import { message } from 'antd';
import PostItem from './PostItem';
import './getpost.css';
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

function PostByCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: category, error: categoryError, isLoading: categoryLoading } = useGetDiscussionByIdQuery(categoryId);
  const { data: postsData, error: postsError, isLoading: postsLoading } = useGetPostsByCategoryQuery(categoryId);
  const posts = postsData?.data;

  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteSelfPost] = useDeleteSelfPostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnBookmarkPostMutation();

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const handleFollow = async (userIdToFollow: string) => {
    const previousFollowingIds = [...followingIds];
    setFollowingIds((prev) => [...prev, userIdToFollow]);
  
    try {
      await followUser(userIdToFollow).unwrap();
    } catch (error) {
      setFollowingIds(previousFollowingIds);
      console.error('Failed to follow user:', error);
      message.error('Failed to follow user. Please try again.');
    }
  };
  
  const handleUnfollow = async (userIdToUnfollow: string) => {
    const previousFollowingIds = [...followingIds];
    setFollowingIds((prev) => prev.filter((id) => id !== userIdToUnfollow));
  
    try {
      await unfollowUser(userIdToUnfollow).unwrap();
    } catch (error) {
      setFollowingIds(previousFollowingIds);
      console.error('Failed to unfollow user:', error);
      message.error('Failed to unfollow user. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteSelfPost(postId).unwrap();
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

  if (categoryLoading || postsLoading) return <p>Loading...</p>;
  if (categoryError) return <p>Error fetching category: {(categoryError as any).message}</p>;
 

  return (
    <div>
      <h1>Posts in {category?.discussionCategory}</h1>
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
          <div className='error-content' > <div className='no-post-style'><img src={noPost} alt="no post" /></div>
        <p>No posts Currently by followed People</p> </div>
        )}
      </div>
    </div>
  );
}

export default PostByCategory;