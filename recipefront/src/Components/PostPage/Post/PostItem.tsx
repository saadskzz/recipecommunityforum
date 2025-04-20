import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLikePostMutation, useUnlikePostMutation } from '../../../Slices/postSlice';
import { useGetPostCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from '../../../Slices/commentSlice';
import { useBookmarkPostMutation, useUnBookmarkPostMutation } from '../../../Slices/authSlice';
import './getpost.css';
import { BookOutlined, CommentOutlined, DeleteOutlined, SmallDashOutlined, ClockCircleOutlined, TeamOutlined, HeartOutlined, HeartFilled, BookFilled, MoreOutlined, LoadingOutlined, WarningOutlined, SendOutlined, RollbackOutlined } from '@ant-design/icons';
import PostForm from './PostForm';
import initialProfile from '../../../../initialprofile.jpg';
import { message, Modal, Input, Avatar, Tooltip, Divider, Tag, Button, Spin } from 'antd';
import { useTheme } from '../../../contexts/ThemeContext';

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
  post: string;
  createdAt: string;
  __v: number;
  parentId?: string;
  replies?: Comment[];
}

interface CommentResponse {
  status: string;
  commentData: Comment[];
}

// Create a simplified comment form component
const CommentForm = ({ value, onChange, placeholder, onSubmit, isReply = false }: 
  { value: string; onChange: (e: any) => void; placeholder: string; onSubmit: () => void; isReply?: boolean }) => {
  const { theme } = useTheme();
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && isReply) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={`custom-inp ${isReply ? 'reply-input' : ''}`}>
      {isReply ? (
        <Input
          size="large"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          className='ant-inp'
          suffix={
            <Button 
              type="text" 
              icon={<SendOutlined />} 
              onClick={onSubmit}
              style={{ color: value.trim() ? 'var(--primary-color)' : 'var(--text-light)' }}
              disabled={!value.trim()}
            />
          }
        />
      ) : (
        <Input.TextArea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className='ant-inp'
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      )}
    </div>
  );
};

