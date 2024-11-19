import { useEffect, useState } from 'react';
import AnimalCard from '@/app/components/cards/AnimalCard'
import styles from '../MatchVote.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
//npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons

const MatchVote = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allMatches, setAllMatches] = useState([]) // Store all matches
    const [displayedMatches, setDisplayedMatches] = useState([]) // Matches currently displayed
    const [page, setPage] = useState(1) // Track pages for local pagination
    const limit = 20;
    const [matchVotes, setMatchVotes] = useState([]);

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
            // console.log('Fetched matches:', data.matches)

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
            // console.log(data);
            setMatchVotes(data.map(item => [item.yes, item.no]));
        } catch (error) {
            console.log('failed geting match votes,', error);
        }
    }

    const loadMore = () => {
        const nextPage = page + 1
        const newDisplayedMatches = allMatches.slice(0, nextPage * limit)
        setDisplayedMatches(newDisplayedMatches)
        setPage(nextPage)
    }
    
    useEffect(() => {
        loadMatches();
        getMatchVotes();
    }, []);

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
            const data = await response.json();
            // console.log('Response data:', data);

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
    // console.log(matchVotes);
    return (
        <div>
            <div className={styles.titleContainer}>
                <h2 className={styles.heading}>Help us match these guys</h2>
            </div>
                <div className="row justify-content-center">
                    {displayedMatches.length > 0 ? (
                        displayedMatches.map(({ lostReport, strayReport, score }, index) => (
                            matchVotes && matchVotes[index] ? (
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

                                    {/* Match Score */}
                                    <div className="col-md-2 text-center">
                                        <h2 className="mb-0 font-weight-bold">
                                            {Math.round(score * 100)}%
                                        </h2>
                                        <p className="text-muted">
                                            Match Score
                                        </p>
                                    </div>

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
                                    <h2>Are the two images the same animal?</h2>
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
                                    <div style= {{textAlign:'center'}}>
                                        <h2 className="mb-0 font-weight-bold">
                                            {`${matchVotes[index][0]} : ${matchVotes[index][1]}`}
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
                                        now={(matchVotes[index][0] / (matchVotes[index][0] + matchVotes[index][1])) * 100}
                                        />
                                        <ProgressBar
                                        striped
                                        variant="danger"
                                        now={(matchVotes[index][1] / (matchVotes[index][0] + matchVotes[index][1])) * 100}
                                        />
                                    </ProgressBar>
                                        {/* <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${matchVotes[index][0]}%` }}
                                        aria-valuenow={matchVotes[index][0]}
                                        aria-valuemin="0"
                                        aria-valuemax={matchVotes[index][0]+matchVotes[index][1]}
                                        ></div> */}
                                </div>
                            </div> 
                            ) : (
                                'Loading...'
                            )
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