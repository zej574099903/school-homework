"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles, Languages, Volume2, Star } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type WordCard = {
    word: string;
    sentence: string;
    meaning: string;
    emoji: string;
    scene: string;
};

export default function WordPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<WordCard | null>(null);
    const [collection, setCollection] = useState<WordCard[]>([]);
    const [showCollection, setShowCollection] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Initial random words
    const suggestions = ["Cat", "Robot", "Ice Cream", "Dragon", "Pizza"];

    const handleTransform = async (wordToSearch: string = input) => {
        const term = wordToSearch.trim();
        if (!term || loading) return;

        setLoading(true);
        setResult(null);
        setShowCollection(false);
        setInput(term); // Sync input if clicked from suggestion

        try {
            const res = await axios.post("/api/word", { word: term });
            const newCard = { ...res.data, word: term };
            setResult(newCard);

            // Add to collection if not exists
            setCollection(prev => {
                const exists = prev.some(c => c.word.toLowerCase() === term.toLowerCase());
                return exists ? prev : [newCard, ...prev];
            });

            // Auto play audio
            speak(term + ". " + res.data.sentence);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);

            // Try to set a good voice (optional optimization)
            // const voices = window.speechSynthesis.getVoices();
            // const zhVoice = voices.find(v => v.lang.includes('zh'));
            // if (zhVoice) utterance.voice = zhVoice;

            utterance.rate = 0.9; // Slightly slower
            utterance.pitch = 1.1; // Slightly higher pitch for fun

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        } else {
            alert("抱歉，你的浏览器不支持语音播放 😢");
        }
    };

    return (
        <div className="min-h-screen bg-cyan-50 flex flex-col p-4 md:p-6 max-w-3xl mx-auto font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-6 sticky top-0 z-20 py-2">
                <Link href="/" className="bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-cyan-100 text-cyan-600 hover:bg-cyan-50 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-cyan-100 font-bold text-cyan-700">
                    <Languages className="w-4 h-4" />
                    <span>单词魔法实验室</span>
                </div>
                <button
                    onClick={() => setShowCollection(!showCollection)}
                    className={cn(
                        "p-2.5 rounded-full shadow-sm border transition-all relative",
                        showCollection
                            ? "bg-cyan-500 text-white border-cyan-500"
                            : "bg-white/80 border-cyan-100 text-cyan-600 hover:bg-cyan-50"
                    )}
                    title="我的单词本"
                >
                    <Star className={cn("w-5 h-5", showCollection ? "fill-white" : "")} />
                    {collection.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-bounce">
                            {collection.length}
                        </span>
                    )}
                </button>
            </header>

            {/* Main Interaction Area */}
            <div className="flex-grow flex flex-col items-center justify-start relative">

                {/* Input Area (Always visible) */}
                <div className="w-full max-w-md relative z-20 mb-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-cyan-200 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTransform()}
                            placeholder="输入一个单词 (如: Tiger)"
                            className="w-full pl-6 pr-16 py-4 rounded-full bg-white border-2 border-cyan-100 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100/50 transition-all text-xl font-bold shadow-lg placeholder:text-slate-300 placeholder:font-normal text-center"
                        />
                        <button
                            onClick={() => handleTransform()}
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 text-white rounded-full shadow-md hover:bg-cyan-600 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center p-3"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Content Switching: Result vs Collection */}
                {showCollection ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="col-span-1 md:col-span-2 text-center text-cyan-800 font-bold mb-2 flex items-center justify-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            我收集的魔法卡片 ({collection.length})
                        </h2>
                        {collection.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-400">
                                还没有收集到卡片哦，快去变身单词吧！
                            </div>
                        ) : (
                            collection.map((card, idx) => (
                                <div key={idx} onClick={() => { setResult(card); setShowCollection(false); speak(card.word); }} className="bg-white p-4 rounded-2xl shadow-sm border border-cyan-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all">
                                    <div className="text-4xl bg-cyan-50 w-16 h-16 rounded-xl flex items-center justify-center border border-cyan-100">
                                        {card.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg capitalize">{card.word}</h3>
                                        <p className="text-slate-500 text-xs">{card.meaning}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <>
                        {/* Result Card */}
                        {result ? (
                            <div className="w-full glass-card bg-white/80 p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-cyan-100 mb-8 animate-in zoom-in-95 duration-500 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/50 rounded-full blur-3xl -z-10 group-hover:bg-cyan-300/50 transition-colors"></div>

                                <div className="text-center">
                                    <div className="text-8xl mb-6 animate-bounce-slow filter drop-shadow-md cursor-pointer hover:scale-110 transition-transform" onClick={() => speak(result.word)}>
                                        {result.emoji}
                                    </div>
                                    <h2 className="text-5xl font-black text-slate-800 mb-2 tracking-tight capitalize">{result.word}</h2>
                                    <p className="text-xl text-cyan-600 font-bold mb-6 flex items-center justify-center gap-2">
                                        {result.meaning}
                                        <button onClick={() => speak(result.word)} className="p-2 bg-cyan-100 rounded-full text-cyan-600 hover:bg-cyan-200 transition-colors">
                                            <Volume2 className={cn("w-4 h-4", isSpeaking && "animate-pulse")} />
                                        </button>
                                    </p>

                                    <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-3xl border border-cyan-200 relative shadow-inner mb-6">
                                        <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
                                            {result.sentence}
                                        </p>
                                        <button
                                            onClick={() => speak(result.sentence)}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-cyan-400 hover:text-cyan-600 transition-colors hover:scale-110 active:scale-95"
                                        >
                                            <Volume2 className={cn("w-5 h-5", isSpeaking && "animate-pulse")} />
                                        </button>
                                    </div>

                                    <div className="text-slate-500 text-sm italic bg-white/50 py-2 px-4 rounded-full inline-block">
                                        🌟 场景：{result.scene}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4">
                                <p className="text-slate-400 font-medium mb-4">👇 试试这些魔法咒语 👇</p>
                                <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
                                    {suggestions.map(word => (
                                        <button
                                            key={word}
                                            onClick={() => handleTransform(word)}
                                            className="px-5 py-2.5 bg-white border border-cyan-100 rounded-full shadow-sm hover:shadow-md hover:border-cyan-300 hover:text-cyan-600 hover:scale-105 active:scale-95 transition-all text-slate-600 font-bold"
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-12 opacity-50 pointer-events-none">
                                    <Sparkles className="w-24 h-24 text-cyan-200 mx-auto animate-pulse" />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
