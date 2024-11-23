import { useEffect, useState } from 'react';
import AnimalCard from './MatchCard'
import styles from '../MatchVote.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Map from './MatchMap';

const MatchVote = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allMatches, setAllMatches] = useState([]) // Store all matches
    const [displayedMatches, setDisplayedMatches] = useState([]) // Matches currently displayed
    const [currentIndex, setCurrentIndex] = useState(0);
    const [page, setPage] = useState(1) // Track pages for local pagination
    const limit = 1;

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
                setAllMatches(sortedMatches)

                // Show the first batch
                setDisplayedMatches(sortedMatches.slice(0, limit))
                setPage(1) // Reset page for display
            } else {
                setDisplayedMatches([])
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
            setAllMatches(updatedMatches);

        } catch (error) {
            console.log('failed geting match votes,', error);
        }
    }

    const loadMore = () => {
        const nextPage = page + 1
        const newDisplayedMatches = allMatches.slice(nextPage, limit)
        setDisplayedMatches(newDisplayedMatches)
        setPage(nextPage)
    }
    
    useEffect(() => {
        loadMatches();
    }, []);

    useEffect(() => {
        if (allMatches.length > 0) {
            getMatchVotes();
        }
    }, [allMatches]);

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
    return (
        <div>
            <div className={styles.titleContainer}>
                <h2 className={styles.heading}>Help us match these guys</h2>
            </div>
                <div className="row justify-content-center">
                    {displayedMatches.length > 0 ? (
                        displayedMatches.map(({ lostReport, strayReport, matchVotes }, index) => (
                            <div key={index} className={`col-12 col-lg-10 mb-4 ${styles.bigContainer}`}>
                                <div className={styles.container}>
                                    {/* Lost Report Card */}
                                    <div className={styles.card}>
                                        <AnimalCard
                                            report_id={lostReport._id}
                                            animal_id={lostReport.animal._id}
                                            name={lostReport.animal.name}
                                            image={lostReport.animal.imageUrl}
                                            species={lostReport.animal.species}
                                            gender={lostReport.animal.gender}
                                            state={lostReport.location?.address}
                                            description={lostReport.description}
                                        />
                                    </div>

                                    <Map report1={lostReport} report2={strayReport}/>

                                    {/* stray Report Card */}
                                    <div className={styles.card}>
                                        <AnimalCard
                                            report_id={strayReport._id}
                                            animal_id={strayReport.animal._id}
                                            name={strayReport.animal.name}
                                            image={strayReport.animal.imageUrl}
                                            species={strayReport.animal.species}
                                            gender={strayReport.animal.gender}
                                            state={strayReport.location?.address}
                                            description={strayReport.description}
                                        />
                                    </div>
                                    
                                </div>
                                <div className={styles.centerContainer}>
                                    <p>Are the two images the same animal?</p>
                                    <div className={styles.buttonContainer}>
                                        <FontAwesomeIcon 
                                            icon={faCircleCheck}
                                            onClick={() => handleClick({lostReport, strayReport, vote: 'yes'})}
                                            className={styles.iconCheckButton}
                                        />
                                        <FontAwesomeIcon 
                                            icon={faCircleXmark}
                                            onClick={() => handleClick({lostReport, strayReport, vote: 'no'})}
                                            className={styles.iconXButton}
                                        />
                                    </div>
                                </div>
                                <div>
                                    {matchVotes ? (
                                    <div>
                                        <div style= {{textAlign:'center'}}>
                                            <h2 className="mb-0 font-weight-bold">
                                                {`${matchVotes.yes} : ${matchVotes.no}`}
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
                                            now={(matchVotes.yes / (matchVotes.yes + matchVotes.no)) * 100
                                            }
                                            />
                                            <ProgressBar
                                            striped
                                            variant="danger"
                                            now={(matchVotes.no / (matchVotes.yes + matchVotes.no)) * 100
                                            }
                                            />
                                        </ProgressBar>
                                    </div>
                                    ) : (
                                        <ProgressBar 
                                            striped
                                            // className={styles.grayBar}
                                            now={100}
                                        />
                                    )}
                                </div>
                            </div> 
                        ))
                    ) : (
                        <p className="text-center">No matches found.</p>
                    )}
                </div>
            
            {displayedMatches.length < allMatches.length && (
                <div className="text-center my-4">
                    <button
                        onClick={loadMore}
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default MatchVote;