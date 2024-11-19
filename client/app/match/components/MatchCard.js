import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaEllipsisV, FaCommentDots } from 'react-icons/fa';
import CommentModal from '../../components/comments/CommentModal';
import './AnimalDropdown.css';

const AnimalCard = ({ report_id, animal_id, name, username, image, species, gender, state, description }) => {
    const currentPath = usePathname();

    return (
        <div className="col position-relative">
            <div className="card m-3 p-0">
                <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
                    <img
                        src={image || '/paw-pattern.jpg'}
                        alt={name}
                        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Card Bottom Section */}
                <div className="card-bottom">
                    <div className="card-body">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">{description}</p>
                    </div>
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <Link href={`/animal/${report_id}?from=${currentPath}`} className="card-link">
                            Read More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalCard;
