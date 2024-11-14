import { createPoll, deletePoll, findAllPolls, findPollById, updatePoll } from "../repository/pollRepository.js";

export const createPollService = async (question, options) => {
    if (options.length !== 4) {
        throw new Error('A poll must have exactly four options.');
    }

    const pollOptions = options.map(option => ({ text: option, votes: 0 }));

    return await createPoll({ question, options: pollOptions });
}

export const getAllPollService = async () => {
    return await findAllPolls();
}
// Function to find the poll by ID and validate options
export const voteOnPollService = async (pollId, optionIndex) => {
    const poll = await findPollById(pollId);

    if (!poll) {
        throw new Error('Poll not found');
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
        throw new Error('Invalid option index');
    }

    // Increment the vote count for the selected option
    poll.options[optionIndex].votes += 1;
    
    // Save the updated poll
    return await updatePoll(poll);
}


export const getPollByIdService = async (id) => {
    return await findPollById(id);
}

export const deletePollService = async (id) => {
    return await deletePoll({_id: id});
}
