const StrayCard = ({ id, name, image, breed, gender, state, description }) => (
    <div className="col">
        <div className="card m-3 p-0">
            <img src={image} className="card-img-top" alt={name} />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Breed: {breed}</li>
                <li className="list-group-item">Gender: {gender}</li>
                <li className="list-group-item">State: {state}</li>
            </ul>
            <div className="card-body">
                <a href="#" className="card-link">
                    Read More
                </a>
                <a href="#" className="card-link">
                    Request location
                </a>
            </div>
        </div>
    </div>
)

export default StrayCard