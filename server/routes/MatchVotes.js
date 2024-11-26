const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getMatchVotes, createMatchVotes, updateMatchVotes, getVotingCompletion } = require('../controllers/MatchVotes');

router.get('/completion', authenticate, getVotingCompletion);

router
    .route('/')
    .get(getMatchVotes)
    .post(authenticate, createMatchVotes)
    .put(authenticate, updateMatchVotes)

module.exports = router