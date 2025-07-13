import { Link } from "react-router-dom";

type Props = {
    to: string;
    className?: string;
    text: string;
    onClick?: () => Promise<void>;
};

const NavigationLink = (props: Props) => {
    const defaultStyle =
        "font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-colors duration-300 m-2 text-transform uppercase text-decoration-none tracking-normal";

    return (
        <Link
            to={props.to}
            className={`${defaultStyle} ${props.className ?? ""}`}
            onClick={props.onClick}>
            {props.text}
        </Link>
    );
};

export default NavigationLink;