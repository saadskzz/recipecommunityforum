const User = require('../Models/UserModel');
const bcrypt = require('bcrypt')
const {createToken} = require('../Middlewares/middleware');
const PostModel = require('../Models/PostModel');
const signUp = async (req, res) => {
console.log('signup hit')
    const { firstName, lastName, email, password, role,passwordConfirm } = req.body;

    if (!firstName ||!lastName|| !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All feilds should be filled" })
    }
    try {
      let existingUser;
      try {
        existingUser = await User.findOne({ email: email });
      } catch (err) {
        console.error(err);
      }
  
      if (existingUser) {
        if (existingUser.email == email) {
          return res.status(409).json({ message: "A User is already signUp with this email" })
        }
        
      }
  if(password !== passwordConfirm){
    return res.status(404).json({
      status:"fail",
      message:"passwords do not match"
    })
  }
      const salt = await bcrypt.genSalt(6)
     
      const hashedpassword = await bcrypt.hash(password, salt);
  
   
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedpassword,
        role: role,
      });
  
      await user.save();
      return res.status(201).json({ message: "Account Creation is success, Login to your account", data: user })

    } catch (err) {
      console.error(err)
      return res.status(400).json({ message: "Error in saving user in DB" });
    }
  }
const followUser = async(req,res)=>{
  console.log('follow hit')
    try {
        const userId = req.user._id;
        const { userIdToFollow } = req.params;

        if (userId === userIdToFollow) {
          return res.status(400).json({ message: "Cannot follow yourself" });
        }

        const user = await User.findById(userId);
        const userToFollow = await User.findById(userIdToFollow);

        if (!user || !userToFollow) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!user.following.includes(userIdToFollow)) {
          user.following.push(userIdToFollow);
          userToFollow.followers.push(userId);

          user.updatedAt = new Date();
          userToFollow.updatedAt = new Date();

          await Promise.all([user.save(), userToFollow.save()]);
        }

        const updatedUser = await User.findById(userId)
          .populate('following', 'firstName email');

        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
const unfollowUser = async(req,res)=>{
    try {
        const userId = req.user._id;
        const { userIdToUnfollow } = req.params;

        const user = await User.findById(userId);
        const userToUnfollow = await User.findById(userIdToUnfollow);

        if (!user || !userToUnfollow) {
          return res.status(404).json({ message: "User not found" });
        }

        const followingIndex = user.following.indexOf(userIdToUnfollow);
        if (followingIndex !== -1) {
          user.following.splice(followingIndex, 1);
          const followerIndex = userToUnfollow.followers.indexOf(userId);
          if (followerIndex !== -1) {
            userToUnfollow.followers.splice(followerIndex, 1);
          }

          user.updatedAt = new Date();
          userToUnfollow.updatedAt = new Date();

          await Promise.all([user.save(), userToUnfollow.save()]);
        }

        const updatedUser = await User.findById(userId)
          .populate('following', 'firstName email');

        res.status(200).json({data:updatedUser});
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}
const getFollowing = async(req,res)=>{
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
          .populate('following', 'firstname email');
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({data:user.following});
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

const getFollowers = async(req,res)=>{ 
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .populate('followers', 'firstName email');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({data:user.followers});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(422).json({ message: "All fields should be filled" })
    }
  
    let loggedUser;
  
    try {
        loggedUser = await User.findOne({ email: email });
  
        if (!loggedUser) {
            return res.status(404).json({ message: "Email is not found, Check it and try again" })
        }
     
        const isPasswordCorrect = bcrypt.compareSync(password, loggedUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password, Check it and try again" })
        }
        const token = createToken(loggedUser._id);
      
        return res.status(200).json({ message: "Successfully logged in", data: loggedUser, token: token })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}
const logout = async(req,res)=>{
    const user = await User.findOne({ email });

  if (!user) {
      throw new Error("User does not exist");
  }
  let token = await User.findOne({ userId: user._id });
  if (token) { 
        await token.deleteOne()
  };  
}
const createBookmarkedPosts = async (req, res) => {
  console.log('hitt')
    const userId = req.user._id;
    const { bookmarkedPosts } = req.body;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.bookmarkedPosts.includes(bookmarkedPosts)) {
        return res.status(400).json({ message: "Post already bookmarked" });
      }

      const postExists = await PostModel.findById(bookmarkedPosts);

      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }

      user.bookmarkedPosts.push(bookmarkedPosts);
      await user.save();

      res.status(200).json({ message: "Post bookmarked" });
      console.log('it')
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
const showBookmarkPost = async(req,res)=>{
    const userId = req.user._id
    try{
    const user = await User.findById(userId).populate({
      path: 'bookmarkedPosts',
      populate: [
        { path: 'user' },              // Populates the user field in each post
        { path: 'discussionCategory' } // Populates the discussionCategory field in each post
      ]
    })


    res.status(200).json({
     user
    })}
catch(err){
  res.status(400).json({
    message:err.message
  })
}
}
const unBookmarkPost = async(req,res)=>{
    const userId = req.user._id;
    console.log('hit')
    try{
      const user = await User.findById(userId)
      const {bookmarkedPosts} = req.body;
      user.bookmarkedPosts.pull(bookmarkedPosts)
      await user.save();
      res.status(200).json({
        message:'post unbookmarked'
      })
    }catch(err){
      res.status(400).json({
        message: err.message
      })
      
    }
}

const uploadProfilePic = async (req, res) => {
  const userId = req.user._id;
  const profilePic = req.file.path;
  console.log(profilePic)

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePic = profilePic;
    await user.save();

    res.status(200).json({ status:"profile picture uploaded",data: user.profilePic });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadCoverPic = async (req, res) => {
  const userId = req.user._id;
  const coverPic = req.file.path;
  console.log(coverPic)

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.coverPic = coverPic;
    await user.save();

    res.status(200).json({ message: "Cover picture updated", data: user.coverPic });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLoggedInUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBio = async (req, res) => {
  const userId = req.user._id;
  const { bio } = req.body;
  console.log(bio, 'biohit');
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateBio(bio);

    res.status(200).json({ message: "Bio updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password'); // Exclude sensitive data
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user?._id; 
  const { oldPassword, newPassword, passwordConfirm } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (!oldPassword || !newPassword || !passwordConfirm) {
    return res.status(400).json({ message: "All fields must be filled" });
  }

  if (newPassword !== passwordConfirm) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(6);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  signUp,
  login,
  getUserById,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  createBookmarkedPosts,
  showBookmarkPost,
  unBookmarkPost,
  uploadProfilePic,
  uploadCoverPic,
  getLoggedInUser,
  updateBio,
  changePassword
};