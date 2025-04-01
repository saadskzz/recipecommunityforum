import Discussion from '../Models/DiscussionForum.js';

const createDiscussion = async (req, res) => {
    const {discussionCategory} = req.body
    try {

        const discussion = new Discussion({discussionCategory});
        await discussion.save();
        res.status(201).json({discussion});
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
};

const getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find({});
        res.status(200).send(discussions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a discussion by ID
const getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).send();
        }
        res.status(200).send(discussion);
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findByIdAndDelete(req.params.id);
        if (!discussion) {
            return res.status(404).send();
        }
        res.status(200).send(discussion);
    } catch (error) {
        res.status(500).send(error);
    }
};

const initializeDiscussionCategories = async (req, res) => {
    console.log('Initializing discussion categories...');
    const categories = ["General", "Cooking", "Diet", "Nutrition", "Recipe"];
    try {
        const existingCategories = await Discussion.find({
            discussionCategory: { $in: categories }
        });
        console.log('Existing categories:', existingCategories);

        const existingCategoryNames = existingCategories.map(cat => cat.discussionCategory);
        const newCategories = categories.filter(cat => !existingCategoryNames.includes(cat));

        console.log('New categories to insert:', newCategories);

        const discussions = await Discussion.insertMany(
            newCategories.map(category => ({ discussionCategory: category }))
        );

        console.log('Inserted discussions:', discussions);

        res.status(201).json({
            message: "Categories initialized successfully",
            discussions
        });
    } catch (error) {
        console.error('Error initializing categories:', error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

export { 
    createDiscussion, 
    getAllDiscussions, 
    getDiscussionById, 
    deleteDiscussionById, 
    initializeDiscussionCategories 
};
