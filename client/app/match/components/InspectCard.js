import Map from './MatchMap';
import Link from 'next/link'
import TruncatedDescription from '@/app/components/TruncatedDescription/TruncatedDescription';
import styles from './InspectCard.module.css';
const InspectCard = ({report1, report2}) => {
    return (
        <div className={styles.matchContainer}>
            {/* report 1 */}
                <div className={styles.card}>
                    <Link
                        href={`/animal/${report1?._id}`}
                        className={styles.link}
                    >
                    <div className={styles.leftSection}>
                        <h1 className={styles.cardTitle}>{report1?.animal?.name}</h1>

                        <div className={styles.imageWrapper}>
                            <img
                            src={report1?.animal?.imageUrl}
                            className={styles.imageBorder}
                            alt={report1?.animal?.name}
                            />
                        </div>

                        <TruncatedDescription
                            description={report1?.description || "No description available"}
                            className={styles.description}
                        />
                    </div>

                    <div className={styles.rightSection}>
                        <div className={styles.listGroup}>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Status:</span>
                                <span className={styles.statusBadge}>
                                    {report1?.reportType}
                                </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Species:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.species}
                                </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Breed:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.breed || "Unknown"}
                                </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Color:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.color || "Unknown"}
                            </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Gender:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.gender}
                                </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Fixed:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.fixed ? "Yes" : "No"}
                                </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Collar:</span>
                                <span className={styles.value}>
                                    {report1?.animal?.collar ? "Yes" : "No"}
                            </span>
                            </div>
                            <div className={styles.listGroupItem}>
                                <span className={styles.label}>Date Reported:</span>
                                <span className={styles.value}>
                                    {report1?.dateReported
                                    ? new Date(report1.dateReported).toLocaleString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        }
                                        )
                                    : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                    </Link>
                </div>
            
            {/* map */}
            <Map className={styles.mapContainer} report1={report1} report2={report2}/>

            {/* report 2 */}
            <div className={styles.card}>
                <Link
                    href={`/animal/${report1?._id}`}
                    className={styles.link}
                >
                <div className={styles.leftSection}>
                    <h1 className={styles.cardTitle}>{report2?.animal?.name}</h1>

                    <div className={styles.imageWrapper}>
                        <img
                        src={report2?.animal?.imageUrl}
                        className={styles.imageBorder}
                        alt={report2?.animal?.name}
                        />
                    </div>

                    <TruncatedDescription
                        description={report2?.description || "No description available"}
                        className={styles.description}
                    />
                </div>

                <div className={styles.rightSection}>
                    <div className={styles.listGroup}>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Status:</span>
                            <span className={styles.statusBadge}>
                                {report2?.reportType}
                            </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Species:</span>
                            <span className={styles.value}>
                                {report2?.animal?.species}
                            </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Breed:</span>
                            <span className={styles.value}>
                                {report2?.animal?.breed || "Unknown"}
                            </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Color:</span>
                            <span className={styles.value}>
                                {report2?.animal?.color || "Unknown"}
                        </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Gender:</span>
                            <span className={styles.value}>
                                {report2?.animal?.gender}
                            </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Fixed:</span>
                            <span className={styles.value}>
                                {report2?.animal?.fixed ? "Yes" : "No"}
                            </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Collar:</span>
                            <span className={styles.value}>
                                {report2?.animal?.collar ? "Yes" : "No"}
                        </span>
                        </div>
                        <div className={styles.listGroupItem}>
                            <span className={styles.label}>Date Reported:</span>
                            <span className={styles.value}>
                                {report2?.dateReported
                                ? new Date(report2.dateReported).toLocaleString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                    }
                                    )
                                : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                </Link>
            </div>
        </div>
    )
}

export default InspectCard;