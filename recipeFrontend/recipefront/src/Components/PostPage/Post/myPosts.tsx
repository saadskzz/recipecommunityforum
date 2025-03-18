import React from 'react';
import { useGetMyPostsQuery } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery } from '../../../Slices/authSlice'; // Import auth query
import './getpost.css';

interface Post {
  _id: number;
  title: string;
  ingredients: [string];
  instructions: string;
  recipeimg: string;
  user: {
    _id: string; // Add _id to user object
    firstName: string;
    lastName: string;
  };
  discussionCategory: {
    discussionCategory: string;
  };
  createdAt: string;
}

function MyPosts() {
  const { data: posts, error, isLoading } = useGetMyPostsQuery(undefined);
  const { data: currentUser } = useGetCurrentUserQuery(undefined); // Fetch current user
  console.log('posts',posts);
  console.log(error);
  console.log('Current User:', currentUser);

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

  // Get the current user's ID
  const currentUserId = currentUser?.data?._id;

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <p>error getting</p>}
      {posts && posts.data.map((post: Post) => (
        <div key={post._id} className="post-style-map">
          <div className="created-by">
            <div className="pfp-img"></div>
            <div className="pfp-detail">
              <div>
                <p className="userName-style">{post.user.firstName} {post.user.lastName}</p>
                <p className="created-at">{getTimeAgo(post.createdAt)}</p>
              </div>
              {/* Show + Follow only if the post's user is not the current user */}
              {currentUserId && post.user._id !== currentUserId && (
                <p className="follow">+ Follow</p>
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
        </div>
      ))}
    </div>
  );
}

export default MyPosts;
