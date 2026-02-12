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
            <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">正在生成有趣的数学题...</p>
            </div>
        );
    }

    // Game Finished Screen
    if (gameFinished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="glass-card p-10 rounded-3xl w-full max-w-md animate-float">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-md" />
                    <h1 className="text-3xl font-black text-slate-800 mb-2">挑战完成！</h1>
                    <p className="text-slate-500 mb-6">太棒了！你的数学水平真不错！</p>

                    <div className="bg-white/50 rounded-2xl p-6 mb-8">
                        <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">最终得分</span>
                        <div className="text-6xl font-black text-blue-600 mt-2">{score}</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={fetchProblems}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
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
        <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <Link href="/" className="bg-white p-2.5 rounded-full shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 font-bold text-slate-700">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <span>第 {currentIndex + 1} / {problems.length} 题</span>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold text-sm">
                    得分: {score}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
                <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / problems.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            {currentProblem && (
                <div className="flex-grow flex flex-col">
                    <div className="glass-card flex-grow p-6 md:p-10 rounded-3xl mb-6 flex flex-col items-center justify-center text-center shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed mb-8">
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
                                    else if (isCorrect) buttonStyle = "bg-green-50 border-green-200 text-green-600"; // Show correct answer if wrong
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

                    {/* Feedback & Next Button */}
                    {showFeedback && (
                        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <div className={cn(
                                "p-4 rounded-2xl mb-4 flex items-start gap-3 border",
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

                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                {currentIndex < problems.length - 1 ? "下一题" : "查看成绩"} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
