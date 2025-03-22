import { useState, useEffect } from 'react';
import { useGetAllPostsQuery, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation, useBookmarkPostMutation } from '../../../Slices/authSlice'; // Add useBookmarkPostMutation
import './getpost.css';
import PostItem from './PostItem';

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
    discussionCategory: string;
  };
  createdAt: string;
  likes: string[];
  unlikes: string[];
  likesCount: number;
  unlikesCount: number;
}

function GetPosts() {
  const { data: posts, error, isLoading } = useGetAllPostsQuery(undefined);
  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  // Add bookmark mutation hook
  const [bookmarkPost] = useBookmarkPostMutation();

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [deleteSelfPost] = useDeleteSelfPostMutation();

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

  // Updated handleBookmarkPost to use the mutation
  const handleBookmarkPost = async (postId: string) => {
    try {
      await bookmarkPost(postId).unwrap();
      console.log('Bookmarked post:', postId);
    } catch (error) {
      console.error('Failed to bookmark post:', error);
      throw error; // Propagate error to PostItem for feedback
    }
  };

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error retrieving posts</p>}
      {posts &&
        posts.postData.map((post: Post) => (
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

export default GetPosts;