import AnimalCard from '@/app/components/cards/AnimalCard'

const Matches = ({ matches = [] }) => {
    if (!matches || matches.length === 0) {
        return <p>No matches found.</p>;
    }

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                {matches.map(({ report1, report2, score }, index) => (
                    <div key={index} className="col-12 col-lg-10 mb-4">
                        <div className="card shadow-sm p-3">
                            <div className="row align-items-center">
                                <div className="col-md-5">
                                    <AnimalCard
                                        report_id={report1._id}
                                        animal_id={report1.animal._id}
                                        name={report1.animal.name}
                                        image={report1.animal.imageUrl}
                                        species={report1.animal.species}
                                        gender={report1.animal.gender}
                                        state={report1.location.address}
                                        description={report1.description}
                                    />
                                </div>
                                <div className="col-md-2 text-center">
                                    <h2 className="mb-0 font-weight-bold">
                                        {Math.round(score * 100)}%
                                    </h2>
                                </div>
                                <div className="col-md-5">
                                    <AnimalCard
                                        report_id={report2._id}
                                        animal_id={report2.animal._id}
                                        name={report2.animal.name}
                                        image={report2.animal.imageUrl}
                                        species={report2.animal.species}
                                        gender={report2.animal.gender}
                                        state={report2.location.address}
                                        description={report2.description}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Matches
