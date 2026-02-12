"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Brain, RefreshCw, Trophy } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

type Message = {
    role: "ai" | "user" | "system";
    content: string;
    isRiddle?: boolean;
};

export default function RiddlePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "我是谜题精灵 🧞‍♂️！想挑战我的脑筋急转弯吗？" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [currentRiddle, setCurrentRiddle] = useState<{ riddle: string, answer: string, hint: string } | null>(null);
    const [mode, setMode] = useState<"ai_ask" | "user_ask">("ai_ask"); // ai_ask: AI出题, user_ask: 用户出题
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userInput = input.trim();
        setInput("");

        // Add user message
        setMessages(prev => [...prev, { role: "user", content: userInput }]);
        setLoading(true);

        try {
            if (mode === "ai_ask") {
                if (!currentRiddle) {
                    // Start new riddle if none exists
                    await startNewRiddle();
                    return;
                }
                const res = await axios.post("/api/riddle", {
                    type: "guess",
                    history: { answer: currentRiddle.answer },
                    userInput: userInput
                });

                const data = res.data;
                setMessages(prev => [...prev, { role: "ai", content: data.message }]);

                if (data.isCorrect) {
                    setScore(prev => prev + 10);
                    setCurrentRiddle(null); // Clear riddle to prompt for new one
                    // Trigger confetti or something
                }
            } else {
                // User ask AI
                const res = await axios.post("/api/riddle", {
                    type: "ai_guess",
                    userInput: userInput
                });
                setMessages(prev => [...prev, { role: "ai", content: res.data.reply }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "system", content: "哎呀，网络好像有点卡..." }]);
        } finally {
            setLoading(false);
        }
    };

    const startNewRiddle = async () => {
        setLoading(true);
        // setMode("ai_ask"); // Keep current mode
        try {
            const res = await axios.post("/api/riddle", { type: "generate" });
            const data = res.data;
            setCurrentRiddle(data);
            setMessages(prev => [...prev, { role: "ai", content: data.riddle, isRiddle: true }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "system", content: "哎呀，我想不出谜语了..." }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === "ai_ask" ? "user_ask" : "ai_ask");
        setMessages(prev => [...prev, { role: "system", content: mode === "ai_ask" ? "现在换你考考我吧！🧞‍♂️" : "那我就来考考你！🧞‍♂️" }]);
        setCurrentRiddle(null);
    };

    return (
        <div className="min-h-screen bg-violet-50 flex flex-col p-4 md:p-6 max-w-3xl mx-auto font-sans">
            {/* Header */}
            <header className="flex items-center justify-between mb-4 sticky top-0 z-10 py-2">
                <Link href="/" className="bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-violet-100 text-violet-600 hover:bg-violet-50 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-violet-100 font-bold text-violet-700">
                    <Brain className="w-4 h-4" />
                    <span>AI 猜谜大王</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1.5 rounded-full text-amber-700 font-bold border border-yellow-200 shadow-sm">
                    <Trophy className="w-4 h-4" />
                    <span>{score}</span>
                </div>
            </header>

            {/* Content */}
            <div className="flex-grow flex flex-col glass-card rounded-3xl overflow-hidden shadow-xl border-violet-100 bg-white/70 relative">
                <div className="flex-grow p-4 overflow-y-auto space-y-4" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" ? "justify-end" : "justify-start")}>
                            {msg.role === "ai" && <div className="text-3xl mr-2 self-end">🧞‍♂️</div>}
                            <div className={cn(
                                "max-w-[85%] rounded-2xl p-4 shadow-sm relative text-lg font-medium",
                                msg.role === "user" ? "bg-violet-500 text-white rounded-br-none" :
                                    msg.role === "system" ? "bg-slate-100 text-slate-500 text-xs mx-auto text-center py-1 px-3 shadow-none w-fit" : "bg-white text-slate-800 rounded-bl-none border border-violet-100"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-violet-400 text-sm ml-12 animate-pulse font-bold">🧞‍♂️ 正在思考...</div>}
                </div>

                {/* Actions */}
                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-violet-100 flex flex-col gap-3">
                    {mode === "ai_ask" && !currentRiddle && (
                        <button
                            onClick={startNewRiddle}
                            disabled={loading}
                            className="w-full py-3 bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            {messages.length === 1 ? "开始猜谜" : "再来一题"}
                        </button>
                    )}

                    <div className="flex gap-2 items-center">
                        <button onClick={toggleMode} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors" title={mode === "ai_ask" ? "切换到我出题" : "切换到AI出题"}>
                            <RefreshCw className="w-5 h-5" />
                        </button>

                        <div className="flex-grow relative">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                placeholder={mode === "ai_ask" ? (currentRiddle ? "输入你的猜想..." : "点击上方按钮开始") : "输入你的谜语..."}
                                disabled={loading || (mode === "ai_ask" && !currentRiddle)}
                                className="w-full p-3 pl-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-violet-400 focus:bg-white focus:outline-none transition-all shadow-inner font-medium text-slate-700"
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="p-3 bg-violet-500 text-white rounded-xl shadow-md hover:bg-violet-600 active:scale-95 disabled:opacity-50 transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
