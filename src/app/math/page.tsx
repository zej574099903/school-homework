"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Calculator, Heart, Trophy, RefreshCcw, Sparkles, Zap, Star } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type Problem = {
    id: number;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    isBoss?: boolean;
};

type Theme = 'magic' | 'space' | 'dino';

const THEMES = {
    magic: {
        id: 'magic',
        name: '魔法森林',
        icon: '🏰',
        color: 'from-purple-500 to-indigo-600',
        bg: 'from-indigo-900 via-purple-900 to-blue-900',
        accent: 'text-purple-300'
    },
    space: {
        id: 'space',
        name: '星际探险',
        icon: '🚀',
        color: 'from-blue-500 to-cyan-600',
        bg: 'from-slate-900 via-blue-900 to-black',
        accent: 'text-cyan-300'
    },
    dino: {
        id: 'dino',
        name: '恐龙乐园',
        icon: '🦖',
        color: 'from-green-500 to-emerald-600',
        bg: 'from-green-900 via-teal-900 to-emerald-950',
        accent: 'text-green-300'
    }
};

export default function MathPage() {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
    const [selectedTheme, setSelectedTheme] = useState<Theme>('magic');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(false);

    // Sound effects placeholders (could be added later)
    const playSound = (type: 'correct' | 'wrong' | 'win' | 'lose') => {
        // console.log(`Playing ${type} sound`);
    };

    const startGame = async (theme: Theme) => {
        setSelectedTheme(theme);
        setLoading(true);
        setLives(3);
        setScore(0);
        setStreak(0);
        setCurrentIndex(0);
        setProblems([]);

        try {
            const grade = localStorage.getItem("student-grade") || "二年级";
            const res = await axios.post("/api/math", { theme, grade });
            setProblems(res.data.problems);
            setGameState('playing');
        } catch (error) {
            console.error("Failed to fetch problems", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (option: string) => {
        if (showFeedback) return;

        setSelectedOption(option);
        setShowFeedback(true);
        const currentProblem = problems[currentIndex];

        if (option === currentProblem.answer) {
            const points = currentProblem.isBoss ? 50 : 10 + (streak * 2);
            setScore(score + points);
            setStreak(streak + 1);
            playSound('correct');
        } else {
            setLives(lives - 1);
            setStreak(0);
            playSound('wrong');
            // Check for game over
            if (lives <= 1) {
                // We'll calculate game over after the delay
            }
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowFeedback(false);

        if (lives <= 0) {
            setGameState('finished');
            return;
        }

        if (currentIndex < problems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setGameState('finished');
            playSound('win');
        }
    };

    // Loading Screen
    if (loading) {
        const theme = THEMES[selectedTheme];
        const loadingMessages = {
            magic: ["正在配制超级魔法药水...", "正在召唤森林里的小精灵...", "正在为您打开神秘城堡的大门...", "魔法扫帚正在飞往目的地..."],
            space: ["正在规划星际航线...", "正在校准飞船发动机...", "正在与外星人建立联络...", "正在穿越美丽的银河系..."],
            dino: ["正在寻找远古恐龙化石...", "正在唤醒沉睡的霸王龙...", "正在采摘热带雨林的浆果...", "正在修复破碎的恐龙蛋..."]
        };
        const messages = loadingMessages[selectedTheme] || loadingMessages.magic;
        const randomMsg = messages[Math.floor(Date.now() / 2000) % messages.length];

        return (
            <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br", theme.bg)}>
                <div className="relative">
                    <div className="text-9xl mb-12 animate-bounce flex items-center justify-center">
                        {theme.icon}
                    </div>
                    {/* Pulsing rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white/20 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white/10 rounded-full animate-ping animation-delay-500"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight drop-shadow-md animate-pulse">
                    探险即将开始...
                </h2>

                <div className="glass-panel px-8 py-4 rounded-3xl border-2 border-white/30 backdrop-blur-xl animate-fade-in">
                    <p className="text-xl md:text-2xl font-bold flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                        {randomMsg}
                    </p>
                </div>

                <div className="mt-12 w-64 h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-white animate-progress-fast shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                </div>
            </div>
        );
    }

    // Menu Screen
    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                <div className="relative z-10 w-full max-w-4xl text-center">
                    <div className="mb-8 animate-bounce">
                        <span className="text-8xl">🧙‍♂️</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                        趣味数学大冒险
                    </h1>
                    <p className="text-xl text-white/90 mb-12 font-medium">
                        选择你的冒险主题，开始挑战吧！
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                        {(Object.entries(THEMES) as [Theme, typeof THEMES.magic][]).map(([key, theme]) => (
                            <button
                                key={key}
                                onClick={() => startGame(key)}
                                className={cn(
                                    "group relative overflow-hidden rounded-3xl p-8 transition-all hover:scale-105 active:scale-95 border-4 border-white/20 hover:border-white/60 bg-gradient-to-br shadow-2xl",
                                    theme.color
                                )}
                            >
                                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{theme.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-2">{theme.name}</h3>
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                            </button>
                        ))}
                    </div>
                </div>

                <Link href="/" className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>
        );
    }

    // Game Interface
    if (gameState === 'playing') {
        const theme = THEMES[selectedTheme];
        const currentProblem = problems[currentIndex]; // Safe access
        if (!currentProblem) return null; // Should not happen

        const isBoss = currentProblem.isBoss;

        return (
            <div className={cn("min-h-screen flex flex-col text-white transition-colors duration-1000 bg-gradient-to-br", theme.bg)}>
                {/* Header */}
                <header className="flex-shrink-0 flex items-center justify-between p-4 md:px-8 bg-black/20 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setGameState('menu')} className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-1 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                            {[1, 2, 3].map((i) => (
                                <Heart
                                    key={i}
                                    className={cn("w-6 h-6 transition-all", i <= lives ? "fill-red-500 text-red-500" : "text-white/20")}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {streak > 1 && (
                            <div className="flex items-center gap-1 text-yellow-400 font-black animate-pulse">
                                <Zap className="w-5 h-5 fill-yellow-400" />
                                <span>{streak} 连对!</span>
                            </div>
                        )}
                        <div className="bg-white/10 px-4 py-2 rounded-full font-bold border border-white/10 min-w-[100px] text-center">
                            {score} 分
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
                    {/* Boss Effect */}
                    {isBoss && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 animate-pulse"></div>
                            <div className="absolute top-20 left-10 text-9xl opacity-20 animate-bounce">🦖</div>
                        </div>
                    )}

                    <div className="w-full max-w-4xl relative z-10">
                        {/* Question Card */}
                        <div className={cn(
                            "backdrop-blur-xl rounded-[2.5rem] p-5 md:p-12 shadow-2xl border transition-all duration-500",
                            isBoss ? "bg-red-900/40 border-red-500/50" : "bg-white/10 border-white/20"
                        )}>
                            <div className="flex justify-between items-center mb-6 md:mb-8">
                                <span className={cn("px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-white/20", theme.accent)}>
                                    第 {currentIndex + 1} / {problems.length} 关
                                </span>
                                {isBoss && <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-black bg-red-600 text-white animate-pulse">BOSS 战</span>}
                            </div>

                            <h2 className={cn("text-2xl md:text-5xl font-black leading-tight mb-8 md:mb-12 text-center drop-shadow-md", isBoss ? "text-red-100" : "text-white")}>
                                {currentProblem.question}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                {currentProblem.options.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    const isCorrect = option === currentProblem.answer;

                                    let btnStyle = "bg-white/5 hover:bg-white/20 border-white/10 text-white";
                                    if (showFeedback) {
                                        if (isSelected && isCorrect) btnStyle = "bg-green-500 border-green-400 text-white scale-105 shadow-[0_0_30px_rgba(34,197,94,0.5)]";
                                        else if (isSelected && !isCorrect) btnStyle = "bg-red-500 border-red-400 text-white animate-shake";
                                        else if (isCorrect) btnStyle = "bg-green-500/50 border-green-400/50 text-white/80";
                                        else btnStyle = "opacity-50 grayscale";
                                    } else if (isSelected) {
                                        btnStyle = "bg-white/30 border-white text-white scale-95";
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={showFeedback}
                                            className={cn(
                                                "py-4 md:py-6 px-6 md:px-8 rounded-2xl border-2 text-xl md:text-3xl font-bold transition-all duration-200 shadow-lg active:scale-95",
                                                btnStyle
                                            )}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback & Next */}
                            {showFeedback && (
                                <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                    <div className={cn(
                                        "p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start justify-between gap-4 border-2 shadow-xl",
                                        selectedOption === currentProblem.answer
                                            ? "bg-green-600/20 border-green-500"
                                            : "bg-red-600/20 border-red-500"
                                    )}>
                                        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
                                            {selectedOption === currentProblem.answer
                                                ? <CheckCircle className="w-10 h-10 text-green-400 shrink-0" />
                                                : <XCircle className="w-10 h-10 text-red-400 shrink-0" />
                                            }
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">
                                                    {selectedOption === currentProblem.answer ? "太棒了！答对了！" : "哎呀，再接再厉！"}
                                                </h3>
                                                <p className="text-white/80 text-lg leading-relaxed">{currentProblem.explanation}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleNext}
                                            className="w-full md:w-auto px-8 py-3 bg-white text-indigo-900 rounded-xl font-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 shrink-0"
                                        >
                                            {currentIndex < problems.length - 1 ? '下一关' : '领取奖励'} <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Finished Screen
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
            {score > 50 && <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent animate-pulse"></div>}

            <div className="glass-card-premium bg-white/10 p-12 rounded-[3rem] w-full max-w-lg relative z-10 border border-white/20 backdrop-blur-xl">
                <div className="text-9xl mb-6 animate-bounce">
                    {lives > 0 ? '🏆' : '💪'}
                </div>
                <h1 className="text-5xl font-black mb-4">
                    {lives > 0 ? '探险成功！' : '探险结束'}
                </h1>
                <p className="text-xl text-white/80 mb-10">
                    {lives > 0 ? '你真是个数学小天才！' : '不要灰心，下次一定能行！'}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-sm text-white/60 mb-1">最终得分</div>
                        <div className="text-4xl font-black text-yellow-400">{score}</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="text-sm text-white/60 mb-1">最高连对</div>
                        <div className="text-4xl font-black text-green-400">{streak}</div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setGameState('menu')}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all text-xl flex items-center justify-center gap-2"
                    >
                        <RefreshCcw className="w-6 h-6" /> 再玩一次
                    </button>
                    <Link href="/" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10 active:scale-95 transition-all">
                        返回主页
                    </Link>
                </div>
            </div>
        </div>
    );
}
