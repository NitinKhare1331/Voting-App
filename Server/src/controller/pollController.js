import { createPollService, deletePollService, getAllPollService, voteOnPollService } from "../service/pollService.js";

export async function createPoll(req, res) {
    const { question, options } = req.body;

    try {
        const poll = await createPollService(question, options);
        req.io.emit('pollCreated', poll); // Emit event when a poll is created
        res.status(201).json(poll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getAllPolls (req, res) {
    try {
        const polls = await getAllPollService();
        res.json(polls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching polls' });
    }
};

export async function voteOnPoll(req, res) {
    const { id: pollId } = req.params;
    const { optionIndex } = req.body;

    try {
        const poll = await voteOnPollService(pollId, optionIndex);
        req.io.emit('pollUpdated', poll); // Emit event when a poll is updated with a vote
        res.json(poll);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getPollById(req, res) {
    const {id:id} = req.params;
    const poll = await getAllPollService(id);
    res.json(poll);
}

export async function deletePoll(req, res) {
    const {id:id} = req.params;
    const poll = await deletePollService(id)
    res.json(poll);
}