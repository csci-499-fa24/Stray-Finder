const MatchVotes = require('../models/MatchVotes');
const User = require('../models/user');

const getMatchVotes = async (req, res) => {
    try {
        const matches = await MatchVotes.find().populate(['report1', 'report2']);
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json({ error: 'failed to fetch matches', details: err.message });
    }
    
}

const createMatchVotes = async (req, res) => {
    const { report1, report2, vote } = req.body; 
    
    if (!report1 || !report2 || !vote){
        return res.status(400).json({ message: 'missing required fields' });
    }

    try {
        const existingMatch = await MatchVotes.findOne({
            $or: [
                { report1: report1, report2: report2 },
                { report1: report2, report2: report1 }
            ]
        });

        if (existingMatch) {
            return updateMatchVotes(req, res, existingMatch._id, vote);
        }

        const yes = vote === 'yes' ? 1 : 0;
        const no = vote === 'no' ? 1 : 0;

        const matchVotesData = {
            report1,
            report2,
            yes,
            no,
        }

        const matchVotes = new MatchVotes(matchVotesData);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.matchVotes.push({ matchVotesId: matchVotes._id, vote});
        await matchVotes.save();
        await user.save();
        res.status(200).json({ matchVotes });

    }
    catch (err) {
        res.status(500).json({ error: 'failed to create match vote', details: err.message });
    }
}

const updateMatchVotes = async (req, res, matchVotesId, vote) => {
    if (!matchVotesId || !vote) {
        return res.status(400).json({ message: 'missing required fields' });
    }

    const existingMatch = await MatchVotes.findById(matchVotesId); // check if votes for that match exist
    if (!existingMatch) {
        return res.status(404).json({ message: 'matchVotes not found' });
    }

    const user = await User.findById(req.user.id); // check if user
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const userVoteIndex = user.matchVotes.findIndex(vote => vote.matchVotesId.toString() === matchVotesId.toString());
        if (userVoteIndex !== -1) { // already voted
            const previousVote = user.matchVotes[userVoteIndex].vote;

            if (previousVote === vote) { // don't need to update vote bc is same (could honestly just -- prev vote instead of checking, but w/e)
                return res.status(400).json({ message: 'you have already cast this vote' });
            }

            user.matchVotes[userVoteIndex].vote = vote; // change vote on User schema

            if (vote === 'yes') { // change vote on MatchVotes schema
                existingMatch.yes++;
                existingMatch.no = Math.max(existingMatch.no - 1, 0);
            } else if (vote === 'no') {
                existingMatch.no++;
                existingMatch.yes = Math.max(existingMatch.yes - 1, 0);
            } else { // remove vote to be added 
                return res.status(400).json({ message: 'invalid vote' });
            }

            await user.save(); // save changes
            await existingMatch.save();

            res.status(200).json({ message: 'vote changed successfully' });
        } else { // didn't vote yet
            if (vote === 'yes') { // cast vote
                existingMatch.yes++;
            } else if (vote === 'no') {
                existingMatch.no++;
            }

            user.matchVotes.push({ matchVotesId: matchVotesId, vote }); // add to User schema the matchVotes that they casted vote for
            await user.save(); // save changes
            await existingMatch.save();
            res.status(200).json({ message: 'vote casted successfully' });
        }

    } catch (err) {
        res.status(500).json({ error: 'failed to fetch matches', details: err.message });

    };

};

module.exports = { getMatchVotes, createMatchVotes, updateMatchVotes };