import express from 'express';
import { createPoll, deletePoll, getAllPolls, voteOnPoll } from '../controller/pollController.js';

const router = express.Router();

router.post('/poll/create', createPoll)

router.post('/poll/:id/vote', voteOnPoll)

router.get('/polls', getAllPolls);

router.delete('/poll/:id/delete', deletePoll);

export default router;