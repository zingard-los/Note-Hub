"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  FiBookOpen, 
  FiBriefcase, 
  FiUser, 
  FiEdit3, 
  FiSearch, 
  FiCheckCircle, 
  FiArrowRight, 
  FiFeather, 
  FiRefreshCw, 
  FiCloud, 
  FiCpu 
} from "react-icons/fi";

export default function Aim() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(false);

  const handleGetStarted = async () => {
    setCheckingSession(true);

    try {
      const { data } = await supabase.auth.getSession();
      router.push(data.session?.user ? "/create" : "/register");
    } catch {
      router.push("/register");
    } finally {
      setCheckingSession(false);
    }
  };

  const audienceAims = [
    {
      title: "For Youngsters & Students",
      subtitle: "Capture, Study, & Excel",
      badge: "Learners",
      icon: <FiUser size={28} />,
      description: "Keep track of assignment deadlines, capture lecture points in real-time, and convert messy class notes into structured study guides.",
      highlights: [
        "Instant organization with tags and folders",
        "Searchable lecture notes and assignment logs",
        "Accessible across laptops, tablets, and phones"
      ]
    },
    {
      title: "For Teachers & Educators",
      subtitle: "Plan, Document, & Inspire",
      badge: "Educators",
      icon: <FiBookOpen size={28} />,
      description: "Document lesson plans, archive curriculum resources, and track class progress without juggling multiple physical notebooks.",
      highlights: [
        "Reusable lesson plan templates",
        "Streamlined semester and subject mapping",
        "Easy sharing with students and faculty"
      ]
    },
    {
      title: "For Working Professionals",
      subtitle: "Streamline, Archive, & Scale",
      badge: "Professionals",
      icon: <FiBriefcase size={28} />,
      description: "Transition away from lost sticky notes and scattered paper diaries into an enterprise-grade digital knowledge hub.",
      highlights: [
        "Lightning-fast meeting minutes log",
        "Project documentation and task tracking",
        "Instant cross-document search capability"
      ]
    }
  ];

  const comparison = [
    {
      traditional: "Easily lost, damaged, or mislaid paper pages",
      notehub: "Cloud-backed, encrypted, and backed up continuously",
      icon: <FiCloud className="text-[#0D530E]" />
    },
    {
      traditional: "Manual scanning or re-typing to search old notes",
      notehub: "Instant full-text search across years of documentation",
      icon: <FiSearch className="text-[#0D530E]" />
    },
    {
      traditional: "Hard to edit, reorder, or update past notes cleanly",
      notehub: "Effortless editing, drag-and-drop hierarchy, and formatting",
      icon: <FiRefreshCw className="text-[#0D530E]" />
    },
    {
      traditional: "Heavy physical notebooks to transport every day",
      notehub: "Entire personal & professional library in your pocket",
      icon: <FiCpu className="text-[#0D530E]" />
    }
  ];

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-gray-900 flex flex-col antialiased selection:bg-[#0D530E] selection:text-white">
      
      {/* 1. Hero Section */}
      <section className="relative bg-[#0D530E] py-28 sm:py-36 px-6 overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 border border-white/15">
            <FiFeather className="text-emerald-300" />
            Our Core Mission
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFFFF] mb-6 tracking-tight leading-[1.08]">
            Evolving beyond <br />
            <span className="bg-gradient-to-r from-emerald-200 via-white to-emerald-100 bg-clip-text text-transparent">
              pen and paper.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#FFFFFF]/90 max-w-2xl font-normal leading-relaxed mb-10">
            NoteHub exists to bridge the gap between human thought and digital productivity. We empower students, teachers, and professionals to record, organize, and retrieve knowledge effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={checkingSession}
              className="bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 active:scale-[0.98] transition-all duration-200 px-8 py-3.5 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
            >
              {checkingSession ? "Checking..." : "Start Writing Digitally"}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Target Audience Objectives */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-[#0D530E] font-bold text-xs tracking-widest uppercase bg-[#0D530E]/10 px-3 py-1 rounded-full">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0D530E] mt-3 mb-4 tracking-tight">
            Designed for every stage of growth
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Whether you are managing a classroom, studying for exams, or directing projects, NoteHub adapts to your specific goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audienceAims.map((item, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D530E]/10 text-[#0D530E] flex items-center justify-center group-hover:bg-[#0D530E] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D530E] bg-emerald-50 px-3 py-1 rounded-full border border-[#0D530E]/10">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#0D530E] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {item.subtitle}
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {item.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                      <FiCheckCircle className="text-[#0D530E] shrink-0 mt-0.5" size={16} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pen & Paper vs Digital Evolution Matrix */}
      <section className="bg-slate-50/80 py-24 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-[#0D530E] font-bold text-xs tracking-widest uppercase bg-white border border-gray-200 px-3 py-1 rounded-full">
              The Digital Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] mt-3 mb-4 tracking-tight">
              Why make the switch?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
              Replacing analog paper notes with NoteHub elevates speed, security, and long-term clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {comparison.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-5 flex items-center gap-3 text-gray-500 line-through text-sm sm:text-base">
                  <FiEdit3 className="shrink-0 text-gray-400" size={20} />
                  <span>{item.traditional}</span>
                </div>

                <div className="hidden md:flex md:col-span-2 justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#0D530E]/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <div className="md:col-span-5 flex items-center gap-3 text-[#0D530E] font-bold text-sm sm:text-base bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <FiCheckCircle className="shrink-0 text-[#0D530E]" size={20} />
                  <span>{item.notehub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sustainable & Environmental Vision */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#0D530E]/10 text-[#0D530E] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <FiFeather size={32} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D530E] mb-4 tracking-tight">
          Saves trees, saves time
        </h2>
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Every notebook replaced by NoteHub contributes to reducing paper waste while ensuring your valuable insights remain permanent, organized, and available whenever you need them.
        </p>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="relative overflow-hidden bg-[#0D530E] py-24 px-6 mt-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#FFFFFF] mb-6 tracking-tight leading-tight">
            Ready to transform how you document?
          </h2>
          <p className="text-[#FFFFFF]/90 text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
            Join students, teachers, and professionals already building their knowledge hub on NoteHub today.
          </p>
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={checkingSession}
            className="bg-[#FFFFFF] text-[#0D530E] hover:bg-emerald-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 px-9 py-4 text-lg font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 group"
          >
            {checkingSession ? "Checking..." : "Get Started Free"}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </main>
  );
}