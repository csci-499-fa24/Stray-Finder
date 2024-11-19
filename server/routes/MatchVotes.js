const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getMatchVotes, createMatchVotes, updateMatchVotes } = require('../controllers/MatchVotes');

router
    .route('/')
    .get(getMatchVotes)
    .post(authenticate, createMatchVotes)
    .put(authenticate, updateMatchVotes)

module.exports = router