import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetPostCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from '../../../Slices/commentSlice';
import { useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
import './getpost.css';
import CommentsIcon from '../../../../message.svg'
import upvoteIcon from '../../../../upvotesvg.svg';
import downvoteIcon from '../../../../downvotesvg.svg';
import { BookOutlined, CommentOutlined, DeleteOutlined, SmallDashOutlined } from '@ant-design/icons';
import PostForm from './PostForm';
import initialProfile from '../../../../initialprofile.jpg';
import { message, Modal, Input } from 'antd';

interface PostItemProps {
  post: Post;
  currentUser: User | undefined;
  followingIds: string[];
  handleFollow: (userId: string) => Promise<void>;
  handleUnfollow: (userId: string) => Promise<void>;
  handleDeletePost: (postId: string) => Promise<void>;
  handleBookmarkPost: (postId: string) => void;
  bookmarkedPosts?: string[]; 
}

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
  bookmarkedPosts?: string[];
}

interface IconProps {
  className?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
  createdAt: string;
}

// Create a simplified comment form component that wraps PostForm
const CommentForm = ({ value, onChange, placeholder }: { value: string; onChange: (e: any) => void; placeholder: string }) => {
  return (
    <div className='custom-inp'>
      <Input 
        size="large" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className='ant-inp' 
      />
    </div>
  );
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  currentUser,
  followingIds,
  handleFollow,
  handleUnfollow,
  handleDeletePost,
  handleBookmarkPost,
}) => {
  console.log(post,"post")
  const [upvote] = useLikePostMutation();
  const [downvote] = useUnlikePostMutation();
  const [bookmarkPostMutation] = useBookmarkPostMutation();
  const [unbookmarkPostMutation] = useUnBookmarkPostMutation();
  const [showDelete, setShowDelete] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
const [optimisticBookmarked, setOptimisticBookmarked] = useState(
    currentUser?.bookmarkedPosts?.includes(post._id) || false
  );
  const { data: comments, isLoading: commentsLoading, isError: commentsError } = useGetPostCommentsQuery(post._id);
  const [deleteComment] = useDeleteCommentMutation();

const isBookmarked = currentUser?.bookmarkedPosts?.includes(post._id);
  const [createComment] = useCreateCommentMutation();

  const baseUrl = 'http://localhost:3000/';

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

  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [unlikesCount, setUnlikesCount] = useState(post.unlikesCount);
  const [hasLiked, setHasLiked] = useState(post.likes.includes(currentUser?._id || ''));
  const [hasUnliked, setHasUnliked] = useState(post.unlikes.includes(currentUser?._id || ''));

  const handleUpvote = async () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
      if (hasUnliked) {
        setUnlikesCount((prev) => prev - 1);
        setHasUnliked(false);
      }
    }
    try {
      await upvote(post._id).unwrap();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const handleDownvote = async () => {
    if (hasUnliked) {
      setUnlikesCount((prev) => prev - 1);
      setHasUnliked(false);
    } else {
      setUnlikesCount((prev) => prev + 1);
      setHasUnliked(true);
      if (hasLiked) {
        setLikesCount((prev) => prev - 1);
        setHasLiked(false);
      }
    }
    try {
      await downvote(post._id).unwrap();
    } catch (error) {
      console.error('Failed to downvote:', error);
    }
  };

  const handleCreateComment = async () => {
    const content = newComment.trim();
    if (content) {
      try {
        await createComment({ postId: post._id, content }).unwrap();
        setNewComment('');
      } catch (error) {
        console.error('Failed to create comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      message.success('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      message.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    console.log('Delete clicked for post:', post._id);
    try {
      await handleDeletePost(post._id);
      console.log('Post deleted successfully:', post._id);
      message.success('Post is deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleBookmark = async () => {
    const isCurrentlyBookmarked = currentUser?.bookmarkedPosts?.includes(post._id) || optimisticBookmarked;
    
    // Toggle optimistic UI update
    setOptimisticBookmarked(!isCurrentlyBookmarked);
    
    try {
      if (isCurrentlyBookmarked) {
        // If already bookmarked, then unbookmark
        await unbookmarkPostMutation(post._id).unwrap();
        message.success('Removed from bookmarks');
      } else {
        // If not bookmarked, then bookmark
        await bookmarkPostMutation(post._id).unwrap();
        message.success('Added to bookmarks');
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticBookmarked(isCurrentlyBookmarked);
      console.error('Failed to update bookmark status:', error);
      message.error('Failed to update bookmark status');
    }
  };

  const showModal = () => {
    setShowDelete(true);
    setShowBookmark(true);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const UpvoteIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} width="25" height="20" viewBox="0 0 24 24">
      <path d="M12 4l-8 8h6v12h4V12h6l-8-8z" />
    </svg>
  );
  
  // Downvote Icon
  const DownvoteIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} width="25" height="20" viewBox="0 0 24 24">
      <path d="M12 20l8-8h-6V0h-4v12H4l8 8z" />
    </svg>
  );
  return (
    <div className="post-style-map">
      <SmallDashOutlined
        style={{ justifyContent: 'end' }}
        onClick={showModal}
      />
      <Modal
        title="Options"
        visible={isModalVisible}  
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        getContainer={false}
      >
        {showDelete && currentUser?._id === post.user._id && (
          <p className="delete-post" onClick={handleDelete} >
           <span style={{display:'inline-block'}}> <DeleteOutlined /></span> Delete Post
          </p>  
        )}
       {showBookmark && (
  <p className="bookmark-post" onClick={handleBookmark}>
    <span style={{ display: 'inline-block' }}>
      <BookOutlined style={{ color: currentUser?.bookmarkedPosts?.includes(post._id) || optimisticBookmarked ? '#f28123' : 'inherit' }} />
    </span>
    {currentUser?.bookmarkedPosts?.includes(post._id) || optimisticBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
  </p>
)}
      </Modal>
      <div className="post-attribute">
      </div>
      <div className="created-by">
        <img
          src={post.user.profilePic ? `${baseUrl}${post.user.profilePic.replace(/\\/g, '/')}` : initialProfile}
          alt="Profile"
          className="pfp-img"
        />
        <div className="pfp-detail">
          <div>
            <Link
              to={`/dashboard/profile/${post.user._id}`}
              className="userName-style"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {post.user.firstName} {post.user.lastName}
            </Link>
            <p className="created-at">{getTimeAgo(post.createdAt)}</p>
          </div>
          {currentUser?._id && post.user._id !== currentUser._id && (
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
          <img src={`${baseUrl}${post.recipeimg.replace(/\\/g, '/')}`} alt="Recipe Image" />
        )}
      </div>
      <div style={{ display: 'flex' }}>
      <div style={{ padding: 10 }} className="vote">
  <p onClick={handleUpvote}>
    <UpvoteIcon className={hasLiked ? 'voted upvoted' : ''} />
  </p>
  <p>{likesCount}</p>
</div>
<div style={{ padding: 10 }} className="vote">
  <p onClick={handleDownvote}>
    <DownvoteIcon className={hasUnliked ? 'voted downvoted' : ''} />
  </p>
  <p>{unlikesCount}</p>
</div>
      </div>
      
      <div className="comment-icon" onClick={() => setIsExpanded(!isExpanded)}>
        <p style={{cursor:'pointer'}}>
         <img src={CommentsIcon} alt="comment icon" /> {comments ? comments.commentData.length : 0} 
        </p>
      </div>
      {isExpanded && (
        <div className="comments-section">
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : commentsError ? (
            <p>Error loading comments</p>
          ) : (
            <>
              <div className="add-comment">
                <img
                  src={currentUser?.profilePic ? `${baseUrl}${currentUser.profilePic.replace(/\\/g, '/')}` : initialProfile}
                  alt="Profile"
                  className="comment-img"
                />
                <CommentForm
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                />
                <button onClick={handleCreateComment} className="submit-comment-btn">
                  add reply
                </button>
              </div>
              {comments && comments.commentData.length > 0 ? (
                comments.commentData.map((comment: Comment) => (
                  <div key={comment._id} className="comment">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex' }}>
                        <img
                          src={comment.author?.profilePic ? `${baseUrl}${comment.author?.profilePic.replace(/\\/g, '/')}` : initialProfile}
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
                      {currentUser?._id === comment.author._id && (
                        <div 
                          className="delete-comment-icon" 
                          onClick={() => handleDeleteComment(comment._id)}
                          style={{ cursor: 'pointer', padding: '5px' }}
                        >
                          <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        </div>
                      )}
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
  );
};

export default PostItem;