// Comment item component
const CommentItem = ({ 
  comment, 
  currentUser, 
  baseUrl, 
  handleDeleteComment, 
  getTimeAgo, 
  handleCreateReply,
}: {
  comment: Comment;
  currentUser: User | undefined;
  baseUrl: string;
  handleDeleteComment: (commentId: string) => Promise<void>;
  getTimeAgo: (dateString: string) => string;
  handleCreateReply: (commentId: string, content: string) => Promise<void>;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const { theme } = useTheme();

  const handleReplySubmit = async () => {
    if (replyContent.trim()) {
      await handleCreateReply(comment._id, replyContent);
      setReplyContent('');
      setShowReplyInput(false);
      setShowReplies(true); // Show replies after submitting a new one
    }
  };

  // Check if the comment has replies
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="comment-item">
      <Avatar
        src={comment.author.profilePic ? `${baseUrl}${comment.author.profilePic.replace(/\\/g, '/')}` : initialProfile}
        alt={`${comment.author.firstName} ${comment.author.lastName}`}
        size={32}
        className="comment-img"
      />
      <div className="comment-details">
        <div style={{ flex: 1 }}>
          <div className="comment-name">
            {comment.author.firstName} {comment.author.lastName}
          </div>
          <div className="comment-text">{comment.content}</div>
          <div className="comment-time">{getTimeAgo(comment.createdAt)}</div>
          
          <div className="comment-actions">
            <Button 
              type="text" 
              size="small" 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="reply-button"
            >
              Reply
            </Button>
            
            {hasReplies && (
              <Button 
                type="text" 
                size="small" 
                onClick={() => setShowReplies(!showReplies)}
                className="view-replies-button"
                icon={showReplies ? null : <RollbackOutlined rotate={180} />}
              >
                {showReplies ? 'Hide replies' : `View ${comment.replies?.length} ${comment.replies?.length === 1 ? 'reply' : 'replies'}`}
              </Button>
            )}
          </div>
          
          {showReplyInput && (
            <div className="reply-input-container">
              <CommentForm
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                onSubmit={handleReplySubmit}
                isReply={true}
              />
            </div>
          )}
          
          {showReplies && hasReplies && (
            <div className="replies-container">
              {comment.replies?.map((reply) => (
                <div key={reply._id} className="reply-item">
                  <Avatar
                    src={reply.author.profilePic ? `${baseUrl}${reply.author.profilePic.replace(/\\/g, '/')}` : initialProfile}
                    alt={`${reply.author.firstName} ${reply.author.lastName}`}
                    size={24}
                    className="reply-img"
                  />
                  <div className="reply-details">
                    <div style={{ flex: 1 }}>
                      <div className="reply-name">
                        {reply.author.firstName} {reply.author.lastName}
                      </div>
                      <div className="reply-text">{reply.content}</div>
                      <div className="reply-time">{getTimeAgo(reply.createdAt)}</div>
                    </div>
                    {reply.author._id === currentUser?._id && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteComment(reply._id)}
                        size="small"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {comment.author._id === currentUser?._id && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteComment(comment._id)}
          />
        )}
      </div>
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
  const { theme } = useTheme();
  const [upvote] = useLikePostMutation();
  const [downvote] = useUnlikePostMutation();
  const [bookmarkPostMutation] = useBookmarkPostMutation();
  const [unbookmarkPostMutation] = useUnBookmarkPostMutation();
  const [showDelete, setShowDelete] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(
    currentUser?.bookmarkedPosts?.includes(post._id) || false
  );
  
  // Update optimisticBookmarked when currentUser or post changes
  useEffect(() => {
    setOptimisticBookmarked(currentUser?.bookmarkedPosts?.includes(post._id) || false);
  }, [currentUser, post._id]);
  
  const { data: commentsResponse, isLoading: commentsLoading, isError: commentsError, refetch: refetchComments } = useGetPostCommentsQuery(post._id);
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
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
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
        message.success('Comment added');
        refetchComments();
      } catch (error) {
        console.error('Failed to create comment:', error);
        message.error('Failed to add comment');
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      message.success('Comment deleted successfully');
      refetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      message.error('Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeletePost(post._id);
      message.success('Recipe deleted successfully');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      message.error('Failed to delete recipe');
    }
  };

  const handleBookmark = async () => {
    // Optimistically update UI state
    setOptimisticBookmarked(!optimisticBookmarked);
    
    try {
      if (isBookmarked) {
        await unbookmarkPostMutation(post._id).unwrap();
        message.success('Recipe removed from favorites');
      } else {
        await bookmarkPostMutation(post._id).unwrap();
        message.success('Recipe added to favorites');
      }
      
      // Call the parent component's handleBookmarkPost function for additional handling
      if (handleBookmarkPost) {
        handleBookmarkPost(post._id);
      }
    } catch (error) {
      // Revert optimistic update if there's an error
      setOptimisticBookmarked(!optimisticBookmarked);
      console.error('Failed to bookmark/unbookmark:', error);
      message.error('Failed to update favorites');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatIngredients = (ingredients: string[]) => {
    if (!ingredients || !ingredients.length) return null;
    
    return (
      <div className="recipe-ingredients">
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
      </div>
    );
  };

  const formatInstructions = (instructions: string) => {
    if (!instructions) return null;
    
    try {
      // Try to parse if instructions are JSON
      const parsedInstructions = JSON.parse(instructions);
      if (Array.isArray(parsedInstructions)) {
        return (
          <div className="recipe-instructions">
            <h3>Instructions</h3>
            <ol>
              {parsedInstructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        );
      }
    } catch (e) {
      // If not JSON, display as regular text
      return (
        <div className="recipe-instructions">
          <h3>Instructions</h3>
          <p>{instructions}</p>
        </div>
      );
    }
  };

  // Function to handle Enter key press in comment input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateComment();
    }
  };

  // Function to create a reply to a comment
  const handleCreateReply = async (parentId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      // Assuming your createComment API accepts a parentId parameter for replies
      await createComment({
        postId: post._id,
        content,
        parentId
      }).unwrap();
      
      message.success('Reply added');
      refetchComments();
    } catch (error) {
      console.error('Failed to add reply:', error);
      message.error('Failed to add reply');
    }
  };

  // Process comments data to organize into a tree structure with replies
  const organizedComments = React.useMemo(() => {
    if (!commentsResponse) return [];
    
    // If commentsResponse is an object with commentData property (from API response)
    if (typeof commentsResponse === 'object' && 'commentData' in commentsResponse) {
      const comments = (commentsResponse as CommentResponse).commentData || [];
      const commentMap = new Map();
      const result: Comment[] = [];
      
      // First pass: add all comments to the map
      comments.forEach(comment => {
        const commentWithReplies = { ...comment, replies: [] };
        commentMap.set(comment._id, commentWithReplies);
      });
      
      // Second pass: organize into parent/child structure
      comments.forEach(comment => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
          // This is a reply, add it to parent's replies array
          const parent = commentMap.get(comment.parentId);
          if (parent.replies) {
            parent.replies.push(commentMap.get(comment._id));
          } else {
            parent.replies = [commentMap.get(comment._id)];
          }
        } else {
          // This is a top-level comment
          result.push(commentMap.get(comment._id));
        }
      });
      
      return result;
    }
    
    // If commentsResponse is already an array
    if (Array.isArray(commentsResponse)) {
      return commentsResponse;
    }
    
    return [];
  }, [commentsResponse]);

  return (
    <div className={`post-style-map ${theme === 'dark' ? 'dark-theme-post' : ''}`}>
      <div className="pfp-detail">
        <div className="created-by">
          <Link to={`/dashboard/profile/${post.user._id}`}>
            <Avatar 
              src={post.user.profilePic ? `${baseUrl}${post.user.profilePic.replace(/\\/g, '/')}` : initialProfile}
              alt={`${post.user.firstName} ${post.user.lastName}`}
              size={50}
              className="pfp-img"
            />
          </Link>
          <div style={{ marginLeft: 10 }}>
            <div className="userName-style">
              {post.user.firstName} {post.user.lastName}
            </div>
            <div className="created-at">
              <ClockCircleOutlined style={{ marginRight: 5 }} />
              {getTimeAgo(post.createdAt)}
            </div>
          </div>
        </div>

        <div className="post-attribute">
          {post.user._id !== currentUser?._id ? (
            followingIds?.includes(post.user._id) ? (
              <button className="follow unfollow-btn" onClick={() => handleUnfollow(post.user._id)}>
                Following
              </button>
            ) : (
              <button className="follow" onClick={() => handleFollow(post.user._id)}>
                Follow
              </button>
            )
          ) : (
            <Tooltip title="More options">
              <Button
                type="text"
                icon={<MoreOutlined />}
                onClick={() => setShowDelete(!showDelete)}
                style={{ border: 'none' }}
              />
            </Tooltip>
          )}
          {showDelete && post.user._id === currentUser?._id && (
            <div className="delete-options">
              <div className="delete-post" onClick={handleDelete}>
                <DeleteOutlined /> Delete
              </div>
            </div>
          )}
        </div>
      </div>

      {post.discussionCategory && (
        <Tag className="category-type">
          {post.discussionCategory.discussionCategory}
        </Tag>
      )}

      <h2 className="post-title">{post.title}</h2>

      {post.recipeimg && (
        <div className="postImg">
          <img src={post.recipeimg} alt={post.title} />
        </div>
      )}

      {formatIngredients(post.ingredients)}
      {formatInstructions(post.instructions)}

      <div className="comment-icon">
        <div className="dashoutline-fields" onClick={handleUpvote}>
          <div className={`vote ${hasLiked ? 'voted' : ''}`}>
            {hasLiked ? <HeartFilled /> : <HeartOutlined />}
          </div>
          <p>{likesCount}</p>
        </div>

        <div className="dashoutline-fields" onClick={toggleComments}>
          <CommentOutlined />
          <p>{organizedComments?.length || 0}</p>
        </div>

        <div className="dashoutline-fields" onClick={handleBookmark}>
          <div className={optimisticBookmarked ? 'voted' : ''}>
            {optimisticBookmarked ? <BookFilled /> : <BookOutlined />}
          </div>
          <p>Save</p>
        </div>
      </div>

      {showComments && (
        <div className="comments-container">
          {commentsLoading ? (
            <div className="comments-loading">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <p>Loading comments...</p>
            </div>
          ) : commentsError ? (
            <div className="comments-error">
              <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <p>Error loading comments. <Button type="link" onClick={refetchComments}>Try again</Button></p>
            </div>
          ) : organizedComments && organizedComments.length > 0 ? (
            <div className="comments-section">
              {organizedComments.map((comment: Comment) => (
                <CommentItem 
                  key={comment._id}
                  comment={comment}
                  currentUser={currentUser}
                  baseUrl={baseUrl}
                  handleDeleteComment={handleDeleteComment}
                  getTimeAgo={getTimeAgo}
                  handleCreateReply={handleCreateReply}
                />
              ))}
            </div>
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
          <Divider />
          <div className="add-comment">
            <CommentForm
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onSubmit={handleCreateComment}
            />
            <Button
              type="primary"
              onClick={handleCreateComment}
              style={{ marginTop: 10, width: '100%', maxWidth: '150px' }}
              className="comment-button"
            >
              Post Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;