import Link from 'next/link';

const StrayCard = ({ id, name, image, species, breed, gender, state, description }) => (
    <div className="col">
        <div className="card m-3 p-0">
            {/* Container for the image to maintain square aspect ratio */}
            <div className="img-container">
                <img src={image} className="card-img-top" alt={name} />
            </div>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Species: {species}</li>
                <li className="list-group-item">Gender: {gender}</li>
                <li className="list-group-item">State: {state}</li>
            </ul>
            <div className="card-body">
                <Link href={`/animal/${id}`} className="card-link">
                    Read More
                </Link>
            </div>
        </div>
    </div>
);

export default StrayCard;
