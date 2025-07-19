import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/");
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#10151c] text-white text-center px-4">
            <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-6"
            >
                <circle cx="60" cy="60" r="58" stroke="#1976d2" strokeWidth="4" fill="#18202b" />
                <text x="50%" y="54%" textAnchor="middle" fill="#1976d2" fontSize="48" fontWeight="bold" dy=".3em">?</text>
            </svg>
            <h1 className="text-6xl font-bold m-0">404</h1>
            <h2 className="text-2xl mt-4 mb-2 font-semibold">Page Not Found</h2>
            <p className="text-slate-300 text-base mb-8 max-w-md mx-auto">
                Sorry, the page you are looking for does not exist, has been moved, or the URL is incorrect.<br />
                Please check the address or return to the homepage.
            </p>
            <button
                onClick={handleGoHome}
                className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-3 rounded-lg font-semibold text-white text-base shadow-lg"
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;
