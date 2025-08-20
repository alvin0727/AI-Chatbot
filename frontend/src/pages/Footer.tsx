import { Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-900 border-t border-slate-700 py-4">
            <div className="flex items-center justify-center gap-6">
                {/* Copyright text */}
                <div className="text-blue-400 font-medium text-sm tracking-wide select-none">
                    © Alvin Boys Gea
                </div>
                
                {/* Vertical divider */}
                <div className="w-px h-5 bg-slate-600"></div>
                
                {/* Social icons */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://www.linkedin.com/in/alvinboysgea"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                        href="https://github.com/alvin0727"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        aria-label="GitHub"
                    >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                        href="mailto:alvinboys2020@gmail.com"
                        className="group flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Email"
                    >
                        <Mail size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>
    );
}