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
}