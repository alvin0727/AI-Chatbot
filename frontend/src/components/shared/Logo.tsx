import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <div className="flex items-center mr-auto gap-2">
            <Link to="/" className="flex items-center gap-2">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-12 h-12 inverted"
                />
                <span className="hidden md:block font-extrabold mr-auto drop-shadow-[2px_2px_20px_#000]">
                    <span className="text-[20px]">MERN</span>-GPT
                </span>
            </Link>
        </div>
    );
}

export default Logo;