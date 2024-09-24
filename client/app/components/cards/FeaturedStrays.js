import StrayCard from './StrayCard'

const FeaturedStrays = () => (
    <div className="container text-end">
        <div className="text-center h2 p-3">Featured Strays</div>
        <hr />
        <div className="dropdown">
            <a
                className="btn btn-secondary dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Sort By
            </a>
            <ul className="dropdown-menu">
                <li>
                    <a className="dropdown-item" href="#">
                        Nearby
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Most recent
                    </a>
                </li>
                <li>
                    <a className="dropdown-item" href="#">
                        Filter
                    </a>
                </li>
            </ul>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 justify-content-center p-2 text-start">
            <StrayCard
                name="Goofy"
                image="https://i.ytimg.com/vi/t2HA0InztEg/maxresdefault.jpg"
                breed="Tabby"
                gender="Male"
                state="Stable"
                description="Saw this cute cat on my walk home"
            />
            {/* Repeat or map over data */}
        </div>
    </div>
)

export default FeaturedStrays