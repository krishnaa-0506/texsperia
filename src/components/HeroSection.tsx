import { ArrowRight, Cog, Zap } from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="absolute top-20 left-10 animate-pulse">
        <Cog className="w-16 h-16 text-yellow-500/20" />
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse delay-150">
        <Zap className="w-20 h-20 text-yellow-500/20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-white rounded-lg p-4 shadow-xl inline-block">
            <img src="/techsphere logo.png" alt="TechSphere Logo" className="h-20" />
          </div>
        </div>

        <div className="inline-block mb-4 px-6 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
          <p className="text-yellow-400 text-sm font-semibold tracking-wider">
            Department of Mechanical and Mechatronics Engineering
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-fade-in">
          TEXPERIA 2026
        </h1>

        <div className="flex items-center justify-center gap-4 mb-8 text-2xl md:text-3xl text-gray-300">
          <span className="font-light">Innovate</span>
          <span className="text-yellow-500">•</span>
          <span className="font-light">Build</span>
          <span className="text-yellow-500">•</span>
          <span className="font-light">Compete</span>
        </div>

        <p className="text-4xl md:text-5xl font-bold text-white mb-4">
          Beyond Books
        </p>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          SNS College of Technology, Coimbatore
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">₹65,000+</p>
            <p className="text-gray-400 text-sm">Total Prize Pool</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-700"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">10+</p>
            <p className="text-gray-400 text-sm">Exciting Events</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-700"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">2 Days</p>
            <p className="text-gray-400 text-sm">Of Innovation</p>
          </div>
        </div>

        <button
          onClick={onRegisterClick}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50"
        >
          Register Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
