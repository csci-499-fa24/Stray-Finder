import { useEffect, useState } from 'react';
import AnimalCard from './MatchCard';
import InspectCard from './InspectCard';
import useAuth from "@/app/hooks/useAuth";
import toast from 'react-hot-toast';
import styles from '../MatchVote.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleQuestion, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Map from './MatchMap';

const MatchVote = () => {
    const { isAuthenticated, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [allMatches, setAllMatches] = useState([]) // Store all matches
    const [allMatchesWithId, setAllMatchesWithId] = useState([])
    const [unvotedMatchIds, setUnvotedMatchIds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [isInspect, setIsInspect] = useState(false);

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
            // console.log(data);
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
                        (vote.report1._id === match.report1._id && vote.report2._id === match.report2._id) ||
                        (vote.report1._id === match.report2._id && vote.report2._id === match.report1._id)
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
            const unvotedMatches = allMatches.filter(match =>
                !user.matchVotes.some(vote => vote.matchVotesId === match.id)
            );
            setUnvotedMatchIds(unvotedMatches);

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

    const handleClick = async ({report1, report2, vote}) => {
        try {
            const sendData = {
                report1: report1._id,
                report2: report2._id,
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
                toast.success('vote successfully changed', {
                    duration: 2000,
                });
                setCurrentIndex(currentIndex + 1);
            }
            else if(status === 202){
                toast.success('vote successfully casted', {
                    duration: 2000,
                });
                setCurrentIndex(currentIndex + 1);
            }
            else if(status === 401){
                toast.error('must be logged in to vote', {
                    duration: 2000,
                });
            }
            else if(status === 402){
                toast.error('same vote already casted', {
                    duration: 2000,
                });
            }

        } catch (error) {
            console.log("failed to create match,", error);
        }
    }

    // const handleInspectClick = (state) => {
    //     toast.success('toggled inspect', {
    //         duration: 1000,
    //     });
    //     console.log(isInspect);
    //     setIsInspect(state);
    // }

    const LoadPrev = () => {
        setCurrentIndex(currentIndex - 1);
    }

    const LoadNext = () => {
        setCurrentIndex(currentIndex + 1);
    }

    const LoadFirst = () => {
        setCurrentIndex(0);
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
                        <p className={styles.p}>
                            These animals have a high probability to be the same pet based on our algorithm.
                            Would you help us and pet owners by comparing the images and voting if you think the two pets could be the same?
                        </p>
                    </div>
                    <div className={styles.centerContainer2}>
                        <button
                            onClick={LoadPrev}
                            className={styles.loadButton}
                            disabled={isLoading || currentIndex <= 0}
                        >
                            {isLoading ? 'Loading...' : 'Load Prev'}
                        </button>
                        <p>Match {currentIndex + 1} of {unvotedMatchIds.length}</p>
                        <button
                            onClick={LoadNext}
                            className={styles.loadButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Load Next'}
                        </button>
                    </div>
                    <div className="row justify-content-center">
                        <div className={`col-12 col-lg-10 mb-4 ${styles.bigContainer}`}>
                                <div>
                                    {/* <FontAwesomeIcon 
                                        icon={faMagnifyingGlass}
                                        onClick={() => handleInspectClick(false)}
                                        className={styles.iconInspectButton}
                                    /> */}
                                    <InspectCard report1={currentMatch?.report1} report2={currentMatch?.report2}/>
                                </div>
                            <div className={styles.centerContainer}>
                                <p>Are the two images the same animal?</p>
                                <div className={styles.buttonContainer}>
                                    <FontAwesomeIcon 
                                        icon={faCircleCheck}
                                        onClick={() => handleClick({report1: currentMatch.report1, report2: currentMatch.report2, vote: 'yes'})}
                                        className={styles.iconCheckButton}
                                    />
                                    <FontAwesomeIcon 
                                        icon={faCircleXmark}
                                        onClick={() => handleClick({report1: currentMatch.report1, report2: currentMatch.report2, vote: 'no'})}
                                        className={styles.iconXButton}
                                    />
                                    <FontAwesomeIcon 
                                        icon={faCircleQuestion}
                                        onClick={() => handleClick({report1: currentMatch.report1, report2: currentMatch.report2, vote: 'unsure'})}
                                        className={styles.iconQuestionButton}
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
                                        {currentMatch.matchVotes.yes || currentMatch.matchVotes.no ? (
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
                                        ) : (
                                            <ProgressBar
                                                max={ 100 }
                                            >
                                                <ProgressBar
                                                striped
                                                variant="success"
                                                now={ 50 }
                                                />
                                                <ProgressBar
                                                striped
                                                variant="danger"
                                                now={ 50 }
                                                />
                                            </ProgressBar>
                                        )}
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.heading}>Thanks</h2>
                        <p className={styles.p}>
                            There are no more pets to match! Thanks for helping us match all the pets!
                        </p>
                    </div>
                    <div className={styles.centerContainer2}>
                        <button
                                onClick={LoadPrev}
                                className={styles.loadButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Load Prev'}
                            </button>
                        <button
                            onClick={LoadFirst}
                            className={styles.loadButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Load First'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchVote;
