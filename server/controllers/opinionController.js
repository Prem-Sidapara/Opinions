const Opinion = require('../models/Opinion');

const Topic = require('../models/Topic');

// Create a new opinion
exports.createOpinion = async (req, res) => {
    try {
        const { title, content, topic, isAnonymous } = req.body;

        // Ensure topic exists in Topic collection
        const existingTopic = await Topic.findOne({ name: { $regex: new RegExp(`^${topic}$`, 'i') } });
        if (!existingTopic) {
            await new Topic({ name: topic, description: `Opinions about ${topic}` }).save();
        }

        const newOpinion = new Opinion({
            title,
            content,
            topic, // We still save the string in Opinion for now, can be populated later if schema changes
            userId: req.user.id, // Assuming middleware adds user to req
            isAnonymous: isAnonymous || false,
            ip: req.ip // simplified IP capture
        });

        const savedOpinion = await newOpinion.save();
        res.status(201).json(savedOpinion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all opinions (with filters/sorting)
exports.getOpinions = async (req, res) => {
    try {
        const { topic, sort, cursor } = req.query; // cursor pagination could be added later
        const filter = {};
        if (topic) filter.topic = topic;

        let sortOption = { createdAt: -1 }; // Default: Latest
        if (sort === 'popular') sortOption = { views: -1 };
        if (sort === 'helpful') sortOption = { helpful: -1 };

        const opinions = await Opinion.find(filter)
            .sort(sortOption)
            .limit(20)
            .limit(20)
            .populate('userId', 'username')
            .populate('commentsCount');

        // If anonymous, we need to hide the user info in the response logic, 
        // OR we can do it in the frontend. 
        // For now, let's map it to remove sensitive info if anonymous.
        const sanitizedOpinions = opinions.map(op => {
            const opObj = op.toObject();
            if (opObj.isAnonymous) {
                opObj.userId = null; // Hide user
            }
            return opObj;
        });

        res.json(sanitizedOpinions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOpinionById = async (req, res) => {
    try {
        const opinion = await Opinion.findById(req.params.id)
            .populate('userId', 'username')
            .populate('commentsCount');
        if (!opinion) return res.status(404).json({ message: 'Opinion not found' });

        // Increment views
        opinion.views += 1;
        await opinion.save();

        const opObj = opinion.toObject();
        if (opObj.isAnonymous) opObj.userId = null;

        res.json(opObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Interact (Like/Dislike/Helpful) - SIMPLIFIED for Day 2
exports.interactOpinion = async (req, res) => {
    // This requires more complex logic to prevent double voting etc.
    // For Day 2, let's just implement a simple increment for "helpful" as a demo
    try {
        const { type } = req.body; // 'helpful', 'notHelpful'
        const opinion = await Opinion.findById(req.params.id);

        if (!opinion) return res.status(404).json({ message: 'Opinion not found' });

        if (type === 'helpful') opinion.helpful += 1;
        if (type === 'notHelpful') opinion.notHelpful += 1;

        await opinion.save();
        res.json(opinion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
