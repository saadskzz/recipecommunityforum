import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useGetAllPostsQuery, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation, useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
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
  };
  discussionCategory: {
    _id: string;
    discussionCategory: string;
  };
  createdAt: string;
  likes: string[];
  unlikes: string[];
  likesCount: number;
  unlikesCount: number;
}

interface GetPostsProps {
  categoryId?: string | null;
}

function GetPosts({ categoryId }: GetPostsProps) {
  const { data: posts, error, isLoading } = useGetAllPostsQuery(undefined);
  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Add bookmark mutation hooks
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnBookmarkPostMutation();

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteSelfPost] = useDeleteSelfPostMutation();

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

  // Filter posts based on category if categoryId is provided
  const filteredPosts = posts && posts.postData ? 
    (categoryId ? 
      posts.postData.filter(post => post.discussionCategory._id === categoryId) : 
      posts.postData) : 
    [];

  const noPostsAvailable = filteredPosts.length === 0;

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
          <p>No posts currently available</p> 
        </div>
      )}
                  
      {posts && noPostsAvailable && (
        <div className='error-content'>
          <div className='no-post-style'>
            <img src={noPost} alt="no post" />
          </div>
          <p>{categoryId ? "No posts in this category" : "No posts have been created yet"}</p>
        </div>
      )}
      
      {filteredPosts.map((post: Post) => (
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

export default GetPosts;