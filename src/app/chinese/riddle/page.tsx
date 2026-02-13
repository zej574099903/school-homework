"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Star, Info, HelpCircle, Lightbulb, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type RiddleChallenge = {
    riddle: string;
    answer: string;
    pinyin: string;
    hints: string[];
    explanation: string;
};

export default function MagicRiddles() {
    const [grade, setGrade] = useState("二年级");
    const [challenge, setChallenge] = useState<RiddleChallenge | null>(null);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [showHintCount, setShowHintCount] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [stars, setStars] = useState(0);

    const fetchChallenge = useCallback(async (currentGrade: string = grade) => {
        setLoading(true);
        setIsSuccess(false);
        setShowResult(false);
        setShowHintCount(0);
        setInput("");
        try {
            const res = await axios.post("/api/chinese/riddle", {
                type: "generate",
                grade: currentGrade
            });
            setChallenge(res.data);
        } catch (error) {
            console.error("Failed to fetch riddle", error);
        } finally {
            setLoading(false);
        }
    }, [grade]);

    useEffect(() => {
        const savedGrade = localStorage.getItem("student-grade") || "二年级";
        setGrade(savedGrade);
        fetchChallenge(savedGrade);
    }, []);

    const handleCheck = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!challenge || loading || isSuccess) return;

        if (input.trim() === challenge.answer) {
            setIsSuccess(true);
            setStars(prev => prev + 1);
            setTimeout(() => setShowResult(true), 1000);
        } else {
            // Shake animation triggered by state could go here
        }
    };

    return (
        <div className="h-screen bg-[#f3f0ff] text-slate-800 flex flex-col font-serif selection:bg-purple-100 relative overflow-hidden">
            {/* Background Magic */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <header className="p-6 flex justify-between items-center z-50 bg-white/40 backdrop-blur-md border-b border-purple-100 shadow-sm">
                <Link href="/" className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-purple-200 transition-all active:scale-95 group shadow-sm">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform text-purple-700" />
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        魔法猜字谜 🔮
                    </h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-full shadow-lg border-2 border-white">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="text-sm font-black">{stars}</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8 z-10">
                {/* Riddle Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-purple-50 relative overflow-hidden flex flex-col items-center text-center"
                >
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                        <Sparkles className="w-4 h-4" />
                        魔法谜面
                    </div>

                    {loading ? (
                        <div className="space-y-4 w-full animate-pulse">
                            <div className="h-10 bg-slate-100 rounded-full w-3/4 mx-auto"></div>
                            <div className="h-10 bg-slate-100 rounded-full w-1/2 mx-auto"></div>
                        </div>
                    ) : (
                        <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-8">
                            “{challenge?.riddle}”
                        </h2>
                    )}

                    {/* Hints Area */}
                    <div className="w-full space-y-3 mb-8">
                        {challenge?.hints.map((hint, idx) => (
                            <div key={idx} className="relative">
                                {idx < showHintCount ? (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-purple-50 text-purple-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-3 border border-purple-100"
                                    >
                                        <Lightbulb className="w-4 h-4 shrink-0" />
                                        <span>{hint}</span>
                                    </motion.div>
                                ) : (
                                    idx === showHintCount && (
                                        <button
                                            onClick={() => setShowHintCount(prev => prev + 1)}
                                            className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-100 text-purple-300 hover:border-purple-300 hover:text-purple-500 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                            查看第 {idx + 1} 个提示
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Answer Input */}
                    <form onSubmit={handleCheck} className="w-full flex gap-3">
                        <input
                            type="text"
                            maxLength={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="?"
                            className="w-24 h-24 md:w-32 md:h-32 text-center text-5xl font-black rounded-3xl bg-slate-50 border-4 border-slate-100 focus:border-purple-400 transition-all outline-none"
                            disabled={loading || isSuccess}
                        />
                        <button
                            type="submit"
                            disabled={loading || isSuccess || !input.trim()}
                            className="flex-1 bg-purple-600 text-white rounded-3xl font-black text-xl md:text-2xl shadow-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            揭晓谜底！
                        </button>
                    </form>
                </motion.div>

                {/* Next Button */}
                {!isSuccess && !loading && (
                    <button
                        onClick={() => fetchChallenge()}
                        className="text-purple-600 flex items-center gap-2 font-bold hover:underline"
                    >
                        <RefreshCw className="w-4 h-4" />
                        换一个字谜
                    </button>
                )}
            </main>

            {/* Success Overlay */}
            <AnimatePresence>
                {showResult && challenge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-900/60 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-sm rounded-[5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col items-center"
                        >
                            <div className="p-4 bg-purple-500 text-white rounded-full mb-6 shadow-xl animate-bounce">
                                <Trophy className="w-12 h-12" />
                            </div>
                            <div className="text-slate-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">谜底揭晓</div>
                            <div className="text-9xl font-black text-slate-900 mb-4 drop-shadow-lg">
                                {challenge.answer}
                            </div>
                            <div className="text-2xl font-bold text-purple-600 mb-2">{challenge.pinyin}</div>

                            <div className="w-full bg-purple-50 p-6 rounded-3xl text-purple-800 font-bold text-center mb-8 border border-purple-100">
                                {challenge.explanation}
                            </div>

                            <button
                                onClick={() => fetchChallenge()}
                                className="w-full py-5 bg-purple-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-purple-700 transition-all"
                            >
                                智慧如海！下一关
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
