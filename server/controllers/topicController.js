const Topic = require('../models/Topic');

exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({});
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTopic = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newTopic = new Topic({ name, description });
        await newTopic.save();
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
