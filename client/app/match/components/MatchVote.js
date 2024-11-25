import { useEffect, useState } from 'react';
import AnimalCard from './MatchCard'
import useAuth from "@/app/hooks/useAuth";
import styles from '../MatchVote.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Map from './MatchMap';

const MatchVote = () => {
    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [allMatches, setAllMatches] = useState([]) // Store all matches
    const [allMatchesWithId, setAllMatchesWithId] = useState([])
    const [unvotedMatchIds, setUnvotedMatchIds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const loadMatches = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/match/high`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            )

            if (!response.ok) {
                console.error('Failed to load matches:', response.statusText)
                return
            }

            const data = await response.json()

            if (data.matches.length > 0) {
                // Sort matches by score in descending order
                const sortedMatches = data.matches.sort(
                    (a, b) => b.score - a.score
                )
                setAllMatches(sortedMatches);
            }

        } catch (error) {
            console.error('Error loading matches:', error)
        } finally {
            setIsLoading(false)
        }
    };

    const getMatchVotes = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/match-votes/`);
            const data = await response.json();
            const updatedMatches = allMatches.map(match => {
                const matchVote = data.find(vote =>  {
                    return (
                        (vote.report1._id === match.lostReport._id && vote.report2._id === match.strayReport._id) ||
                        (vote.report1._id === match.strayReport._id && vote.report2._id === match.lostReport._id)
                    )
                });
                if (matchVote) {
                    return {
                        ...match,
                        id: matchVote._id,
                        matchVotes: {
                            yes: matchVote.yes,
                            no: matchVote.no
                        }
                    };
                } else {
                    return {
                        ...match,
                        matchVotes: {
                            yes: 0,
                            no: 0
                        }
                    };
                };
            });
            if (JSON.stringify(updatedMatches) !== JSON.stringify(allMatches)) {
                setAllMatchesWithId(updatedMatches);
                // console.log(updatedMatches);
            }

        } catch (error) {
            console.log('failed geting match votes,', error);
        }
    }

    const checkForOverlaps = (allMatches, user) => {
        if(user){
            // Iterate over allMatches
            allMatches.forEach((match) => {
                // Check if match.id exists in user.matchVotes
                const isVoted = user.matchVotes.some(vote => vote.matchVotesId === match.id);
                
                // console.log(match.id);
                // If no overlap, push match to unvotedMatchIds
                if (!isVoted) {
                    // console.log('hello');
                    setUnvotedMatchIds(prev => [...prev, match]);
                }
            });
        } else {
            setUnvotedMatchIds(allMatches);
        }
    }

    useEffect(() => {
        loadMatches();
    }, []);

    useEffect(() => {
        if (allMatches.length > 0) {
            getMatchVotes();
        }
    }, [allMatches]);

    useEffect(() => {
        checkForOverlaps(allMatchesWithId, user);
    }, [user, isAuthenticated, allMatchesWithId]);

    const handleClick = async ({lostReport, strayReport, vote}) => {
        try {
            const sendData = {
                report1: lostReport._id,
                report2: strayReport._id,
                vote
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/match-votes/`,
                {
                    method: 'POST',
                    body: JSON.stringify(sendData),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                }
            )

            const status = response.status;
            if(status === 201){
                alert('vote successfully changed');
            }
            else if(status === 202){
                alert('vote successfully casted');
            }
            else if(status === 401){
                alert('login first');
            }
            else if(status === 402){
                alert('already casted this vote');
            }

        } catch (error) {
            console.log("failed to create match,", error);
        }
    }

    const LoadNext = () => {
        setCurrentIndex(currentIndex + 1);
    }

    if (isLoading || allMatches.length === 0) {
        return <div>Loading...</div>; // Loading indicator until data is available
    }
    const currentMatch = unvotedMatchIds[currentIndex];

    // console.log(unvotedMatchIds);

    return (
        <div>
            {currentIndex < unvotedMatchIds.length ? (
                <div>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.heading}>Help us match these guys</h2>
                    </div>
                    <div className="row justify-content-center">
                        <div className={`col-12 col-lg-10 mb-4 ${styles.bigContainer}`}>
                            <div className={styles.container}>
                                {/* Report1 Card */}
                                <div className={styles.card}>
                                    <AnimalCard
                                        report_id={currentMatch.lostReport._id}
                                        name={currentMatch.lostReport.animal.name}
                                        image={currentMatch.lostReport.animal.imageUrl}
                                    />
                                </div>

                                <Map report1={currentMatch.lostReport} report2={currentMatch.strayReport}/>

                                {/* Report2 Card */}
                                <div className={styles.card}>
                                    <AnimalCard
                                        report_id={currentMatch.strayReport._id}
                                        name={currentMatch.strayReport.animal.name}
                                        image={currentMatch.strayReport.animal.imageUrl}
                                    />
                                </div>
                            </div>
                            <div className={styles.centerContainer}>
                                <p>Are the two images the same animal?</p>
                                <div className={styles.buttonContainer}>
                                    <FontAwesomeIcon 
                                        icon={faCircleCheck}
                                        onClick={() => handleClick({lostReport: currentMatch.lostReport, strayReport: currentMatch.strayReport, vote: 'yes'})}
                                        className={styles.iconCheckButton}
                                    />
                                    <FontAwesomeIcon 
                                        icon={faCircleXmark}
                                        onClick={() => handleClick({lostReport: currentMatch.lostReport, strayReport: currentMatch.strayReport, vote: 'no'})}
                                        className={styles.iconXButton}
                                    />
                                </div>
                                <div style={{ width: '100%', margin: '0 auto' }}>
                                    {currentMatch.matchVotes && (
                                    <div>
                                        <div style= {{textAlign:'center'}}>
                                            <h2 className="mb-0 font-weight-bold">
                                                {`${currentMatch.matchVotes.yes} : ${currentMatch.matchVotes.no}`}
                                            </h2>
                                            <p className="text-muted">
                                                Yes : No
                                            </p>
                                        </div>
                                        <ProgressBar
                                            max={100}
                                        >
                                            <ProgressBar
                                            striped
                                            variant="success"
                                            now={(currentMatch.matchVotes.yes / (currentMatch.matchVotes.yes + currentMatch.matchVotes.no)) * 100
                                            }
                                            />
                                            <ProgressBar
                                            striped
                                            variant="danger"
                                            now={(currentMatch.matchVotes.no / (currentMatch.matchVotes.yes + currentMatch.matchVotes.no)) * 100
                                            }
                                            />
                                        </ProgressBar>
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {currentIndex < allMatches.length && (
                        <div className="text-center my-4">
                            <button
                                onClick={LoadNext}
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>There are no more pets to match! Thanks for helping us match all the pets!</p>
            )}
        </div>
    );
}

export default MatchVote;