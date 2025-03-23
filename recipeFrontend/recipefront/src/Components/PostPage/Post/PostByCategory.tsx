// src/components/Post/postbycategory.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostsByCategoryQuery, useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetDiscussionByIdQuery } from '../../../Slices/discussionsApi'; // Adjust path if needed
import { useGetCurrentUserQuery, useGetFollowingQuery, useFollowUserMutation, useUnfollowUserMutation } from '../../../Slices/authSlice';
import { useGetPostCommentsQuery, useCreateCommentMutation } from '../../../Slices/commentSlice';
import PostForm from './PostForm';
import initialProfile from '../../../../initialprofile.jpg';
import './getpost.css'; // Reuse styles from getPosts.tsx
import { CommentOutlined } from '@ant-design/icons';

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

const UpvoteIcon = ({ className }) => (
  <svg className={className} width="25" height="20" viewBox="0 0 24 24">
    <path d="M12 4l-8 8h6v12h4V12h6l-8-8z" />
  </svg>
);

const DownvoteIcon = ({ className }) => (
  <svg className={className} width="25" height="20" viewBox="0 0 24 24">
    <path d="M12 20l8-8h-6V0h-4v12H4l8 8z" />
  </svg>
);

function PostByCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Fetch category details
  const { data: category, error: categoryError, isLoading: categoryLoading } = useGetDiscussionByIdQuery(categoryId);
  
  // Fetch posts for the category
  const { data: postsData, error: postsError, isLoading: postsLoading } = useGetPostsByCategoryQuery(categoryId);
  const posts = postsData?.data; // Backend returns { status: "success", data: posts }

  // User and interaction hooks
  const [upvote] = useLikePostMutation();
  const [downvote] = useUnlikePostMutation();
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

  // Interaction handlers
  const handleUpvote = async (id: string) => {
    await upvote(id);
  };

  const handleDownvote = async (id: string) => {
    await downvote(id);
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

  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState<string | null>(null);

  const { data: comments, isLoading: commentsLoading, isError: commentsError } = useGetPostCommentsQuery(isExpanded, {
    skip: !isExpanded,
  });

  const [createComment] = useCreateCommentMutation();

  const handleCreateComment = async (postId: string) => {
    const content = newComment.trim();
    if (content) {
      try {
        await createComment({ postId, content }).unwrap();
        setNewComment('');
      } catch (error) {
        console.error('Failed to create comment:', error);
      }
    }
  };

  // Loading and error states
  if (categoryLoading || postsLoading) return <p>Loading...</p>;
  if (categoryError) return <p>Error fetching category: {(categoryError as any).message}</p>;
  if (postsError) return <p>Error fetching posts: {(postsError as any).message}</p>;

  return (
    <div>
      <h2>Posts in {category?.discussionCategory}</h2>
      <div className="post-style">
        {posts && posts.length > 0 ? (
          posts.map((post: Post) => (
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
                      <p className="follow" onClick={() => handleUnfollow(post.user._id)} style={{ color: '#568000' }}>
                        Followed
                      </p>
                    ) : (
                      <p className="follow" onClick={() => handleFollow(post.user._id)} style={{ color: 'white' }}>
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
                  <p onClick={() => handleUpvote(post._id)}>
                    <UpvoteIcon className={post.likes.includes(currentUserId) ? 'voted upvoted' : ''} />
                  </p>
                  <p>{post.likesCount}</p>
                </div>
                <div style={{ padding: 10 }} className="vote">
                  <p onClick={() => handleDownvote(post._id)}>
                    <DownvoteIcon className={post.unlikes.includes(currentUserId) ? 'voted downvoted' : ''} />
                  </p>
                  <p>{post.unlikesCount}</p>
                </div>
              </div>
              <div className="comment-icon" onClick={() => setIsExpanded(isExpanded === post._id ? null : post._id)}>
                <p>
                  <CommentOutlined /> {comments ? comments.commentData.length : 0}
                </p>
              </div>
              {isExpanded === post._id && (
                <div className="comments-section">
                  {commentsLoading ? (
                    <p>Loading comments...</p>
                  ) : commentsError ? (
                    <p>Error loading comments</p>
                  ) : (
                    <>
                      <div className="add-comment">
                        <img
                          src={currentUser?.profilePic ? `http://localhost:3000/${currentUser.profilePic.replace(/\\/g, '/')}` : initialProfile}
                          alt="Profile"
                          className="comment-img"
                        />
                        <PostForm
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                        />
                        <button onClick={() => handleCreateComment(post._id)} className="submit-comment-btn">
                          add reply
                        </button>
                      </div>
                      {comments && comments.commentData.length > 0 ? (
                        comments.commentData.map((comment) => (
                          <div key={comment._id} className="comment">
                            <div style={{ display: 'flex' }}>
                              <img
                                src={comment.author.profilePic ? `http://localhost:3000/${comment.author.profilePic.replace(/\\/g, '/')}` : initialProfile}
                                alt="Profile"
                                className="comment-img"
                              />
                              <div className="comment-content">
                                <p style={{ alignItems: 'center', display: 'flex' }} className="comment-name">
                                  {comment.author.firstName} {comment.author.lastName}
                                </p>
                                <p style={{ color: '#3D4651' }}>{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No comments yet</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default PostByCategory;