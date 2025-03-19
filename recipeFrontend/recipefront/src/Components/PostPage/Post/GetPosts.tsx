import  { useState, useEffect } from 'react';
import { useGetAllPostsQuery, useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import './getpost.css';
import upvoteIcon from '../../../../upvotesvg.svg';
import downvoteIcon from '../../../../downvotesvg.svg';
import { SmallDashOutlined } from '@ant-design/icons';

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
  const [upvote] = useLikePostMutation();
  const [downvote] = useUnlikePostMutation();
  const { data: posts, error, isLoading } = useGetAllPostsQuery(undefined);
  console.log('get all posts',posts)
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

  const handleUpvote = async (id: string) => {
    await upvote( id );
  };

  const handleDownvote = async (id: string) => {
    await downvote( id );
  };

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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hours ago`;
  };

  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [showBookmark, setShowBookmark] = useState<string | null>(null);

  const handleDeletePost = async (postId: string) => {
    // Implement delete post logic here
    console.log('Delete post:', postId);
  };

  const handleBookmarkPost = (postId: string) => {
    setShowBookmark(postId);
    console.log('Add to bookmarks:', postId);
  };

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error retrieving posts</p>}
      {posts && posts.postData.map((post: Post) => (
        <div key={post._id} className="post-style-map">
          
          <SmallDashOutlined style={{justifyContent:'end'}} onClick={() => { setShowDelete(post._id); handleBookmarkPost(post._id); }} />
        <div className='post-attribute'>
          {showDelete === post._id && currentUserId === post.user._id && (
            <p className="delete-post" onClick={() => handleDeletePost(post._id)} style={{color:'red'}}>
              Delete Post
            </p>
          )}
          {showBookmark === post._id && (
            <p className="bookmark-post" style={{color:'blue'}}>
              Add to bookmarks
            </p>
            
          )}
          </div>
          <div className="created-by">
            <div className="pfp-img"></div>
            <div className="pfp-detail">
              <div>
                <p className="userName-style">{post.user.firstName} {post.user.lastName}</p>
                <p className="created-at">{getTimeAgo(post.createdAt)}</p>
              </div>
              
              {currentUserId && post.user._id !== currentUserId && (
                followingIds.includes(post.user._id) ? (
                  <p className="follow" onClick={() => handleUnfollow(post.user._id)} style={{color:'#568000'}}>
                    Followed
                  </p>
                ) : (
                  <p className="follow" onClick={() => handleFollow(post.user._id)} style={{color:'white' }}>
                    + Follow
                  </p>
                )
              )}
            </div>
          </div>
          <div className="category-type">
            <p>#{post.discussionCategory.discussionCategory}</p>
          </div>
          <p className="post-title">{post.title}</p>
          <p className="post-description">{post.instructions}</p>
          <div className="postImg" style={{ height: post.recipeimg ? '300px' : 'auto' }}>
            {post.recipeimg && (
              <img src={`http://localhost:3000/${post.recipeimg.replace(/\\/g, "/")}`} alt="Recipe Image" />
            )}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ padding: 10 }} className='vote'>
              <p onClick={() => handleUpvote(post._id)} >
                <img
                  src={upvoteIcon}
                  alt="Upvote"
                  className={post.likes.includes(currentUserId) ? 'voted' : ''}
                />
              </p>
              <p>{post.likesCount}</p>
            </div>
            <div style={{ padding: 10 }} className='vote'>
              <p onClick={() => handleDownvote(post._id)}>
                <img
                  src={downvoteIcon}
                  alt="Downvote"
                  className={post.unlikes.includes(currentUserId) ? 'voted' : ''}
                />
              </p>
              <p>{post.unlikesCount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GetPosts;