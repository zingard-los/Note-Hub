import Link from "next/link";
import { 
  FiCheckCircle, 
  FiShield, 
  FiUsers, 
  FiTarget, 
  FiArrowRight, 
  FiZap, 
  FiTrendingUp, 
  FiAward, 
  FiClock 
} from "react-icons/fi";

export default function About() {
  const stats = [
    { label: "Active Thinkers", value: "50K+", icon: <FiUsers className="text-[#0D530E]" /> },
    { label: "Notes Created", value: "2M+", icon: <FiZap className="text-[#0D530E]" /> },
    { label: "Uptime Reliability", value: "99.9%", icon: <FiClock className="text-[#0D530E]" /> },
    { label: "User Satisfaction", value: "4.9/5", icon: <FiAward className="text-[#0D530E]" /> },
  ];

  const coreValues = [
    {
      title: "Simplicity First",
      description: "We eliminate cognitive clutter. Capturing ideas should feel instantaneous, intuitive, and distraction-free.",
      icon: <FiCheckCircle size={26} />,
      badge: "Design Philosophy"
    },
    {
      title: "Bank-Grade Security",
      description: "Your notes are encrypted end-to-end. We ensure your personal thoughts and documentation stay strictly private.",
      icon: <FiShield size={26} />,
      badge: "Privacy First"
    },
    {
      title: "Real-Time Synergy",
      description: "Collaborate seamlessly with team members. Share links, leave comments, and co-edit documents live.",
      icon: <FiUsers size={26} />,
      badge: "Teamwork"
    },
    {
      title: "Built for Velocity",
      description: "Lightning-fast search, instant keyboard shortcuts, and zero lag ensure you stay in your flow state.",
      icon: <FiTarget size={26} />,
      badge: "Performance"
    },
  ];

  const milestones = [
    { year: "Phase 1", title: "The Spark", desc: "Started as a minimal internal scratchpad tool to solve personal note organization overload." },
    { year: "Phase 2", title: "Public Launch", desc: "Released NoteHub to early adopters, refining our fast markdown engine and intuitive tree navigation." },
    { year: "Phase 3", title: "Team Workspace", desc: "Introduced real-time multiplayer editing, encrypted shared folders, and workspace permissions." },
  ];

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-gray-900 flex flex-col antialiased selection:bg-[#0D530E] selection:text-white">
      
      {/* 1. Hero Section with Subversive Radial Mesh */}
      <section className="relative bg-[#0D530E] py-28 sm:py-36 px-6 overflow-hidden">
        {/* Ambient Radial Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 border border-white/15 shadow-inner">
            <FiTrendingUp className="text-emerald-300" />
            Empowering Digital Minds
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFFFF] mb-6 tracking-tight leading-[1.08]">
            Crafted for focus. <br />
            <span className="bg-gradient-to-r from-emerald-200 via-white to-emerald-100 bg-clip-text text-transparent">
              Built for breakthroughs.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#FFFFFF]/90 max-w-2xl font-normal leading-relaxed mb-10">
            NoteHub replaces noisy, cluttered documentation tools with a refined, lightning-fast workspace designed to turn fleeting thoughts into lasting knowledge.
          </p>

          <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Trusted by students, developers, and creators worldwide
          </div>
        </div>
      </section>

      {/* 2. Impact Metrics Strip */}
      <section className="relative z-20 -mt-12 max-w-6xl mx-auto px-6 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#0D530E]/10 flex items-center justify-center text-xl mb-3">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Narrative & Core Mission */}
      <section className="py-24 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-[#0D530E] font-bold text-xs tracking-widest uppercase bg-[#0D530E]/10 px-3 py-1 rounded-full w-fit">
              Our Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] tracking-tight leading-tight">
              Why we built NoteHub
            </h2>
            <div className="w-16 h-1.5 bg-[#0D530E] rounded-full" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 text-gray-600 text-base sm:text-lg leading-relaxed">
            <p>
              Modern productivity software has lost its way. Between infinite context switching, cluttered menus, and bloated feature sets, simply taking a note often feels like fighting your tools.
            </p>
            <p className="font-semibold text-gray-800 border-l-4 border-[#0D530E] pl-4 italic bg-emerald-50/50 py-2 rounded-r-lg">
              "We designed NoteHub to be invisible when you need to think, and instant when you need to retrieve."
            </p>
            <p>
              Whether you are drafting a technical design document, organizing lecture notes, or brainstorming your next enterprise project, NoteHub keeps your ideas linked, structured, and instantly accessible.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive Core Values Cards */}
      <section className="bg-slate-50/80 py-28 px-6 border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[#0D530E] font-bold text-xs tracking-widest uppercase bg-white border border-gray-200 px-3 py-1 rounded-full shadow-xs">
              Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] mt-3 mb-4 tracking-tight">
              Engineered with intention
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              The fundamental standards that dictate every feature, design choice, and line of code we write.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#0D530E]/10 text-[#0D530E] flex items-center justify-center group-hover:bg-[#0D530E] group-hover:text-white transition-colors duration-300">
                      {value.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      {value.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0D530E] mb-3 group-hover:text-emerald-950 transition-colors">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center text-xs font-bold text-[#0D530E] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn standard <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Product Journey / Timeline */}
      <section className="py-28 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] mb-4 tracking-tight">
            Our Evolution
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            How NoteHub grew from a personal script to a trusted daily productivity hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col">
              <span className="text-xs font-extrabold text-[#0D530E] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full mb-4">
                {item.year}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. High-Converting Bottom Call to Action */}
      <section className="relative overflow-hidden bg-[#0D530E] py-24 px-6 mt-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] mb-6 tracking-tight leading-tight">
            Ready for a cleaner, faster way to work?
          </h2>
          <p className="text-[#FFFFFF]/90 text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
            Experience the clarity of an organized workspace. Claim your free NoteHub account and start creating notes in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href={"#"}
              className="bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 px-9 py-4 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}