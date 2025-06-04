const mongoose=require('mongoose');

const UserSchema =new mongoose.Schema({
    
  customerRef_no:{
    type:String
  }  ,
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phone:{
    type:String,
    
  },
  gender:{
    type:String
  },
  Address:{
    addressline1:{
        type:String
    },
    addressline2:{
        type:String
    },
    city:{
        type:String,

    },
    state:{
        type:String
    },
    zip:{
        type:String
    }
  },

  otp:{
    type:String
  },
  otpExpires:{
    type:String
  },
  refreshToken:{
    type:String
  },
  isBanned: {
    status: { type: Boolean, default: false },
    reason: String,
    bannedUntil: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
   role: {
    type: String,
    enum: ['User', 'Admin', 'SuperAdmin'],
    default: 'User',
  },
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  is_deleted:{
    type:Boolean,
    default:false
  },
  groups: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
],


})


module.exports=mongoose.model('User',UserSchema);