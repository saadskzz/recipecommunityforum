import React, { useState, useEffect } from 'react';
  import { useGetFollowedPostsQuery, useLikePostMutation, useUnlikePostMutation, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation, useBookmarkPostMutation } from '../../../Slices/authSlice';
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
  const [bookmarkPost] = useBookmarkPostMutation();
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
      await deletePost(postId).unwrap();
      console.log('Post deleted successfully');
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

  return (
    <div>  <h1>Followed Posts</h1>
    <div className="post-style">
     
      {isLoading && <p>Loading...</p>}
    
      {error && <div className='error-content' > <div className='no-post-style'><img src={noPost} alt="no post" /></div>
        <p>No posts Currently by followed People</p> </div>}
        
      {posts && posts.data?.length === 0 && <p>No posts from followed users yet.</p>}
      
      {posts && posts.data?.map((post: Post) => (
        <div> 
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
        </div>
      ))}
      
    </div>
    </div>
  );
}

export default FollowedPost;