"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Star, RefreshCw, BookOpen, Scroll } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type IdiomNode = {
    idiom: string;
    pinyin: string;
    meaning: string;
    derivation?: string;
    isUser: boolean;
    isHint?: boolean;
};

export default function IdiomSolitaire() {
    const [grade, setGrade] = useState("二年级");
    const [history, setHistory] = useState<IdiomNode[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stars, setStars] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedGrade = localStorage.getItem("student-grade") || "二年级";
        setGrade(savedGrade);
        setHistory([{
            idiom: "一心一意",
            pinyin: "yī xīn yī yì",
            meaning: "形容做事非常专心，不分心。",
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

        const lastWord = history[history.length - 1]?.idiom;
        setError(null);
        setLoading(true);

        try {
            const res = await axios.post("/api/chinese/idiom-chain", {
                word: input.trim(),
                lastWord,
                grade,
                type: "play"
            });

            if (res.data.status === "error") {
                setError(res.data.message);
            } else {
                setHistory(prev => [
                    ...prev,
                    { idiom: input.trim(), pinyin: "", meaning: "", isUser: true },
                    {
                        idiom: res.data.next_idiom,
                        pinyin: res.data.pinyin,
                        meaning: res.data.meaning,
                        derivation: res.data.derivation,
                        isUser: false
                    }
                ]);
                setInput("");
                setStars(prev => prev + 1);
            }
        } catch (err) {
            setError("成语之神休息了，等会儿再试吧！");
        } finally {
            setLoading(false);
        }
    };

    const handleHint = async () => {
        if (loading) return;
        const lastWord = history[history.length - 1]?.idiom;
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/api/chinese/idiom-chain", {
                lastWord,
                grade,
                type: "hint"
            });

            if (res.data.status === "success") {
                setHistory(prev => [
                    ...prev,
                    {
                        idiom: res.data.next_idiom,
                        pinyin: res.data.pinyin,
                        meaning: res.data.meaning,
                        derivation: res.data.derivation,
                        isUser: false,
                        isHint: true
                    }
                ]);
                setError(res.data.message || "博士来帮你啦！");
            }
        } catch (err) {
            setError("暂时没想出来，再换个试试？");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#fcf8f2] text-slate-800 flex flex-col font-serif selection:bg-orange-100 relative overflow-hidden">
            {/* Ink Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <header className="p-6 flex justify-between items-center z-50 bg-white/40 backdrop-blur-md border-b border-orange-100 shadow-sm">
                <Link href="/" className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-orange-200 transition-all active:scale-95 group shadow-sm">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform text-orange-700" />
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                        成语接龙 · 雅集 🏮
                    </h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-full shadow-lg border-2 border-white">
                    <Star className="w-4 h-4 fill-white" />
                    <span className="text-sm font-black">{stars}</span>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative flex flex-col">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 md:space-y-12 no-scrollbar pb-32"
                >
                    <AnimatePresence mode="popLayout">
                        {history.map((node, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full flex-col items-center",
                                    node.isUser ? "text-right" : "text-left"
                                )}
                            >
                                <div className={cn(
                                    "max-w-xl w-full p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 md:border-4 transition-all relative overflow-hidden",
                                    node.isUser ? "bg-white border-blue-100 shadow-sm self-end rounded-br-none" : "bg-white border-orange-100 shadow-sm self-start rounded-bl-none",
                                    node.isHint && "border-purple-200 bg-purple-50/30"
                                )}>
                                    {node.isHint && (
                                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] px-3 py-1 rounded-bl-xl font-bold">
                                            求助提示
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-xs md:text-sm font-bold text-slate-400 mb-1 md:mb-2 pinyin-font tracking-wide">
                                            {node.pinyin}
                                        </span>
                                        <span className="text-3xl md:text-6xl font-black text-slate-900 mb-2 md:mb-4 tracking-[0.1em] md:tracking-[0.2em]">{node.idiom}</span>
                                        {node.meaning && (
                                            <div className="bg-slate-50/80 p-3 md:p-4 rounded-2xl md:rounded-3xl w-full border border-slate-100/50">
                                                <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-bold mb-1 md:mb-2">
                                                    <BookOpen className="w-3 h-3" />
                                                    成语释义
                                                </div>
                                                <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed">{node.meaning}</p>
                                                {node.derivation && (
                                                    <p className="mt-1 md:mt-2 text-[10px] md:text-xs text-orange-600/60 italic font-medium">—— {node.derivation}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col items-center gap-2 opacity-20">
                                    <div className="w-0.5 h-8 bg-slate-300"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <div className="flex flex-col items-center gap-4 opacity-50">
                            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                            <span className="text-sm font-bold text-orange-800">成语博士正在思考...</span>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 bg-gradient-to-t from-[#fcf8f2] via-[#fcf8f2]/90 to-transparent pt-12 md:pt-16">
                    <div className="max-w-2xl mx-auto flex flex-col gap-3 relative">
                        {error && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute -top-12 md:-top-16 inset-x-0 bg-orange-100 text-orange-700 px-4 md:px-6 py-2 rounded-2xl text-center text-xs md:text-sm font-black border-2 border-orange-200 shadow-lg z-20"
                            >
                                {error}
                            </motion.div>
                        )}
                        <form onSubmit={handlePlay} className="flex gap-2 md:gap-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`接“${history[history.length - 1]?.idiom.slice(-1)}”...`}
                                className="flex-1 py-3 md:py-5 px-4 md:px-8 rounded-2xl md:rounded-[2.5rem] bg-white shadow-xl border-2 md:border-4 border-transparent focus:border-orange-400 transition-all outline-none text-lg md:text-2xl font-black placeholder:text-slate-200"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleHint}
                                disabled={loading}
                                className="p-3 md:p-5 bg-white text-purple-600 rounded-2xl md:rounded-[2.5rem] shadow-xl border-2 border-purple-100 hover:bg-purple-50 transition-all active:scale-95 disabled:opacity-50"
                                title="求助博士"
                            >
                                <Sparkles className="w-5 h-5 md:w-8 md:h-8" />
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-3 md:p-5 px-6 md:px-10 bg-orange-600 text-white rounded-2xl md:rounded-[2.5rem] shadow-xl hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 md:w-8 md:h-8 animate-spin" /> : <Scroll className="w-5 h-5 md:w-8 md:h-8" />}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
