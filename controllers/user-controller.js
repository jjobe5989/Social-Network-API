const { User, Thought } = require("../models");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const dbUserData = await User.find({})
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  getUserById: async ({ params }, res) => {
    try {
      const dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .select("-__v");
      if (!dbUserData) {
        return res.status(404).json({ message: "No User Found" });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  },

  createUser: async ({ body }, res) => {
    try {
      const dbUserData = await User.create(body);
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  updateUser: async ({ params, body }, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!dbUserData) {
        res.status(404).json({ message: "No User Found" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  deleteUser: async ({ params }, res) => {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: params.id });
      if (!dbUserData) {
        return res.status(404).json({ message: "No User Found" });
      }
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({ message: "User Deleted" });
    } catch (err) {
      res.json(err);
    }
  },

  addFriend: async ({ params }, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!dbUserData) {
        res.status(404).json({ message: "No User Found" });
        return;
      }
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },

  removeFriend: async ({ params }, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "No User Found" });
      }
      res.json(dbUserData);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = userController;