import ReadMoreById from "../../components/Miscellaneous/ReadMoreById";

const StrayDetailsPage = ({ id }) => {
    const { id } = id;

    return (
        <div>
            <ReadMoreById id={id} />;
        </div>
    )
}

export default StrayDetailsPage;