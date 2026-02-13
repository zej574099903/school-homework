"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, HelpCircle, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

// --- Types ---
type GridSize = 3 | 4;

// --- Utils ---
const isSolvable = (tiles: number[], size: GridSize): boolean => {
    let inversions = 0;
    const filteredTiles = tiles.filter(t => t !== 0);
    for (let i = 0; i < filteredTiles.length; i++) {
        for (let j = i + 1; j < filteredTiles.length; j++) {
            if (filteredTiles[i] > filteredTiles[j]) inversions++;
        }
    }

    if (size === 3) {
        return inversions % 2 === 0;
    } else {
        // For 4x4, it's solvable if:
        // (odd row from bottom AND even inversions) OR (even row from bottom AND odd inversions)
        const emptyIndex = tiles.indexOf(0);
        const rowFromBottom = size - Math.floor(emptyIndex / size);
        if (rowFromBottom % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            return inversions % 2 !== 0;
        }
    }
};

const getTargetState = (size: GridSize, type: 'normal' | 'reverse' = 'normal') => {
    const count = size * size;
    const tiles = Array.from({ length: count - 1 }, (_, i) => i + 1);
    if (type === 'reverse') tiles.reverse();
    return [...tiles, 0];
};

export default function MagicKlotski() {
    const [size, setSize] = useState<GridSize>(3);
    const [tiles, setTiles] = useState<number[]>([]);
    const [target, setTarget] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [riddle, setRiddle] = useState("将数字按 1, 2, 3... 的顺序排好，开启密室大门！");
    const [grade, setGrade] = useState("二年级");

    // --- Core Game Logic ---
    const initGame = useCallback(async (newSize: GridSize = size) => {
        setLoading(true);
        let targetType: 'normal' | 'reverse' = 'normal';

        try {
            const savedGrade = localStorage.getItem("student-grade") || "二年级";
            const res = await axios.post("/api/math/klotski", { grade: savedGrade });
            setRiddle(res.data.riddle);
            targetType = res.data.targetType;
        } catch (error) {
            console.error("Failed to fetch riddle", error);
        }

        const solved = getTargetState(newSize, targetType);
        setTarget(solved);

        let shuffled: number[];
        do {
            shuffled = [...solved].sort(() => Math.random() - 0.5);
        } while (!isSolvable(shuffled, newSize) || JSON.stringify(shuffled) === JSON.stringify(solved));

        setTiles(shuffled);
        setMoves(0);
        setIsSolved(false);
        setLoading(false);
    }, [size]);

    useEffect(() => {
        const savedGrade = localStorage.getItem("student-grade") || "二年级";
        setGrade(savedGrade);
        const newSize: GridSize = (savedGrade === "一年级" || savedGrade === "二年级") ? 3 : 4;
        setSize(newSize);
        initGame(newSize);
    }, []);

    const moveTile = (index: number) => {
        if (isSolved) return;

        const emptyIndex = tiles.indexOf(0);
        const row = Math.floor(index / size);
        const col = index % size;
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow);

        if (isAdjacent) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(prev => prev + 1);

            if (JSON.stringify(newTiles) === JSON.stringify(target)) {
                setIsSolved(true);
            }
        }
    };

    // --- Keyboard Support ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSolved) return;
            const emptyIndex = tiles.indexOf(0);
            const row = Math.floor(emptyIndex / size);
            const col = emptyIndex % size;
            let targetIndex = -1;

            if (e.key === "ArrowUp" && row < size - 1) targetIndex = emptyIndex + size;
            if (e.key === "ArrowDown" && row > 0) targetIndex = emptyIndex - size;
            if (e.key === "ArrowLeft" && col < size - 1) targetIndex = emptyIndex + 1;
            if (e.key === "ArrowRight" && col > 0) targetIndex = emptyIndex - 1;

            if (targetIndex !== -1) moveTile(targetIndex);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [tiles, isSolved, size]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4 md:p-8 font-sans selection:bg-indigo-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <header className="w-full max-w-2xl flex justify-between items-center mb-8 z-10">
                <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95 group">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        符文华容道
                    </h1>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400/60">{grade} · 逻辑探险</span>
                </div>
                <button onClick={() => initGame()} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95">
                    <RefreshCw className="w-6 h-6" />
                </button>
            </header>

            <main className="w-full max-w-md flex flex-col items-center z-10">
                {/* Riddle Panel */}
                <div className="w-full glass-panel mb-8 p-6 rounded-[2rem] border-2 border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <HelpCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> 符文大师的小贴士:
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed italic">
                        "{riddle}"
                    </p>
                </div>

                {/* Game Board */}
                <div
                    className={cn(
                        "grid gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-4 border-white/10 shadow-2xl relative",
                        size === 3 ? "grid-cols-3 w-[320px] h-[320px] md:w-[400px] md:h-[400px]" : "grid-cols-4 w-[320px] h-[320px] md:w-[440px] md:h-[440px]"
                    )}
                >
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-12 h-12 animate-spin text-indigo-400" />
                        </div>
                    ) : (
                        tiles.map((tile, i) => (
                            <button
                                key={i}
                                onClick={() => moveTile(i)}
                                className={cn(
                                    "flex items-center justify-center rounded-2xl text-2xl md:text-4xl font-black transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 select-none",
                                    tile === 0
                                        ? "bg-transparent border-transparent cursor-default"
                                        : "bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-900 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
                                )}
                            >
                                {tile !== 0 && tile}
                            </button>
                        ))
                    )}
                </div>

                {/* Stats & HUD */}
                <div className="mt-8 flex justify-between w-full px-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-white/40 mb-1">移动步数</span>
                        <span className="text-3xl font-black text-indigo-400">{moves}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-white/40 mb-1">最佳成绩</span>
                        <span className="text-3xl font-black text-purple-400">--</span>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {isSolved && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="max-w-sm w-full bg-gradient-to-b from-indigo-900 to-slate-900 rounded-[3rem] p-8 text-center border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(250,204,21,0.4)] animate-bounce">
                            <Trophy className="w-12 h-12 text-indigo-900" />
                        </div>
                        <h2 className="text-3xl font-black mb-2">密室开启!</h2>
                        <p className="text-indigo-200 mb-8 font-medium">
                            你用了 <span className="text-white font-bold">{moves}</span> 步成功修复了远古符文。快进入下一关吧！
                        </p>
                        <button
                            onClick={() => initGame()}
                            className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95"
                        >
                            下一关
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
