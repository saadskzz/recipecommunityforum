import React, { useState, useEffect } from 'react';
import { useGetBookmarkedPostsQuery, useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import './getpost.css';
import upvoteIcon from '../../../../upvotesvg.svg';
import downvoteIcon from '../../../../downvotesvg.svg';

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
  const { data: bookmarkedPosts, error, isLoading } = useGetBookmarkedPostsQuery(undefined);
  const { data: currentUser } = useGetCurrentUserQuery(undefined);
  const currentUserId = currentUser?.data?._id;

  const { data: followingData } = useGetFollowingQuery(currentUserId, { skip: !currentUserId });
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    if (followingData) {
      setFollowingIds(followingData.data.map((user: { _id: string }) => user._id));
    }
  }, [followingData]);

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const handleLike = async (id: string) => {
    await likePost(id);
  };

  const handleUnlike = async (id: string) => {
    await unlikePost(id);
  };

  const handleFollow = async (userIdToFollow: string) => {
    if (!userIdToFollow) {
      console.error('Invalid userIdToFollow:', userIdToFollow);
      return;
    }
    try {
      await followUser(userIdToFollow).unwrap();
      setFollowingIds((prev) => [...prev, userIdToFollow]);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow: string) => {
    if (!userIdToUnfollow) {
      console.error('Invalid userIdToUnfollow:', userIdToUnfollow);
      return;
    }
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

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>Error getting bookmarked posts</p>}
      {bookmarkedPosts && (
        <>
          {console.log('Bookmarked Posts:', bookmarkedPosts.data.bookmarkedPosts)}
          {Array.isArray(bookmarkedPosts.data.bookmarkedPosts) && bookmarkedPosts.data.bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.data.bookmarkedPosts.map((post: Post) => (
              <div key={post._id} className="post-style-map">
                <div className="created-by">
                  <div className="pfp-img"></div>
                  <div className="pfp-detail">
                    <div>
                      <p className="userName-style">{post.user.firstName} {post.user.lastName}</p>
                      <p className="created-at">{getTimeAgo(post.createdAt)}</p>
                    </div>
                    {currentUserId && post.user._id !== currentUserId && (
                      followingIds.includes(post.user._id) ? (
                        <p
                          className="follow"
                          onClick={() => handleUnfollow(post.user._id)}
                          style={{ color: '#568000' }}
                        >
                          Followed
                        </p>
                      ) : (
                        <p
                          className="follow"
                          onClick={() => handleFollow(post.user._id)}
                          style={{ color: 'white' }}
                        >
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
                  <div style={{ padding: 10 }} className="vote">
                    <p onClick={() => handleLike(post._id)}>
                      <img
                        src={upvoteIcon}
                        alt="Upvote"
                        className={post.likes.includes(currentUserId) ? 'voted' : ''}
                      />
                    </p>
                    <p>{post.likesCount}</p>
                  </div>
                  <div style={{ padding: 10 }} className="vote">
                    <p onClick={() => handleUnlike(post._id)}>
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
            ))
          ) : (
            <p>No bookmarked posts available</p>
          )}
        </>
      )}
    </div>
  );
}

export default BookmarkedPosts;