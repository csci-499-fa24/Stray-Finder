import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './MatchCard.css';

const AnimalCard = ({ report_id, animal_id, name, username, image, species, gender, state, description }) => {
    const currentPath = usePathname();

    return (
        <div>
            <Link href={`/animal/${report_id}?from=${currentPath}`} className="card-link">
            <div className="card">
                <div className='image-container'>
                    <img
                        className='image'
                        src={image || '/paw-pattern.jpg'}
                        alt={name}
                        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Card Bottom Section */}
                <div className="card-bottom">
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                    </div>
                </div>
            </div>
            </Link>
        </div>
    );
};

export default AnimalCard;
