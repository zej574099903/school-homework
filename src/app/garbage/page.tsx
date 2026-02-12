"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Camera } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function GarbagePage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleCheck = async () => {
        if (!input.trim() || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await axios.post("/api/garbage", { item: input });
            setResult(res.data);
        } catch (error) {
            console.error("Failed to classify garbage", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCheck();
    };

    const categories = [
        { key: "Wet", name: "湿垃圾", color: "bg-amber-800", icon: "🍲", desc: "易腐烂的生物质废弃物" },
        { key: "Dry", name: "干垃圾", color: "bg-slate-800", icon: "🗑️", desc: "除可回收、有害、湿垃圾以外的废弃物" },
        { key: "Recyclable", name: "可回收物", color: "bg-blue-600", icon: "♻️", desc: "适宜回收和可循环利用的废弃物" },
        { key: "Hazardous", name: "有害垃圾", color: "bg-red-600", icon: "☠️", desc: "对人体健康或自然环境造成直接或潜在危害" },
    ];

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <Link href="/" className="bg-white p-2.5 rounded-full shadow-sm border border-orange-100 text-orange-600 hover:bg-orange-50 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-orange-100 font-bold text-orange-700">
                    <Search className="w-4 h-4" />
                    <span>垃圾分类小卫士</span>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center">

                {/* Search Box */}
                <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-2 flex items-center gap-2 mb-10 transition-all focus-within:ring-4 focus-within:ring-orange-200">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入物品名称，例如：香蕉皮..."
                        className="flex-grow px-4 py-3 bg-transparent outline-none text-lg font-bold text-slate-700 placeholder:font-normal placeholder:text-slate-400"
                    />
                    <button
                        type="button" // Prevent form submission refresh if wrapped
                        className="p-3 text-orange-400 hover:bg-orange-50 rounded-xl transition-colors"
                        title="拍照识别（开发中）"
                    >
                        <Camera className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleCheck}
                        disabled={loading || !input.trim()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : "查询"}
                    </button>
                </div>

                {/* Result Display */}
                {result && (
                    <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-500 mb-10">
                        <div className={cn(
                            "rounded-3xl p-8 text-center shadow-xl border-4 border-white relative overflow-hidden",
                            result.category === "Wet" ? "bg-amber-100 text-amber-900" :
                                result.category === "Dry" ? "bg-slate-200 text-slate-800" :
                                    result.category === "Recyclable" ? "bg-blue-100 text-blue-900" :
                                        "bg-red-100 text-red-900"
                        )}>
                            <div className="text-6xl mb-4 animate-bounce">{result.icon}</div>
                            <h2 className="text-3xl font-black mb-2">{result.name}</h2>
                            <p className="text-lg font-medium opacity-80 mb-6">{result.item} 属于 {result.name}</p>

                            <div className="bg-white/60 rounded-xl p-4 text-sm font-medium backdrop-blur-sm">
                                💡 专家提示：{result.explanation}
                            </div>
                        </div>
                    </div>
                )}

                {/* Trash Cans Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {categories.map((cat) => (
                        <div
                            key={cat.key}
                            className={cn(
                                "rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 border-2 border-transparent",
                                result && result.category === cat.key
                                    ? "scale-110 shadow-xl ring-4 ring-offset-2 ring-orange-300 z-10 bg-white"
                                    : "bg-white/50 hover:bg-white hover:shadow-md",
                                result && result.category !== cat.key && result !== null ? "opacity-50 blur-[1px]" : ""
                            )}
                        >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2", cat.color, "text-white shadow-sm")}>
                                {cat.icon}
                            </div>
                            <h3 className="font-bold text-slate-700">{cat.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-tight">{cat.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
