import React, { useState, useEffect } from 'react';
import { useShowBookmarkPostQuery } from '../../../Slices/authSlice'; // Correct import
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation,useUnfollowUserMutation } from '../../../Slices/authSlice';
import './getpost.css';
import PostItem from './PostItem';
import noPost from '../../../../noPost.jpg'

interface Post {
  _id: string;
  title: string;
  ingredients: string[];
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
  // Use the correct query from authSlice
  const { data: bookmarkedData, error, isLoading } = useShowBookmarkPostQuery();
  const bookmarkedPosts = bookmarkedData?.user?.bookmarkedPosts.map((post: Post) => ({
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

  const handleBookmarkPost = (postId: string) => {
    console.log('Add to bookmarks:', postId);
  };

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>There are no bookmarks you have made as of now</p>}
      {bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post: Post) => (
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
      <p>No post Bookmarked</p> </div>
      )}
    </div>
  );
}

export default BookmarkedPosts;