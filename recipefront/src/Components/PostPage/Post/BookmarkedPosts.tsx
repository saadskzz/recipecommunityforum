import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useShowBookmarkPostQuery, useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
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

function BookmarkedPosts() {
  const { data: bookmarkedData, error, isLoading, refetch } = useShowBookmarkPostQuery(undefined);
  const bookmarkedPosts = bookmarkedData?.user?.bookmarkedPosts.map((post: any) => ({
    ...post,
    user: {
      ...post.user,
      profilePic: post.user.profilePic || '',
      firstName: post.user.firstName || '',
      lastName: post.user.lastName || ''
    },
    discussionCategory: {
      discussionCategory: post.discussionCategory.discussionCategory || ''
    }
  })) || [];

  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;
  // Get bookmarked posts IDs for easy lookup
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<string[]>([]);

  useEffect(() => {
    if (bookmarkedData?.user?.bookmarkedPosts) {
      // Extract post IDs from bookmarked posts
      const postIds = bookmarkedData.user.bookmarkedPosts.map((post: any) => post._id);
      setBookmarkedPostIds(postIds);
    }
  }, [bookmarkedData]);

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnBookmarkPostMutation();

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

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
    console.log('Delete post:', postId);
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      // In BookmarkedPosts component, all posts are already bookmarked,
      // so we should only handle unbookmarking
      await unbookmarkPost(postId).unwrap();
      message.success('Recipe removed from favorites');
      
      // Optimistically update the bookmarked posts list
      setBookmarkedPostIds(prevIds => prevIds.filter(id => id !== postId));
      
      // Refresh the bookmarked posts list
      refetch();
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
          <p>There are no bookmarks you have made as of now</p>
        </div>
      )}
      
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post: any) => (
          <div key={post._id}>
            <PostItem
              post={post}
              currentUser={{
                ...currentUser?.data,
                bookmarkedPosts: bookmarkedPostIds
              }}
              followingIds={followingIds}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
              handleDeletePost={handleDeletePost}
              handleBookmarkPost={handleBookmarkPost}
            />
          </div>
        ))
      ) : (
        <div className='error-content'> 
          <div className='no-post-style'>
            <img src={noPost} alt="no post" />
          </div>
          <p>No post Bookmarked</p> 
        </div>
      )}
    </div>
  );
}

export default BookmarkedPosts;