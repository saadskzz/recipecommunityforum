  import { useState, useEffect } from 'react';
  import { message } from 'antd';
  import { useGetAllPostsQuery, useDeleteSelfPostMutation } from '../../../Slices/postSlice';
  import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation, useBookmarkPostMutation } from '../../../Slices/authSlice'; // Add useBookmarkPostMutation
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
        throw error; 
      }
    };

    return (<div>
        <h1>All posts</h1>
      <div className="post-style">
       
        {isLoading && <p>Loading...</p>}
        {error && <div className='error-content' > <div className='no-post-style'><img src={noPost} alt="no post" /></div>
        <p>No posts Currently </p> </div>}
                    
        {posts &&
          posts.postData.map((post: Post) => (
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

  export default GetPosts;