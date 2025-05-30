import React from 'react';
import { useGetMyPostsQuery } from '../../../Slices/postSlice';
import { useGetCurrentUserQuery } from '../../../Slices/authSlice';
import './getpost.css';
import noPost from '../../../../noPost.jpg'
interface Post {
  _id: number;
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
}

function MyPosts() {
  const { data: posts, error, isLoading } = useGetMyPostsQuery(undefined);
  console.log('my posts:' ,posts)
  const { data: currentUser } = useGetCurrentUserQuery(undefined); 
 
 
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

 
  const currentUserId = currentUser?.data?._id;

  return (
    <div className="post-style">
      {isLoading && <p>Loading...</p>}
      {error && <div className='error-content' > <div className='no-post-style'><img src={noPost} alt="no post" /></div>
      <p>No posts made yet</p> </div>}
      {posts && posts.data.map((post: Post) => (
        <div key={post._id} className="post-style-map">
          <div className="created-by">
            <div className="pfp-img"></div>
            <div className="pfp-detail">
              <div>
                <p className="userName-style">{post.user.firstName} {post.user.lastName}</p>
                <p className="created-at">{getTimeAgo(post.createdAt)}</p>
              </div>
              
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
