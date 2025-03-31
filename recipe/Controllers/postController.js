import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../Models/UserModel.js';
import Post from '../Models/PostModel.js';

const createPost = async(req,res)=>{       
      const {title,ingredients,instructions,discussionCategory} = req.body;
      const userId = req.user._id; 
      if(!title || !ingredients || !instructions || !discussionCategory){
        return res.status(404).json({
            message: "all fields are required to create a post"
        })
      }
      
 const postData = new Post({title,ingredients,instructions, user: userId,discussionCategory})
 console.log(userId)
      if (req.file) {
        postData.recipeimg = req.file.path;
      }
    
       try{
     await postData.save();
     return res.status(200).json({
        status:"success",
        data:postData
     })
       }catch(err){
res.status(404).json({
  message:err.message
})
       }

}

const deleteSelfPost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        console.log('delete hit')
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }

        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
const getAllPosts = async(req,res)=>{
  try{
  const postData = await Post.find().populate('user').populate('discussionCategory')
  if(!postData){
   return res.status(404).json({
      status:"fail",
      message:"There are no post"
    })
  
  }
  res.status(200).json({
    status:"success",
    postData
  })
  }catch(err){
    return res.status(404).json({
     
      message: err.message
    })
  
  }
}
const deleteAnyPost = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const getUserPosts = async (req, res) => {
    const userId = req.user._id;
    console.log(userId)

    try {
        const userPosts = await Post.find({ user: userId }).populate('user');
        if (!userPosts.length) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        return res.status(200).json({
            status: "success",
            data: userPosts
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.likes) {
      post.likes = [];
    }

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      post.likesCount += 1;

      // Remove from unlikes if present
      const unlikeIndex = post.unlikes.indexOf(req.user._id);
      if (unlikeIndex > -1) {
        post.unlikes.splice(unlikeIndex, 1);
        post.unlikesCount -= 1;
      }

      await post.save();
    }

    res.status(200).json({
      status: "success",
      post
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.unlikes) {
      post.unlikes = [];
    }

    if (!post.unlikes.includes(req.user._id)) {
      post.unlikes.push(req.user._id);
      post.unlikesCount += 1;

     
      const likeIndex = post.likes.indexOf(req.user._id);
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1);
        post.likesCount -= 1;
      }

      await post.save();
    }

    res.status(200).json({
      status: "success",
      post
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLikedPosts = async (req, res) => {
  const userId = req.user._id;
console.log('liked')
  try {
    const likedPosts = await Post.find({ likes: userId }).populate('user').populate('discussionCategory');
    if (!likedPosts.length) {
      return res.status(404).json({ message: "No liked posts found for this user" });
    }

    return res.status(200).json({
      status: "success",
      data: likedPosts
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getFollowedUserPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('following');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUserIds = user.following.map(followedUser => followedUser._id);
    const followedPosts = await Post.find({ user: { $in: followedUserIds } })
      .populate('user')
      .populate('discussionCategory'); // Added population of discussionCategory

    if (!followedPosts.length) {
      return res.status(404).json({ message: "No posts found for followed users" });
    }

    return res.status(200).json({
      status: "success",
      data: followedPosts
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getBookmarkedPosts = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate({
      path: 'bookmarkedPosts',
      populate: { path: 'user', select: '_id firstName lastName' }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.bookmarkedPosts.length) {
      return res.status(404).json({ message: "No bookmarked posts found for this user" });
    }
    return res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
const getPostsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const posts = await Post.find({ discussionCategory: categoryId }).populate('user').populate('discussionCategory');
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this category" });
    }

    return res.status(200).json({
      status: "success",
      data: posts
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getPostsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({ user: userId }).populate('user').populate('discussionCategory');
    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    return res.status(200).json({
      status: "success",
      data: posts
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { createPost, deleteSelfPost, deleteAnyPost, getAllPosts, getUserPosts, likePost, unlikePost, getLikedPosts, getFollowedUserPosts, getBookmarkedPosts, getPostsByCategory, getPostsByUserId };