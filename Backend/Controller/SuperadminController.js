const User = require("../Models/UserModel");
const Group = require("../Models/groupModel");
const LiveSession = require("../Models/LiveSession");
const Feedback = require("../Models/FeedbackModel");
const ChatMessage = require("../Models/ChatMessage");

//  resgiter admin

const ResgisterAdmin = async (req, res) => {
  const { name, email, phone, Address, gender } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing required filed",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({
        error: true,
        message: "User already register",
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      gender,
      Address,
      role: "Admin",
    });

    newUser.customerRef_no = newUser._id;

    await newUser.save();

    return res.status(200).json({
      error: false,
      message: "Admin register successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all registed admin

const GetallAdmin = async (req, res) => {
  try {
    const admins = await User.find({
      role: "Admin",
      is_deleted: { $ne: true },
    });

    if (!admins || admins.lenght == 0) {
      return res.status(404).json({
        error: true,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Admin list",
      data: admins,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// delete admin

const DeleteAdmin = async (req, res) => {
  const { customer_ref_no } = req.params;

  try {
    if (!customer_ref_no) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || customer refrence no missing",
      });
    }

    const admin = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      { is_deleted: true },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({
        error: true,
        message: "Admin not found || admin already deleted",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Admin Deleted successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ban admin api

const BanAdmin = async (req, res) => {
  const { customer_ref_no } = req.params;
  const { reason, banType, bannedUntil } = req.body || {};

  if (!customer_ref_no || !reason || !banType) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields (customer_ref_no, reason, banType)",
    });
  }

  try {
    const user = await User.findOne({ customerRef_no: customer_ref_no });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        error: true,
        message: "Only admins can be banned",
      });
    }

    const updateData = {
      isBanned: {
        status: true,
        reason: reason,
        bannedUntil: banType === "temporary" ? new Date(bannedUntil) : null,
      },
    };

    const updatedUser = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Admin banned successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// unban any admin after temrory ban autometic unban work

const UnbanAdmin = async (req, res) => {
  const { customer_ref_no } = req.params;

  try {
    if (!customer_ref_no) {
      return res.status(400).json({
        error: true,
        message: "Customer reference number is required",
      });
    }

    const user = await User.findOne({ customerRef_no: customer_ref_no });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        error: true,
        message: "Only admins can be unbanned",
      });
    }

    // Proceed to unban the admin
    const updatedUser = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      {
        isBanned: {
          status: false,
          reason: null,
          bannedUntil: null,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Admin has been unbanned",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ------------------------------------------user controller------------------------------

// resgister user

const ResgiterUser = async (req, res) => {
  const { name, email, phone, Address, gender } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || Missing required filed",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({
        error: true,
        message: "User already register",
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      gender,
      Address,
      role: "User",
    });

    newUser.customerRef_no = newUser._id;

    await newUser.save();

    return res.status(200).json({
      error: false,
      message: "User register successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all User list

const GetallUsers = async (req, res) => {
  try {
    const admins = await User.find({
      role: "User",
      is_deleted: { $ne: true },
    });

    if (!admins || admins.lenght == 0) {
      return res.status(404).json({
        error: true,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      error: true,
      message: "Admin list",
      data: admins,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// delete User

const DeleteAnyUser = async (req, res) => {
  const { customer_ref_no } = req.params;

  try {
    if (!customer_ref_no) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong || customer refrence no missing",
      });
    }

    const user = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      { is_deleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "user not found || user already deleted",
      });
    }

    return res.status(200).json({
      error: false,
      message: "user Deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ban user

const BanUser = async (req, res) => {
  const { customer_ref_no } = req.params;
  const { reason, banType, bannedUntil } = req.body || {};

  if (!customer_ref_no || !reason || !banType) {
    return res.status(400).json({
      error: true,
      message: "Missing required fields (customer_ref_no, reason, banType)",
    });
  }

  try {
    const user = await User.findOne({ customerRef_no: customer_ref_no });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    if (user.role !== "User") {
      return res.status(403).json({
        error: true,
        message: "Only User can be banned",
      });
    }

    const updateData = {
      isBanned: {
        status: true,
        reason: reason,
        bannedUntil: banType === "temporary" ? new Date(bannedUntil) : null,
      },
    };

    const updatedUser = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "User banned successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// unban user

const UnbanUser = async (req, res) => {
  const { customer_ref_no } = req.params;
  try {
    if (!customer_ref_no) {
      return res.status(400).json({
        error: true,
        message: "Customer reference number is required",
      });
    }

    const user = await User.findOne({ customerRef_no: customer_ref_no });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    if (user.role !== "User") {
      return res.status(403).json({
        error: true,
        message: "Only User can be unbanned",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { customerRef_no: customer_ref_no },
      {
        isBanned: {
          status: false,
          reason: null,
          bannedUntil: null,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "User has been unbanned",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// ---------------------------------group controller----------------------

// create group

const createGroup = async (req, res) => {
  const { groupname, grouptype, chat, users } = req.body;

  if (!groupname || !Array.isArray(users) || users.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Group name and at least one user are required",
    });
  }

  try {
    const validUsers = await User.find({
      _id: { $in: users },
      role: "User",
    });

    if (validUsers.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'No valid users with role "User" found',
      });
    }

    if (validUsers.length !== users.length) {
      return res.status(400).json({
        error: true,
        message: 'Only users with role "User" can be added to the group',
      });
    }

    const newGroup = new Group({
      groupname,
      grouptype: grouptype || "public",
      chat: chat || "enabled",
      users: validUsers.map((user) => user._id),
    });

    const savedGroup = await newGroup.save();

    return res.status(201).json({
      error: false,
      message: "Group created successfully",
      data: savedGroup,
    });
  } catch (error) {
    console.error("Create Group Error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get all groups

const GetallGroupsList = async (req, res) => {
  try {
    const groups = await Group.find();
    if (!groups || groups.length == 0) {
      return res.status(404).json({
        error: true,
        message: "No group found",
      });
    }

    return res.status(200).json({
      error: true,
      message: "Group list",
      data: groups,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// add user in group after create

const addUsersToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res
      .status(400)
      .json({ error: true, message: "Users array is required" });
  }

  try {
    const validUsers = await User.find({
      _id: { $in: users },
      role: "User",
    });

    if (validUsers.length === 0) {
      return res.status(400).json({
        error: true,
        message: "No valid users with role 'User' found",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: true, message: "Group not found" });
    }

    const existingUserIds = group.users.map((id) => id.toString());
    const newUserIds = validUsers
      .map((user) => user._id.toString())
      .filter((id) => !existingUserIds.includes(id));

    group.users.push(...newUserIds);
    await group.save();

    return res.status(200).json({
      error: false,
      message: "Users added to group successfully",
      data: group,
    });
  } catch (error) {
    console.error("Add Users Error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// remove users from created group

const removeUsersFromGroup = async (req, res) => {
  const { groupId } = req.params;
  const { users } = req.body;

  if (!Array.isArray(users) || users.length === 0) {
    return res
      .status(400)
      .json({ error: true, message: "Users array is required" });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: true, message: "Group not found" });
    }

    group.users = group.users.filter(
      (userId) => !users.includes(userId.toString())
    );

    await group.save();

    return res.status(200).json({
      error: false,
      message: "Users removed from group successfully",
      data: group,
    });
  } catch (error) {
    console.error("Remove Users Error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// assign groups to admin

const AssignGroupsToAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { groupIds } = req.body;

    if (!adminId || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Admin ID and non-empty groupIds array are required",
      });
    }

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "Admin") {
      return res.status(404).json({
        error: true,
        message: "Admin not found or user is not an Admin",
      });
    }

    const existingGroups = await Group.find({ _id: { $in: groupIds } });
    if (existingGroups.length !== groupIds.length) {
      return res.status(404).json({
        error: true,
        message: "One or more group IDs are invalid",
      });
    }

    const conflictingAdmins = await User.find({
      _id: { $ne: adminId },
      role: "Admin",
      groups: { $in: groupIds },
    });

    if (conflictingAdmins.length > 0) {
      const alreadyAssignedGroups = conflictingAdmins.flatMap((admin) =>
        admin.groups.filter((groupId) => groupIds.includes(groupId.toString()))
      );

      return res.status(409).json({
        error: true,
        message: "Some groups are already assigned to other admins",
        alreadyAssignedGroups,
      });
    }

    const uniqueGroups = [
      ...new Set([...(adminUser.groups || []), ...groupIds]),
    ];
    adminUser.groups = uniqueGroups;

    await adminUser.save();

    return res.status(200).json({
      error: false,
      message: "Groups assigned to Admin successfully",
      data: adminUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// create live session

const CreateLiveSession = async (req, res) => {
  const { title, sessionDate, sessionTime, groupId, createdBy } = req.body;
  try {
    const group = await Group.findById(groupId);
    console.log("group", group);
    if (!group) {
      return res.status(404).json({
        error: true,
        message: "Group not found",
      });
    }
    const session = new LiveSession({
      title,
      sessionDate,
      sessionTime,
      group: groupId,
      createdBy,
    });
    console.log("session");
    await session.save();
    res.status(201).json({
      error: false,
      message: "Live Session created Successfully",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get group list of any specific admin

const GetGroupListOfAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;
    console.log("admin Id", adminId);
    const admin = await User.findById(adminId).populate({
      path: "groups",
      populate: {
        path: "users",
        select: "name email role", // Only required fields
      },
    });
    console.log("admin", admin);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({
        error: true,
        message: "Access denied. Not an admin.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Groups fetched successfully",
      groups: admin.groups || [],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

//  get livession by user side using groupID

const GetLivesessionByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    if (!groupId) {
      return res.status(400).json({
        error: true,
        message: "Something went wrong",
      });
    }

    const sessions = await LiveSession.find({
      group: groupId,
      isActive: true,
    }).sort({ sessionDate: -1 });

    return res.status(200).json({
      error: true,
      message: "Get Session by Group Id",
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// get livesession by user side using UserId

const GetLiveSessionByUserId = async (req, res) => {
  const { customerRef_no } = req.params;
  try {
    const user = await User.findById(customerRef_no).populate("groups");

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const groupIds = user.groups.map((group) => group._id);
    console.log("groupIds", groupIds);
    const sessions = await LiveSession.find({
      group: { $in: groupIds },
      isActive: true,
    }).sort({ sessionDate: -1 });

    return res.status(200).json({
      error: true,
      message: "Get live session list",
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// add feedback

const AddFeedBack = async (req, res) => {
  try {
    const { type, message, group, customerRef_no } = req.body;

    if (!type || !message || !group || !customerRef_no) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields: type, message, group, or customerRef_no",
      });
    }

    const feedback = new Feedback({
      user: customerRef_no,
      type,
      message,
      group,
    });

    await feedback.save();

    return res.status(200).json({
      error: false,
      message: "Feedback submitted successfully",
      data: feedback,
    });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
// get all feedbacks of user view only by admin or super admin

const GetFeedbacklist = async (req, res) => {
  try {
    const { type, date, userId } = req.params;
    const filter = {};

    if (type && type !== "all") filter.type = type;
    if (userId && userId !== "all") filter.user = userId;
    if (date && date !== "all") {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const feedbacks = await Feedback.find(filter)
      .populate("user", "name email")
      .populate("session", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      error: false,
      message: "Feedback list",
      data: feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const GetAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name email") // fetch user name and email
      .populate("group", "groupname grouptype") // fetch group name and type
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No feedbacks found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "All feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// get gorup list
const GetGroupListOfUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id; // Get user ID from params or authenticated user
    console.log("User ID:", userId);

    // Find all groups where the user is part of the 'users' array
    const groups = await Group.find({ users: userId }).populate({
      path: "users",
      select: "name email role", // Include only necessary user fields
    });

    if (!groups || groups.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No groups found for this user",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Groups fetched successfully",
      groups,
    });
  } catch (error) {
    console.error("GetGroupListOfUser Error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// chat message

const GetChatHistory = async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await ChatMessage.find({ session: groupId })
      .populate("sender", "name email")
      .sort({ sentAt: 1 })
      .lean();

    // Transform the data to match client expectations
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      sessionId: msg.session,
      message: msg.message,
      sentAt: msg.sentAt,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        email: msg.sender.email
      }
    }));

    res.status(200).json({ success: true, messages: formattedMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


// check gorup info
const GetGroupInfo = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById({ groupId }).populate(
      "users",
      "name email"
    );
    console.log("groups check", group);
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    res.status(200).json({ success: true, group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  ResgisterAdmin,
  ResgiterUser,
  GetallAdmin,
  DeleteAdmin,
  DeleteAnyUser,
  GetallUsers,
  BanAdmin,
  UnbanAdmin,
  UnbanUser,
  BanUser,
  createGroup,
  removeUsersFromGroup,
  addUsersToGroup,
  GetallGroupsList,
  AssignGroupsToAdmin,
  CreateLiveSession,
  GetLivesessionByGroupId,
  GetLiveSessionByUserId,
  AddFeedBack,
  GetFeedbacklist,
  GetGroupListOfAdmin,
  GetGroupListOfUser,
  GetChatHistory,
  GetGroupInfo,
    GetAllFeedbacks
};
