"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Zap, Rocket, Palette, Music, Calculator, BookOpen, Languages, GraduationCap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const GRADES = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];

export default function Home() {
  const [grade, setGrade] = useState("二年级");
  const [isGradeOpen, setIsGradeOpen] = useState(false);

  useEffect(() => {
    const savedGrade = localStorage.getItem("student-grade");
    if (savedGrade) setGrade(savedGrade);
  }, []);

  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    localStorage.setItem("student-grade", newGrade);
    setIsGradeOpen(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* 🔮 Background Atmospheric Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-blue-400/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vh] h-[40vh] bg-purple-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vh] h-[60vh] bg-pink-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>

        {/* Floating Particles */}
        <div className="absolute top-[15%] left-[10%] opacity-20 animate-float">
          <Star className="w-8 h-8 text-yellow-300 fill-current" />
        </div>
        <div className="absolute top-[40%] right-[15%] opacity-20 animate-float-delayed">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* 🧭 Header / Explorer Pass */}
      <header className="w-full max-w-6xl px-4 pt-6 pb-2 flex justify-between items-center z-50">
        <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full border-2 border-white/50 shadow-sm animate-pop-in">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-xl shadow-inner text-white">
            🤖
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none">AI Assistant</span>
            <span className="text-sm font-black text-slate-700 leading-tight">创意学习助手</span>
          </div>
        </div>

        {/* Grade Selector */}
        <div className="relative">
          <button
            onClick={() => setIsGradeOpen(!isGradeOpen)}
            className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 border-2 border-white/50 shadow-sm animate-pop-in hover:bg-white/40 transition-all group"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-12">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 leading-none">当前等级</span>
              <span className="text-sm font-black text-slate-700 flex items-center gap-1">
                {grade} <ChevronDown className={cn("w-3 h-3 transition-transform", isGradeOpen && "rotate-180")} />
              </span>
            </div>
          </button>

          {isGradeOpen && (
            <div className="absolute top-full mt-2 right-0 w-40 glass-panel border-2 border-white/50 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="grid grid-cols-1 p-2 gap-1">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGradeChange(g)}
                    className={cn(
                      "px-4 py-2 text-left rounded-xl text-sm font-bold transition-colors",
                      grade === g ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-white/50"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 🚀 Hero Section */}
      <section className="w-full max-w-4xl px-4 mt-8 mb-12 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-600 text-xs font-bold mb-4 animate-fade-in-up border border-indigo-200">
          <span className="animate-wiggle">✨</span> 为 {grade} 小朋友开启的奇幻之旅
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm leading-tight animate-fade-in-up md:max-w-3xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            探索无限可能
          </span>
          <br />
          <span className="text-2xl md:text-4xl text-slate-600 font-bold mt-2 block">
            和 AI 伙伴一起成长 🚀
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-500 font-medium max-w-lg mx-auto animate-fade-in-up leading-relaxed px-4 text-balance" style={{ animationDelay: '0.1s' }}>
          这里有适合 {grade} 的数学岛、成语森林和故事城堡，快来开始今天的冒险吧！
        </p>
      </section>

      {/* 🗺️ Magic Map Grid (Navigation) */}
      <div className="w-full max-w-6xl px-4 pb-20 flex flex-col gap-12 z-10">

        {/* --- 数学板块 (Math) --- */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">数学冒险</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            <Link href="/math/arithmetic-defense" className="group block min-h-[220px] w-full animate-fade-in-up">
              <article className="glass-card-premium h-full rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_20px_50px_rgba(239,68,68,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-2xl group-hover:bg-red-400/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">🛡️</div>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-red-600 backdrop-blur-sm border border-white/50">数学</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-red-600 transition-colors">算术守卫战</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">陨石来袭！不仅要算得对，还要算得快！</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/math/klotski" className="group block min-h-[220px] w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <article className="glass-card-premium h-full rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl group-hover:bg-indigo-400/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">🧩</div>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-indigo-600 backdrop-blur-sm border border-white/50">数学</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">符文华容道</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">解开远古符文谜题，挑战你的逻辑极限！</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* --- 语文板块 (Chinese) --- */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">语文乐园</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            <Link href="/chinese/idiom-chain" className="group block min-h-[220px] w-full animate-fade-in-up">
              <article className="glass-card-premium h-full rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl group-hover:bg-orange-400/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">🏮</div>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-orange-600 backdrop-blur-sm border border-white/50">语文</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">成语接龙</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">挑战“成语博士”，在接龙中学习成语背后的有趣小故事。</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>

            <Link href="/chinese/riddle" className="group block min-h-[220px] w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <article className="glass-card-premium h-full rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_20px_50px_rgba(147,51,234,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">🔮</div>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-purple-600 backdrop-blur-sm border border-white/50">语文</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">魔法猜字谜</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">通过生动的谜面猜汉字，像解开魔法咒语一样探索汉字之美。</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* --- 英语板块 (English) --- */}
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white shadow-sm">
              <Languages className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">英语世界</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-200 to-transparent ml-4"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-[480px]">
            <Link href="/word" className="group block min-h-[220px] w-full animate-fade-in-up">
              <article className="glass-card-premium h-full rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between group-hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl group-hover:bg-cyan-400/20 transition-all"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white group-hover:scale-110 transition-transform duration-300">🔤</div>
                  <span className="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-cyan-600 backdrop-blur-sm border border-white/50">英语</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-cyan-600 transition-colors">单词大变身</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">让单词活过来！用 AI 创造有趣的单词场景。</p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      </div>

      <footer className="text-[10px] md:text-xs text-slate-400 font-medium py-8 text-center animate-fade-in-up w-full" style={{ animationDelay: "0.9s" }}>
        © 2026 二年级创意编程项目 · AI Learning Assistant
      </footer>
    </main>
  );
}
