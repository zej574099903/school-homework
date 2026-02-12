"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Calculator, Trophy, RefreshCcw } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type Problem = {
    id: number;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
};

export default function MathPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);

    const fetchProblems = async () => {
        setLoading(true);
        setGameFinished(false);
        setCurrentIndex(0);
        setScore(0);
        setProblems([]);

        try {
            const res = await axios.post("/api/math");
            setProblems(res.data.problems);
        } catch (error) {
            console.error("Failed to fetch problems", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProblems();
    }, []);

    const handleOptionClick = (option: string) => {
        if (showFeedback) return;

        setSelectedOption(option);
        setShowFeedback(true);

        if (option === problems[currentIndex].answer) {
            setScore(score + 10);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowFeedback(false);

        if (currentIndex < problems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setGameFinished(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
                {/* Floating background elements */}
                <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>🧮</div>
                <div className="absolute top-40 right-20 text-5xl animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.5s' }}>✏️</div>
                <div className="absolute bottom-32 left-20 text-5xl animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2.2s' }}>📐</div>
                <div className="absolute bottom-20 right-10 text-6xl animate-bounce" style={{ animationDelay: '0.9s', animationDuration: '2.8s' }}>🎯</div>

                {/* Main loading content */}
                <div className="relative z-10 text-center">
                    <div className="mb-6 relative">
                        <div className="text-7xl animate-spin" style={{ animationDuration: '3s' }}>🌟</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Calculator className="w-10 h-10 text-blue-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-slate-700 font-bold text-xl mb-2 animate-pulse">正在为你定制数学题...</p>
                    <p className="text-slate-500 text-sm">AI老师正在精心准备中 ✨</p>

                    {/* Progress dots */}
                    <div className="flex gap-2 justify-center mt-6">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Game Finished Screen - Score-based animations
    if (gameFinished) {
        const percentage = (score / 100) * 100;
        let performance = { emoji: "😊", title: "不错哦！", message: "继续加油，你会更棒的！", color: "blue" };

        if (percentage >= 90) {
            performance = { emoji: "🏆", title: "完美！", message: "你是数学小天才！太厉害了！", color: "yellow" };
        } else if (percentage >= 70) {
            performance = { emoji: "🌟", title: "真棒！", message: "你的数学水平很不错哦！", color: "green" };
        } else if (percentage >= 50) {
            performance = { emoji: "💪", title: "加油！", message: "继续努力，你一定会更好的！", color: "blue" };
        } else {
            performance = { emoji: "📚", title: "继续学习！", message: "多做练习，进步会很快的！", color: "purple" };
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Confetti effect for high scores */}
                {percentage >= 70 && (
                    <>
                        <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</div>
                        <div className="absolute top-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
                        <div className="absolute bottom-20 left-20 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</div>
                        <div className="absolute bottom-10 right-20 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</div>
                    </>
                )}

                <div className="glass-card p-10 rounded-3xl w-full max-w-md relative z-10">
                    <div className="text-8xl mb-6 animate-bounce">{performance.emoji}</div>
                    <h1 className="text-4xl font-black text-slate-800 mb-2">{performance.title}</h1>
                    <p className="text-slate-600 mb-6 text-lg">{performance.message}</p>

                    <div className="bg-gradient-to-br from-white/70 to-white/50 rounded-2xl p-6 mb-8 backdrop-blur-sm border-2 border-white/50 shadow-lg">
                        <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">最终得分</span>
                        <div className="text-7xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2 animate-pulse">
                            {score}
                        </div>
                        <p className="text-slate-500 text-sm mt-2">答对 {score / 10} / 10 题</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={fetchProblems}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-5 h-5" /> 再玩一次
                        </button>
                        <Link href="/" className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-bold border border-slate-200 active:scale-95 transition-all">
                            返回主页
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentProblem = problems[currentIndex];

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Fixed Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-4 md:px-6 bg-slate-50 border-b border-slate-100">
                <Link href="/" className="bg-white p-2.5 rounded-full shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 font-bold text-slate-700">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <span className="text-sm md:text-base">第 {currentIndex + 1} / {problems.length} 题</span>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold text-sm">
                    {score}分
                </div>
            </header>

            {/* Progress Bar */}
            <div className="flex-shrink-0 px-4 md:px-6 pt-2 pb-4 bg-slate-50">
                <div className="w-full max-w-3xl mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            {currentProblem && (
                <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="glass-card p-6 md:p-10 rounded-3xl mb-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed mb-8 text-center">
                                {currentProblem.question}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                {currentProblem.options.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    const isCorrect = option === currentProblem.answer;

                                    let buttonStyle = "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50";

                                    if (showFeedback) {
                                        if (isSelected && isCorrect) buttonStyle = "bg-green-100 border-green-300 text-green-700 ring-2 ring-green-200";
                                        else if (isSelected && !isCorrect) buttonStyle = "bg-red-100 border-red-300 text-red-700 ring-2 ring-red-200";
                                        else if (isCorrect) buttonStyle = "bg-green-50 border-green-200 text-green-600";
                                    } else if (isSelected) {
                                        buttonStyle = "bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-blue-200";
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={showFeedback}
                                            className={cn(
                                                "py-4 px-6 rounded-2xl border-2 text-lg font-bold transition-all duration-200 shadow-sm active:scale-[0.98]",
                                                buttonStyle
                                            )}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Feedback Box */}
                        {showFeedback && (
                            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 mb-4">
                                <div className={cn(
                                    "p-4 rounded-2xl flex items-start gap-3 border",
                                    selectedOption === currentProblem.answer
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-red-50 border-red-200 text-red-800"
                                )}>
                                    {selectedOption === currentProblem.answer
                                        ? <CheckCircle className="w-6 h-6 shrink-0 text-green-500" />
                                        : <XCircle className="w-6 h-6 shrink-0 text-red-500" />
                                    }
                                    <div>
                                        <p className="font-bold mb-1">
                                            {selectedOption === currentProblem.answer ? "回答正确！" : "回答错误！"}
                                        </p>
                                        <p className="text-sm opacity-90">{currentProblem.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Fixed Footer - Next Button */}
            {showFeedback && (
                <div className="flex-shrink-0 p-4 md:px-6 bg-slate-50 border-t border-slate-100">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            {currentIndex < problems.length - 1 ? "下一题" : "查看成绩"} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
