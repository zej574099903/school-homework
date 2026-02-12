"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, BookOpen, User, Lightbulb, Volume2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type Message = {
    role: "user" | "ai" | "system";
    content: string;
    pinyin?: string;
    meaning?: string;
    isHint?: boolean;
};

export default function IdiomPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "system", content: "喵~ 欢迎来到成语接龙！我是这里的守关者【成语大师喵】🐱。你要出招吗？" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [hintLoading, setHintLoading] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userIdiom = input.trim();
        setInput("");
        setLoading(true);

        // Add user message immediately
        const newMessages = [...messages, { role: "user" as const, content: userIdiom }];
        setMessages(newMessages);

        try {
            const res = await axios.post("/api/idiom", {
                history: history,
                lastIdiom: userIdiom,
                type: "user"
            });

            const data = res.data;

            if (!data.valid) {
                setMessages(prev => [...prev, { role: "system" as const, content: data.message || "喵？这好像不是成语哦，或者没接上，再试一次吧！🐱" }]);
            } else {
                // User correct
                setHistory(prev => [...prev, userIdiom, data.nextIdiom]);

                // AI Response with slight delay for realism
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: "ai" as const,
                        content: data.nextIdiom,
                        pinyin: data.pinyin,
                        meaning: data.meaning
                    }]);
                }, 500);
            }
        } catch (error) {
            console.error("Failed to fetch idiom response", error);
            setMessages(prev => [...prev, { role: "system" as const, content: "喵...我的脑子卡住了，请再试一次。" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleHint = async () => {
        if (loading || hintLoading || history.length === 0) return;

        setHintLoading(true);
        try {
            const res = await axios.post("/api/idiom", {
                history: history,
                lastIdiom: "",
                type: "hint"
            });

            const data = res.data;
            if (data.hint) {
                setMessages(prev => [...prev, {
                    role: "system" as const,
                    content: `💡 提示: ${data.hint} (${data.firstChar}...)`,
                    isHint: true
                }]);
            }
        } catch (error) {
            console.error("Hint error", error);
        } finally {
            setHintLoading(false);
        }
    };

    const handleAnswer = async () => {
        if (loading || hintLoading || history.length === 0) return;

        setHintLoading(true);
        try {
            const res = await axios.post("/api/idiom", {
                history: history,
                lastIdiom: "",
                type: "answer"
            });

            const data = res.data;
            if (data.answer) {
                // Add answer as user message
                setMessages(prev => [...prev, {
                    role: "user" as const,
                    content: data.answer
                }]);
                setHistory(prev => [...prev, data.answer]);

                // Then AI continues
                if (data.nextIdiom) {
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            role: "ai" as const,
                            content: data.nextIdiom,
                            pinyin: data.pinyin,
                            meaning: data.meaning
                        }]);
                        setHistory(prev => [...prev, data.nextIdiom]);
                    }, 500);
                }
            }
        } catch (error) {
            console.error("Answer error", error);
        } finally {
            setHintLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-emerald-100 overflow-hidden">
            {/* Fixed Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-4 md:px-6 bg-gradient-to-b from-green-50 to-emerald-100 border-b border-emerald-100">
                <Link href="/" className="bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-emerald-100 text-emerald-600 hover:bg-emerald-50 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-emerald-100 font-bold text-emerald-700">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm md:text-base">成语接龙排位赛</span>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Scrollable Game Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-2 max-w-3xl mx-auto w-full">
                <div className="space-y-6" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-4 duration-500", msg.role === "user" ? "justify-end" : "justify-start")}>

                            {/* Avatar for AI */}
                            {msg.role !== "user" && (
                                <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-white shadow-sm flex items-center justify-center text-xl mr-2 shrink-0 self-end mb-1">
                                    {msg.role === "ai" ? "🐱" : "🤖"}
                                </div>
                            )}

                            <div className={cn(
                                "max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm relative",
                                msg.role === "user"
                                    ? "bg-emerald-500 text-white rounded-br-none shadow-emerald-200"
                                    : msg.role === "system"
                                        ? "bg-amber-50 text-amber-800 border border-amber-100 text-sm font-medium w-fit mx-auto shadow-none"
                                        : "bg-white text-slate-800 border border-emerald-100 rounded-bl-none shadow-slate-100"
                            )}>
                                {msg.role === "ai" && (
                                    <div className="absolute -top-3 left-4 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                        成语大师喵
                                    </div>
                                )}

                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <p className={cn("text-lg font-bold tracking-widest", msg.role === "user" ? "text-white" : "text-slate-800")}>
                                        {msg.content}
                                    </p>
                                    {msg.pinyin && (
                                        <span className="text-xs font-mono opacity-60">
                                            {msg.pinyin}
                                        </span>
                                    )}
                                </div>

                                {msg.meaning && (
                                    <div className="mt-2 pt-2 border-t border-black/5 text-sm leading-relaxed opacity-90">
                                        <span className="font-bold text-emerald-600">释义：</span>{msg.meaning}
                                    </div>
                                )}
                            </div>

                            {/* Avatar for User */}
                            {msg.role === "user" && (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-xl ml-2 shrink-0 self-end mb-1">
                                    🧒
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start items-end">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-white shadow-sm flex items-center justify-center text-xl mr-2">🐱</div>
                            <div className="bg-white border border-emerald-100 rounded-2xl p-4 rounded-bl-none shadow-sm flex items-center gap-1.5 h-12">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fixed Bottom Input Area */}
            <div className="flex-shrink-0 p-4 md:px-6 bg-white border-t border-emerald-100 max-w-3xl mx-auto w-full">
                {/* Help Buttons (Only show if history exists) */}
                {history.length > 0 && (
                    <div className="flex gap-2 justify-center mb-3">
                        <button
                            onClick={handleHint}
                            disabled={hintLoading || loading}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                            {hintLoading ? "思考中..." : "给我提示"}
                        </button>
                        <button
                            onClick={handleAnswer}
                            disabled={hintLoading || loading}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                            {hintLoading ? "思考中..." : "直接给答案"}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入成语，如：一马当先"
                        className="flex-1 min-w-0 px-3 md:px-4 py-3 md:py-3.5 rounded-xl bg-slate-50 border-2 border-transparent focus:border-emerald-400 focus:bg-white focus:outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 text-base md:text-lg shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="flex-shrink-0 p-3 md:p-3.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
                    >
                        <Send className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
