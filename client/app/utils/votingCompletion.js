const checkVotingCompletion = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/match-votes/completion`, {
            credentials: 'include', // Include authentication cookie
        });

        if (response.status === 401) {
            console.warn("User not authenticated. Skipping voting completion check.");
            return false; // Gracefully handle unauthenticated state
        }

        if (!response.ok) {
            throw new Error('Failed to fetch voting completion status');
        }

        const data = await response.json();
        return data.hasUnvotedMatches; // Returns true or false
    } catch (err) {
        console.error('Error checking voting completion status:', err);
        return false; // Default to no unvoted matches on error
    }
};

export default checkVotingCompletion;
