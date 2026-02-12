"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, BookOpen, Sparkles, Pencil, RotateCw } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type StorySegment = {
    role: "ai" | "user";
    content: string;
};

export default function StoryPage() {
    const [segments, setSegments] = useState<StorySegment[]>([
        { role: "ai", content: "很久很久以前，在一个神秘的糖果森林里，住着一只爱吃巧克力的小松鼠... 🐿️🍫" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [segments]);

    const handleSend = async () => {
        if (!input.trim() || loading || isEnd) return;

        const userText = input.trim();
        setInput("");
        setLoading(true);

        const newSegments = [...segments, { role: "user" as const, content: userText }];
        setSegments(newSegments);

        try {
            const history = newSegments.map(s => s.content);

            const res = await axios.post("/api/story", {
                history: history,
                userInput: userText
            });

            const data = res.data;

            setSegments(prev => [...prev, { role: "ai" as const, content: data.content }]);

            if (data.isEnd) {
                setIsEnd(true);
            }

        } catch (error) {
            console.error("Story API Error", error);
            // Fallback
            setSegments(prev => [...prev, { role: "ai" as const, content: "哎呀，灵感突然断了，我们要不要重新开始一个故事？🤔" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setSegments([{ role: "ai", content: "很久很久以前，在一个神秘的糖果森林里，住着一只爱吃巧克力的小松鼠... 🐿️🍫" }]);
        setIsEnd(false);
        setInput("");
    };

    return (
        <div className="min-h-screen bg-[#fdf6e3] flex flex-col p-4 md:p-6 max-w-4xl mx-auto font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-6 sticky top-0 z-10 py-2 bg-[#fdf6e3]/90 backdrop-blur-sm">
                <Link href="/" className="bg-white p-2.5 rounded-full shadow-sm border border-amber-100 text-amber-600 hover:bg-amber-50 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm border border-amber-100 font-bold text-amber-700 text-lg">
                    <BookOpen className="w-5 h-5" />
                    <span>AI 故事大合奏</span>
                </div>
                <button
                    onClick={handleRestart}
                    className="bg-white p-2.5 rounded-full shadow-sm border border-amber-100 text-amber-600 hover:bg-amber-50 active:scale-90 transition-all"
                    title="重新开始"
                >
                    <RotateCw className="w-5 h-5" />
                </button>
            </header>

            {/* Story Book Area */}
            <div className="flex-grow flex flex-col bg-white rounded-[40px] shadow-2xl border-4 border-[#eaddcf] overflow-hidden relative mx-2 mb-4">
                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent z-10 pointer-events-none"></div>

                {/* Content */}
                <div className="flex-grow p-6 md:p-10 overflow-y-auto space-y-8" ref={scrollRef}>
                    {segments.map((seg, idx) => (
                        <div key={idx} className={cn(
                            "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700",
                            seg.role === "user" ? "items-end" : "items-start"
                        )}>
                            <div className="flex items-center gap-2 mb-1 px-2">
                                <span className="text-2xl">{seg.role === "ai" ? "🤖" : "✍️"}</span>
                                <span className={cn("text-xs font-bold uppercase tracking-wider", seg.role === "ai" ? "text-slate-400" : "text-amber-500")}>
                                    {seg.role === "ai" ? "AI 故事大王" : "小小作家"}
                                </span>
                            </div>

                            <div className={cn(
                                "max-w-[90%] md:max-w-[80%] text-lg md:text-xl leading-relaxed p-6 rounded-3xl shadow-sm relative",
                                seg.role === "ai"
                                    ? "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100 font-serif"
                                    : "bg-amber-50 text-amber-900 rounded-tr-none border border-amber-100 font-medium"
                            )}>
                                {seg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex flex-col items-start gap-2 animate-pulse">
                            <div className="flex items-center gap-2 mb-1 px-2">
                                <span className="text-2xl">🤖</span>
                                <span className="text-xs font-bold text-slate-400">AI 正在构思...</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100 w-32 h-16 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEnd && (
                        <div className="flex justify-center py-8">
                            <div className="bg-amber-100 text-amber-800 px-6 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
                                <Sparkles className="w-5 h-5" />
                                故事圆满结束啦！
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-[#fdfcf8] border-t border-[#eaddcf]">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder={isEnd ? "点击上方按钮重新开始" : "接着刚才的情节说..."}
                            disabled={loading || isEnd}
                            className="w-full pl-6 pr-14 py-5 rounded-full bg-white border-2 border-amber-100 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100/50 transition-all text-lg font-medium shadow-inner placeholder:text-slate-300 disabled:opacity-50 disabled:bg-slate-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim() || isEnd}
                            className="absolute right-2 p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="text-center mt-3 text-xs text-slate-400 flex items-center justify-center gap-1">
                        <Pencil className="w-3 h-3" />
                        你可以说："然后他们遇到了一只魔法猫"
                    </div>
                </div>
            </div>
        </div>
    );
}
