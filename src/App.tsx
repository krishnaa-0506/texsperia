import { useRef, useState } from 'react';
import { Shield } from 'lucide-react';
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';

function App() {
  const registerRef = useRef<HTMLDivElement>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Icon Button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 transition-all hover:scale-110"
        title="Admin Panel"
      >
        <Shield className="w-6 h-6 text-black" />
      </button>

      <HeroSection onRegisterClick={scrollToRegister} />
      <EventsSection />
      <div ref={registerRef}>
        <RegistrationForm />
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

export default App;
