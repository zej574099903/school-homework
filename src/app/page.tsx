import Link from "next/link";
import { Calculator, ScrollText, Trash2, ArrowRight, User, BookOpen, Brain, Languages } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[100px] -z-10 animate-float"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: "2s" }}></div>

      {/* Header Section */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 md:mb-12 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce-slow border-2 border-white">
            🤖
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black text-slate-800 leading-tight">
              AI 创意学习助手
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              嗨，周意满同学！👋
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full text-sm font-bold text-slate-600 shadow-sm border border-white/50">
          <User className="w-4 h-4 text-blue-500" />
          <span>二年级（2）班</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center mb-10 md:mb-16 max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            开启你的<br className="md:hidden" />奇妙学习之旅
          </span> 🚀
        </h2>
        <p className="text-base md:text-lg text-slate-600 font-medium opacity-90 px-4 text-balance">
          这里有三个神奇的 AI 伙伴，快来和他们一起探索知识的奥秘吧！
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full pb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {/* Module 1: Math Adventure */}
        <Link href="/math" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-blue-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calculator className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">🧮</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
              趣味数学大冒险
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              和 AI 一起挑战有趣的数学题，锻炼你的逻辑思维能力！
            </p>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              开始挑战 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Module 2: Idiom Chain */}
        <Link href="/idiom" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-emerald-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ScrollText className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">📜</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">
              成语接龙排位赛
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              即使是 AI 对手也不要怕，用你丰富的词汇量打败它！
            </p>

            <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 group-hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              立即开始 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Module 3: Garbage Classifier */}
        <Link href="/garbage" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-orange-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trash2 className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">♻️</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">
              垃圾分类小卫士
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              拍一拍或者写一写，AI 帮你快速识别垃圾分类！
            </p>

            <button className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 group-hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              去查一查 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Module 4: Story Relay */}
        <Link href="/story" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-pink-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">📖</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-pink-600 transition-colors">
              AI 故事大合奏
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              一人一句，和 AI 一起创作属于你的奇妙绘本故事！
            </p>

            <button className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 group-hover:bg-pink-600 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              开始创作 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Module 5: Riddle King */}
        <Link href="/riddle" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-violet-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">🧞‍♂️</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-violet-600 transition-colors">
              AI 猜谜大王
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              开动脑筋！和谜题精灵来一场智力大比拼吧！
            </p>

            <button className="w-full py-3 bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-200 group-hover:bg-violet-600 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              接受挑战 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>

        {/* Module 6: Word Transformer */}
        <Link href="/word" className="group block h-full">
          <div className="glass-card h-full p-6 md:p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group-hover:ring-4 ring-cyan-100 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Languages className="w-24 h-24 rotate-12" />
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
              <span className="text-4xl">🔤</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 group-hover:text-cyan-600 transition-colors">
              单词大变身
            </h3>

            <p className="text-slate-500 text-sm md:text-base mb-6 flex-grow font-medium leading-relaxed">
              输入单词，AI 把它变成有趣的句子和场景！
            </p>

            <button className="w-full py-3 bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-200 group-hover:bg-cyan-600 transition-all flex items-center justify-center gap-2 group-active:scale-95">
              开始变身 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Link>
      </div>

      <footer className="text-xs text-slate-400 font-medium py-6 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        © 2026 二年级创意编程项目 · AI Learning Assistant
      </footer>
    </main>
  );
}
