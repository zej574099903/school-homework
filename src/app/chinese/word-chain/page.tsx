"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Star, RefreshCw, Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type WordNode = {
    word: string;
    pinyin: string;
    meaning: string;
    isUser: boolean;
};

export default function WordSolitaire() {
    const [grade, setGrade] = useState("二年级");
    const [history, setHistory] = useState<WordNode[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stars, setStars] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedGrade = localStorage.getItem("student-grade") || "二年级";
        setGrade(savedGrade);
        // Start game with a greeting word
        setHistory([{
            word: "苹果",
            pinyin: "píng guǒ",
            meaning: "一种常见的水果，又甜又脆。",
            isUser: false
        }]);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [history]);

    const handlePlay = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || loading) return;

        const lastWord = history[history.length - 1]?.word;
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post("/api/chinese/word-chain", {
                word: input.trim(),
                lastWord,
                grade
            });

            if (res.data.status === "error") {
                setError(res.data.message);
            } else {
                setHistory(prev => [
                    ...prev,
                    { word: input.trim(), pinyin: "", meaning: "", isUser: true },
                    {
                        word: res.data.next_word,
                        pinyin: res.data.pinyin,
                        meaning: res.data.meaning,
                        isUser: false
                    }
                ]);
                setInput("");
                setStars(prev => prev + 1);
            }
        } catch (err) {
            setError("连网络都累了，休息一下再来玩吧！");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#f0f9ff] text-slate-800 flex flex-col font-sans selection:bg-blue-100 relative overflow-hidden">
            {/* Header */}
            <header className="p-6 flex justify-between items-center z-50 bg-white/70 backdrop-blur-md border-b-2 border-blue-50 shadow-sm">
                <Link href="/" className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-blue-100 transition-all active:scale-95 group shadow-sm">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform text-blue-600" />
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                        词语大接龙 🍎
                    </h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-white rounded-full shadow-lg border-2 border-white">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="text-sm font-black">{stars}</span>
                </div>
            </header>

            {/* Game Stage */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                {/* Word Chain History */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32"
                >
                    <AnimatePresence mode="popLayout">
                        {history.map((node, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: node.isUser ? 20 : -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className={cn(
                                    "flex w-full items-start gap-4",
                                    node.isUser ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border-2 border-white shrink-0",
                                    node.isUser ? "bg-blue-100" : "bg-purple-100"
                                )}>
                                    {node.isUser ? "🧒" : "🐛"}
                                </div>
                                <div className={cn(
                                    "max-w-[80%] p-5 rounded-[2rem] shadow-sm relative",
                                    node.isUser ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border-2 border-slate-50"
                                )}>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-xs font-bold mb-1 opacity-70",
                                            node.isUser ? "text-blue-100" : "text-slate-400"
                                        )}>
                                            {node.pinyin}
                                        </span>
                                        <span className="text-2xl md:text-3xl font-black mb-1">{node.word}</span>
                                        {node.meaning && (
                                            <p className={cn(
                                                "text-xs mt-2 border-t pt-2 max-w-xs",
                                                node.isUser ? "border-blue-500/50 text-blue-100" : "border-slate-100 text-slate-500"
                                            )}>
                                                {node.meaning}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 text-slate-400 italic font-bold"
                        >
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>小书虫正在查字典...</span>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#f0f9ff] via-[#f0f9ff]/95 to-transparent pt-12">
                    <div className="max-w-xl mx-auto relative group">
                        {error && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute -top-16 inset-x-0 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-center text-sm font-bold border border-red-200 shadow-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        <form onSubmit={handlePlay} className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`用“${history[history.length - 1]?.word.slice(-1)}”接下个词...`}
                                    className="w-full py-4 pl-6 pr-12 rounded-[2rem] bg-white shadow-xl border-4 border-white focus:border-blue-400 transition-all outline-none text-xl font-bold placeholder:text-slate-300"
                                    disabled={loading}
                                />
                                <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-200 group-hover:text-blue-200 transition-colors" />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-4 px-8 bg-blue-600 text-white rounded-[2rem] shadow-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                            >
                                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
