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
        const unsure = vote === 'unsure' ? 1 : 0;

        const matchVotesData = {
            report1,
            report2,
            yes,
            no,
            unsure,
        }

        const matchVotes = new MatchVotes(matchVotesData);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.matchVotes.push({ matchVotesId: matchVotes._id, vote});
        await matchVotes.save();
        await user.save();

        // Add Notification Logic
        if (matchVotes.yes >= 10) {
            const report1Owner = await Report.findById(report1).populate("reportedBy");
            const report2Owner = await Report.findById(report2).populate("reportedBy");

            await createNotification({
                userId: report1Owner.reportedBy._id,
                message: "Your post has been matched with another post by 10+ users.",
                type: "match",
                meta: { reportId1: report1, reportId2: report2 },
                isPinned: true,
            });

            await createNotification({
                userId: report2Owner.reportedBy._id,
                message: "Your post has been matched with another post by 10+ users.",
                type: "match",
                meta: { reportId1: report1, reportId2: report2 },
                isPinned: true,
            });
        }

        res.status(202).json({ matchVotes });

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
            console.log(vote, user.matchVotes[userVoteIndex].vote)
            const previousVote = user.matchVotes[userVoteIndex].vote;

            if (previousVote === vote) { // don't need to update vote bc is same (could honestly just -- prev vote instead of checking, but w/e)
                return res.status(402).json({ message: 'you have already cast this vote' });
            }

            const OGVote = user.matchVotes[userVoteIndex].vote;
            user.matchVotes[userVoteIndex].vote = vote; // change vote on User schema

            if (vote === 'yes') { // change vote on MatchVotes schema
                if(OGVote === 'no') {
                    existingMatch.yes++;
                    existingMatch.no = Math.max(existingMatch.no - 1, 0);
                } else {
                    existingMatch.yes++;
                    existingMatch.unsure = Math.max(existingMatch.unsure - 1, 0);
                }
            } else if (vote === 'no') {
                if(OGVote === 'yes') {
                    existingMatch.no++;
                    existingMatch.yes = Math.max(existingMatch.yes - 1, 0);
                } else {
                    existingMatch.no++;
                    existingMatch.unsure = Math.max(existingMatch.unsure - 1, 0);
                }
            } else if (vote === 'unsure') {
                if(OGVote === 'yes') {
                    existingMatch.unsure++;
                    existingMatch.yes = Math.max(existingMatch.yes - 1, 0);
                } else {
                    existingMatch.unsure++;
                    existingMatch.no = Math.max(existingMatch.no - 1, 0);
                }
            } else { // remove vote to be added 
                return res.status(400).json({ message: 'invalid vote' });
            }

            await user.save(); // save changes
            await existingMatch.save();

            res.status(201).json({ message: 'vote changed successfully' });
        } else { // didn't vote yet
            if (vote === 'yes') { // cast vote
                existingMatch.yes++;
            } else if (vote === 'no') {
                existingMatch.no++;
            } else if (vote === 'unsure') {
                existingMatch.unsure++;
            } else { // remove vote to be added 
                return res.status(400).json({ message: 'invalid vote' });
            }

            user.matchVotes.push({ matchVotesId: matchVotesId, vote }); // add to User schema the matchVotes that they casted vote for
            await user.save(); // save changes
            await existingMatch.save();
            res.status(202).json({ message: 'vote casted successfully' });
        }

    } catch (err) {
        res.status(500).json({ error: 'failed to fetch matches', details: err.message });

    };

};

const getVotingCompletion = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ hasUnvotedMatches: false, message: "User not authenticated" });
    }
    
    try {
        const allHighMatches = await MatchVotes.find().select('_id'); // Fetch all match IDs
        const userVotedMatchIds = req.user.matchVotes.map(vote => vote.matchVotesId.toString()); // User's voted match IDs

        const allMatchIds = allHighMatches.map(match => match._id.toString()); // Extract all match IDs
        const unvotedMatches = allMatchIds.filter(id => !userVotedMatchIds.includes(id)); // Matches the user hasn't voted on

        const hasUnvotedMatches = unvotedMatches.length > 0; // Determine if there are remaining votes
        res.status(200).json({ hasUnvotedMatches });
    } catch (err) {
        console.error('Error fetching voting completion status:', err);
        res.status(500).json({ message: 'Failed to fetch voting completion status' });
    }
};

module.exports = { getMatchVotes, createMatchVotes, updateMatchVotes, getVotingCompletion };