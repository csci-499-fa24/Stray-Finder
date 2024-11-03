import Image from "next/image";
import penIcon from "./pen.png";

const PenIcon = ({ length = 30}) => (
    <Image
        src={penIcon}
        alt="Pen Icon"
        width={length}
        height={length}
        priority
    />
);

export default PenIcon;