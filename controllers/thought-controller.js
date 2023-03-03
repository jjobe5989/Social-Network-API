const { Thought, User } = require("../models");

const thoughtController = {
// Gets all thoughts
    getAllThought(req,res) {
        Thought.find({})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({_id: -1 })
        .then((dbThoughtdata) => res.json(dbThoughtdata))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

//    get one thought
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: "No thought with this id!" });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },
// create thought
    createThought({ params, body }, res) {
        Thought.create(body)
          .then(({ _id }) => {
           return User.findOneAndUpdate(
              { _id: body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((dbThoughtData) => {
            if(dbUserData) {
                return res
                .status(404)
                .json({ message: "Thought created, No user with this id!" });
            }

            res.json({ message: "Thought created" });
          })
          .catch((err) => res.json(err));
    },

    // update thought 
    updateThought({ params,body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({ message: "No thought with this id" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
    // delete thought\
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: "No thought found" });
            }

            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
           if (!dbUserData) {
            return res
            .status(404)
            .json({ message: "No user with this id" });
            }
            res.json({ message: "Thought deleted!" });
        })
        .catch((err) => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
          )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No Thought Found" });
                return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => res.json(err));
    },

    // remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => (err));
    },
};

module.exports = thoughtController;