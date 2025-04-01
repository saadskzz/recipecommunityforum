import { useState } from 'react';
import './createPost.css';
import AddPost from './AddPost';
import { Modal, message } from 'antd';

function CreatePost() {
  const [addPost, SetAddPost] = useState(false);

  const handlePostSuccess = () => {
    message.success('Post created successfully');
    SetAddPost(false);
  };

  const handlePostError = (errorMessage: string) => {
    message.error(errorMessage || 'Failed to create post');
  };

  return (
    <div className="createPost">
      <p onClick={() => SetAddPost(!addPost)}>
        <span>+</span> Create a Post
      </p>
      {addPost && (
        <Modal
          visible={addPost}
          onCancel={() => SetAddPost(false)}
          footer={null}
          title="Create a Post"
        >
          <AddPost 
            onCancel={() => SetAddPost(false)} 
            onSuccess={handlePostSuccess}
            onError={handlePostError}
          />
        </Modal>
      )}
    </div>
  );
}

export default CreatePost;