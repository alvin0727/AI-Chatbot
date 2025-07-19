import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const handleStartChat = () => {
        navigate("/chat");
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#10151c] to-[#1e293b] flex flex-col items-center justify-center text-white px-4">
            <div className="bg-[#18202b]/85 rounded-2xl shadow-2xl px-6 py-10 max-w-md w-full text-center">
                <img
                    src="/logo.png"
                    alt="AI Chatbot Logo"
                    className="w-[70px] h-[70px] mb-6 rounded-full shadow-lg mx-auto"
                />
                <h1 className="text-4xl font-bold tracking-wide m-0">Welcome to AI Chatbot</h1>
                <p className="text-slate-300 text-lg mt-6 mb-8">
                    Your smart assistant for knowledge, business, technology, education, and more.<br />
                    Start chatting and explore the power of AI!
                </p>
                <button
                    onClick={handleStartChat}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-3 rounded-lg font-semibold text-white text-base shadow-lg"
                >
                    Start Chatting
                </button>
            </div>
            <div className="mt-10 text-slate-300 text-base">
                Powered by <span className="text-blue-500 font-semibold">OpenAI GPT-3.5 Turbo</span>
            </div>
        </div>
    );
};

export default Home;

