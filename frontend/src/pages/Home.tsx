import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, MessageCircle, Brain, Sparkles, ArrowRight, Clock, Shield, User, Key, Smartphone } from "lucide-react";

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleStartChat = () => {
        navigate("/chat");
    };

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Smart AI Assistant",
            description: "Powered by advanced AI technology for intelligent conversations"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "24/7 Availability",
            description: "Get instant responses anytime, anywhere"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Secure & Private",
            description: "Your conversations are protected and confidential"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
                    style={{
                        left: mousePosition.x / 50,
                        top: mousePosition.y / 50,
                    }}
                />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
                {/* Main Content */}
                <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                                <Bot className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                            AI Chatbot
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-blue-300">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <span className="text-lg">Powered by Advanced AI</span>
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                    </div>

                    {/* Hero Text */}
                    <div className="text-center max-w-3xl mb-12">
                        <p className="text-xl text-slate-300 leading-relaxed mb-8">
                            Experience the future of conversation with our intelligent AI assistant.
                            Get instant help with <span className="text-blue-400 font-semibold">knowledge</span>,
                            <span className="text-purple-400 font-semibold"> business</span>,
                            <span className="text-cyan-400 font-semibold"> technology</span>, and
                            <span className="text-pink-400 font-semibold"> education</span>.
                        </p>

                        {/* CTA Button */}
                        <button
                            onClick={handleStartChat}
                            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 px-12 py-4 rounded-full font-semibold text-white text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Start Chatting Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                            {/* Button Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mb-12">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="text-blue-400 mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Test User Info Card */}
                    {/* Test User Info Card */}
                    <div className="flex justify-center mb-12">
                        <div className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-300/20 rounded-2xl p-6 max-w-md w-full transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 text-amber-300 mb-2">
                                    <User className="w-5 h-5" />
                                    <span className="font-semibold text-lg">Test Account</span>
                                </div>
                                <p className="text-amber-200/80 text-sm">Use these credentials for testing</p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                                    <MessageCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <span className="text-slate-300">Email:</span>
                                        <div className="text-white font-mono">test@yopmail.com</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                                    <Key className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    <div>
                                        <span className="text-slate-300">Password:</span>
                                        <div className="text-white font-mono">test12345</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3">
                                    <Smartphone className="w-4 h-4 text-green-400 flex-shrink-0" />
                                    <div>
                                        <span className="text-slate-300">OTP:</span>
                                        <div className="text-white font-mono">999999</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 text-center text-slate-400">
                    <p className="mb-2">Powered by</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-blue-400 font-semibold">OpenAI GPT-3.5 Turbo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;