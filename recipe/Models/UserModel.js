const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName:{
    type:String,
    required:true
  },
  email: {
    type: String,
    required: true  
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  passwordConfirm:{
   type:String
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarkedPosts:[{
    type:Schema.Types.ObjectId,
    ref: 'Post'
  }], 
  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  profilePic: String,
  coverPic: String,
  Bio: {
    type: String,
    default: ''
  }
})

userSchema.methods.updateBio = function(newBio) {
  this.Bio = newBio;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

