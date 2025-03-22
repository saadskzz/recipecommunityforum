import { useState } from 'react';
import './createPost.css';
import AddPost from './AddPost';
import { Modal } from 'antd';

function CreatePost() {
  const [addPost, SetAddPost] = useState(false);

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
          <AddPost onCancel={() => SetAddPost(false)} />
        </Modal>
      )}
    </div>
  );
}

export default CreatePost;