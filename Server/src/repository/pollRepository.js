import Poll from '../schema/poll.js';

export const createPoll = async (data) => {
    try {
        const newPoll = await Poll.create(data);
        return newPoll;
    } catch (error) {
        console.error('Error creating poll:', error.message);
    }
}

export const findAllPolls = async () => {
    return await Poll.find();
}

export const findPollById = async (pollId) => {
    return await Poll.findById(pollId);
    }

export const updatePoll = async (poll) => {
    return await poll.save();
}

export const deletePoll = async (pollId) => {
    return await Poll.deleteOne({ _id: pollId })
}