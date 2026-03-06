import { Lightbulb, FileText, Rocket, Box, Car, Wrench, Gamepad2, Trophy } from 'lucide-react';

const day1Events = [
  {
    id: 'am_ideathon',
    name: 'AM Ideathon (National Level)',
    icon: Lightbulb,
    description: 'National Level Hackathon focused on Additive Manufacturing. Individual registration with optional team formation (1-4 members per team). The organizers will provide a problem statement related to additive manufacturing or 3D printing. Participants must analyze the problem and propose a creative technical solution or innovative idea. This is a standalone event.',
    type: 'Team',
    minMembers: 1,
    maxMembers: 4,
    isNationalEvent: true,
    isSeparateEvent: true,
    prize: '₹10,000'
  },
  {
    id: 'paper_presentation',
    name: 'Paper Presentation',
    icon: FileText,
    description: 'Participants present a technical research paper. This event is open domain, meaning participants can present papers from any field such as mechanical engineering, manufacturing, mechatronics, software, artificial intelligence, electronics, or any innovative technical topic.',
    type: 'Team',
    minMembers: 2,
    maxMembers: 4,
    prize: '₹10,000'
  },
  {
    id: 'innoventure',
    name: 'Innoventure',
    icon: Rocket,
    description: 'A combination of innovation and entrepreneurship. Participants must present an innovative idea or project along with its practical implementation and business potential. Projects can belong to any domain such as hardware, software, AI, robotics, automation, or product innovation.',
    type: 'Team',
    minMembers: 2,
    maxMembers: 4,
    prize: '₹10,000'
  },
  {
    id: 'cad_design',
    name: 'CAD Design Challenge',
    icon: Box,
    description: 'An individual design competition where participants must create a mechanical model using CAD software within a limited time. Evaluation is based on design accuracy, creativity, modeling skills, and engineering understanding.',
    type: 'Individual',
    prize: '₹10,000'
  },
  {
    id: 'rc_car',
    name: 'RC Car Race',
    icon: Car,
    description: 'Participants must bring their own remote-controlled racing car. The race will be conducted on a specially designed track with obstacles and turns.',
    type: 'Team',
    minMembers: 1,
    maxMembers: 6,
    prize: '₹10,000'
  },
  {
    id: 'junk_wars',
    name: 'Junk Wars',
    icon: Wrench,
    description: 'Participants must build a working mechanical device using scrap or mechanical components. Participants may bring their own materials, and some basic components may be provided by the organizers.',
    type: 'Team',
    minMembers: 2,
    maxMembers: 4,
    prize: '₹10,000'
  }
];

const day2Events = [
  {
    id: 'esports',
    name: 'Esports',
    icon: Gamepad2,
    description: 'Competitive gaming tournament conducted on both mobile and PC games. Once registered, you will be added to the specific groups and details will be shared.',
    type: 'Individual',
    minMembers: 1,
    maxMembers: 1,
    prize: '₹3,000'
  },
  {
    id: 'best_manager',
    name: 'Best Manager',
    icon: Trophy,
    description: 'A multi-round challenge testing leadership, strategy, decision-making, and problem solving.',
    type: 'Individual',
    minMembers: 1,
    maxMembers: 1,
    prize: '₹3,000'
  }
];

export default function EventsSection() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Event Overview</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto"></div>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
              <h3 className="text-2xl font-bold text-black">DAY 1</h3>
            </div>
            <h3 className="text-3xl font-bold text-white">Technical Events</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {day1Events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-yellow-500 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                    <event.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">{event.prize}</span>
                </div>

                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {event.name}
                </h4>

                <p className="text-gray-400 text-sm mb-4 line-clamp-4">
                  {event.description}
                </p>

                <div className="pt-4 border-t border-gray-700">
                  <span className="text-xs text-yellow-500 font-semibold">
                    {event.type === 'Individual' 
                      ? 'Individual' 
                      : `Team ${event.minMembers ? `(${event.minMembers}-${event.maxMembers} members)` : ''}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg">
              <h3 className="text-2xl font-bold text-black">DAY 2</h3>
            </div>
            <h3 className="text-3xl font-bold text-white">Skill & Strategy Events</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {day2Events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-yellow-500 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                    <event.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  {event.prize && <span className="text-yellow-400 font-bold text-sm">{event.prize}</span>}
                </div>

                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {event.name}
                </h4>

                <p className="text-gray-400 text-sm mb-4">
                  {event.description}
                </p>

                <div className="pt-4 border-t border-gray-700">
                  <span className="text-xs text-yellow-500 font-semibold">
                    {event.type === 'Individual' 
                      ? 'Individual' 
                      : `Team ${event.minMembers ? `(${event.minMembers}-${event.maxMembers} members)` : ''}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-yellow-400 mb-2">₹400</p>
              <p className="text-gray-300 text-sm">Registration Fee</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400 mb-2">3 Events</p>
              <p className="text-gray-300 text-sm">Per Participant</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400 mb-2">Food</p>
              <p className="text-gray-300 text-sm">& Refreshments</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400 mb-2">Certificates</p>
              <p className="text-gray-300 text-sm">For All Participants</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-yellow-500/30 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              Day 1 Prize Pool: ₹60,000 | Day 2 Prize Pool: ₹6,000+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export { day1Events, day2Events };
