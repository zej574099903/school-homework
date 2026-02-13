"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Zap, Heart, Trophy, RefreshCcw, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

type Enemy = {
    id: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    value: number;
    expression: string;
    speed: number;
    type: 'asteroid' | 'monster';
};

type Particle = {
    id: number;
    x: number;
    y: number;
    color: string;
    angle: number;
    speed: number;
    life: number;
};

// --- Utils ---
const generateProblem = (gradeMap: number, level: number) => {
    // Difficulty Scaling based on Grade (1-6) and Level (Wave)
    let op = '+';
    let a = 0, b = 0, answer = 0;

    // Grade 1: Add/Sub within 10-20
    if (gradeMap === 1) {
        const ops = ['+'];
        if (level > 2) ops.push('-');
        op = ops[Math.floor(Math.random() * ops.length)];

        if (op === '+') {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 10) + 5;
            b = Math.floor(Math.random() * a); // Ensure positive result
            answer = a - b;
        }
    }
    // Grade 2: Add/Sub within 100
    else if (gradeMap === 2) {
        const ops = ['+', '-'];
        op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') {
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 30) + 10;
            b = Math.floor(Math.random() * (a - 5));
            answer = a - b;
        }
    }
    // Grade 3-4: Multiplication table, Division basics
    else if (gradeMap <= 4) {
        const ops = ['+', '-', '*', '*']; // Bias towards multiplication
        op = ops[Math.floor(Math.random() * ops.length)];

        if (op === '*') {
            a = Math.floor(Math.random() * 9) + 1;
            b = Math.floor(Math.random() * 9) + 1; // 9x9 table
            answer = a * b;
        } else if (op === '+') {
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * 50) + 10;
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * a);
            answer = a - b;
        }
    }
    // Grade 5-6: Mixed, larger numbers
    else {
        const ops = ['+', '-', '*', '*', '/'];
        op = ops[Math.floor(Math.random() * ops.length)];

        if (op === '/') {
            // Simple harvest division
            b = Math.floor(Math.random() * 8) + 2;
            answer = Math.floor(Math.random() * 10) + 1;
            a = b * answer;
        } else if (op === '*') {
            a = Math.floor(Math.random() * 12) + 2;
            b = Math.floor(Math.random() * 12) + 2;
            answer = a * b;
        } else {
            a = Math.floor(Math.random() * 100);
            b = Math.floor(Math.random() * 100);
            if (op === '-') {
                const temp = Math.max(a, b);
                b = Math.min(a, b);
                a = temp;
                answer = a - b;
            } else {
                answer = a + b;
            }
        }
    }

    return { expression: `${a} ${op} ${b}`, value: answer };
};

export default function ArithmeticDefense() {
    // --- State ---
    const [gameState, setGameState] = useState<GameState>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [inputBuffer, setInputBuffer] = useState("");
    const [grade, setGrade] = useState(2); // Default Grade 2

    // Refs for game loop to avoid closure staleness
    const enemiesRef = useRef<Enemy[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const spawnTimerRef = useRef<number>(0);
    const scoreRef = useRef(0);
    const livesRef = useRef(3);

    // Initialize Grade from LocalStorage
    useEffect(() => {
        const savedGrade = localStorage.getItem("student-grade");
        const gradeMap: Record<string, number> = {
            "一年级": 1, "二年级": 2, "三年级": 3,
            "四年级": 4, "五年级": 5, "六年级": 6
        };
        if (savedGrade && gradeMap[savedGrade]) {
            setGrade(gradeMap[savedGrade]);
        }
    }, []);

    // --- Game Loop ---
    const gameLoop = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // Spawn Logic
        spawnTimerRef.current += deltaTime;
        // Difficulty Formula: Base Rate - (Level * Step) - (Grade * Step/2)
        const spawnRate = Math.max(800, 2500 - (level * 100) - (grade * 50));

        if (spawnTimerRef.current > spawnRate) {
            const { expression, value } = generateProblem(grade, level);
            const newEnemy: Enemy = {
                id: Date.now(),
                x: Math.random() * 80 + 10, // 10% to 90% width
                y: -10,
                value,
                expression,
                speed: 0.005 + (level * 0.0005) + (grade * 0.0005),
                type: Math.random() > 0.8 ? 'monster' : 'asteroid'
            };
            enemiesRef.current.push(newEnemy);
            spawnTimerRef.current = 0;
        }

        // Update Enemies
        enemiesRef.current.forEach(enemy => {
            enemy.y += enemy.speed * deltaTime;
        });

        // Check Collisions (Bottom)
        const survivors = [];
        let hitBase = false;
        for (const enemy of enemiesRef.current) {
            if (enemy.y > 90) { // Hit base
                hitBase = true;
                createExplosion(enemy.x, 90, 'red');
            } else {
                survivors.push(enemy);
            }
        }

        if (hitBase) {
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
                setGameState('gameover');
                return; // Stop loop
            }
        }
        enemiesRef.current = survivors;

        // Update Particles
        particlesRef.current.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life -= 0.05;
        });
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);

        // Force Re-render (optimize this later if needed, but for React usually safe for simple games)
        // Actually, forcing re-render every frame in React is heavy. 
        // We'll use a ref-based approach for positions or just accept React overhead for this simple game.
        // For now, let's trigger a state update to render frame
        // To optimize: We can separate the rendering loop from logic, but for < 50 objects React is fine.

        // Trigger render
        // setRenderTrigger(prev => prev + 1); 

        // But actually, we want to update the UI. 
        // Let's rely on `requestAnimationFrame` pushing state updates.
        // NOTE: In production games we'd use a Canvas or non-React state for the loop.
        // For this educational app, passing ref content to state for rendering is okay if objects are few.

        requestRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, level, grade]);


    // Use a separate high-frequency state for rendering
    const [renderEntities, setRenderEntities] = useState<{ enemies: Enemy[], particles: Particle[] }>({ enemies: [], particles: [] });

    // Independent Render Loop (Syncing Ref to State)
    useEffect(() => {
        let frameId: number;
        const renderConf = () => {
            setRenderEntities({
                enemies: [...enemiesRef.current],
                particles: [...particlesRef.current]
            });
            frameId = requestAnimationFrame(renderConf);
        };
        if (gameState === 'playing') {
            renderConf();
        }
        return () => cancelAnimationFrame(frameId);
    }, [gameState]);


    useEffect(() => {
        if (gameState === 'playing') {
            lastTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, [gameState, gameLoop]);


    // --- Input Handling ---
    const handleInput = (num: number) => {
        const newVal = inputBuffer + num.toString();

        // Check match immediately
        const targetVal = parseInt(newVal);
        const hitIndex = enemiesRef.current.findIndex(e => e.value === targetVal);

        if (hitIndex !== -1) {
            // HIT!
            const hitEnemy = enemiesRef.current[hitIndex];
            createExplosion(hitEnemy.x, hitEnemy.y, 'gold');
            enemiesRef.current.splice(hitIndex, 1);

            scoreRef.current += 10;
            setScore(scoreRef.current);
            setInputBuffer("");

            // Level up logic
            if (scoreRef.current > 0 && scoreRef.current % 100 === 0) {
                setLevel(l => l + 1);
            }
        } else {
            // No match yet, keep buffer if it's less than max digits (e.g. 3)
            if (newVal.length > 3) {
                setInputBuffer(""); // Reset if too long
            } else {
                setInputBuffer(newVal);
            }
        }
    };

    const clearInput = () => setInputBuffer("");

    const createExplosion = (x: number, y: number, color: string) => {
        for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
                id: Math.random(),
                x, y,
                color,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 2,
                life: 1.0
            });
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setLevel(1);
        livesRef.current = 3;
        scoreRef.current = 0;
        enemiesRef.current = [];
        particlesRef.current = [];
        setInputBuffer("");
        setGameState('playing');
    };

    // --- Keyboard Support ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;

            if (e.key >= '0' && e.key <= '9') {
                handleInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                clearInput();
            } else if (e.key === 'Enter') {
                // Optional: Enter could act as a "Submit" or "Clear" depending on design, 
                // but current game checks on every digit. unique clear might be better.
                clearInput();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, inputBuffer, enemiesRef.current, handleInput, clearInput]); // Added handleInput and clearInput to dependencies for stability

    // --- Render ---
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col relative focus:outline-none" tabIndex={0}>
            {/* Background - Starfield */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-50"></div>
            </div>

            {/* HUD */}
            <div className="relative z-10 flex justify-between items-center p-4 bg-black/30 backdrop-blur-md border-b border-white/10">
                <Link href="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ArrowLeft /></Link>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1 text-red-500">
                        {[...Array(lives)].map((_, i) => <Heart key={i} className="fill-current w-6 h-6" />)}
                    </div>
                    <div className="text-xl font-bold bg-white/10 px-4 py-1 rounded-full">
                        Score: <span className="text-yellow-400">{score}</span>
                    </div>
                </div>
            </div>

            {/* Game Canvas Area */}
            <div className="flex-1 relative z-10 overflow-hidden">
                {/* Enemies */}
                {renderEntities.enemies.map(enemy => (
                    <div
                        key={enemy.id}
                        className="absolute transform -translate-x-1/2 flex flex-col items-center"
                        style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
                    >
                        <div className="text-4xl animate-pulse">
                            {enemy.type === 'asteroid' ? '☄️' : '👾'}
                        </div>
                        <div className="bg-black/60 px-2 py-1 rounded text-lg font-bold border border-white/20 mt-1 shadow-lg backdrop-blur-sm">
                            {enemy.expression}
                        </div>
                    </div>
                ))}

                {/* Particles */}
                {renderEntities.particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            backgroundColor: p.color === 'gold' ? '#fbbf24' : '#ef4444',
                            opacity: p.life
                        }}
                    />
                ))}

                {/* Base Defense Line */}
                <div className="absolute bottom-0 w-full h-2 bg-red-500/30 animate-pulse"></div>
            </div>

            {/* Input Area (Bottom) */}
            {gameState === 'playing' && (
                <div className="relative z-20 bg-slate-800/90 backdrop-blur-xl p-4 border-t border-white/10 pb-8">
                    {/* Current Buffer Display */}
                    <div className="flex justify-center mb-4 min-h-[3rem]">
                        <div className="text-4xl font-black tracking-widest text-cyan-400 border-b-2 border-cyan-500/50 px-8 pb-1">
                            {inputBuffer}
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                            <button
                                key={num}
                                onClick={() => handleInput(num)}
                                className={cn(
                                    "h-16 rounded-2xl text-3xl font-bold transition-all active:scale-95 shadow-lg border-b-4",
                                    "bg-slate-700 border-slate-900 hover:bg-slate-600 active:border-b-0",
                                    num === 0 && "col-span-2 w-full"
                                )}
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={clearInput}
                            className="col-span-2 h-16 bg-red-600/20 border-red-900/50 border-b-4 text-red-400 rounded-2xl text-xl font-bold hover:bg-red-600/30 active:scale-95 active:border-b-0"
                        >
                            清除
                        </button>
                    </div>
                </div>
            )}

            {/* Menu Overlay */}
            {gameState === 'menu' && (
                <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                    <Rocket className="w-24 h-24 text-cyan-400 mb-6 animate-bounce" />
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        算术守卫战
                    </h1>
                    <p className="text-gray-300 text-xl mb-12 max-w-md">
                        指挥官！陨石正在逼近！算出题目，发射激光保卫基地！
                    </p>
                    <div className="flex flex-col gap-2 items-center text-sm text-slate-400 mb-8">
                        <p>⌨️ 支持键盘输入数字</p>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black text-2xl font-black py-4 px-12 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Play className="fill-black" /> 开始行动
                    </button>
                </div>
            )}

            {/* Game Over Overlay */}
            {gameState === 'gameover' && (
                <div className="absolute inset-0 z-50 bg-red-900/90 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                    <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
                    <h1 className="text-5xl font-black text-white mb-2">基地失守!</h1>
                    <div className="text-2xl text-white/80 mb-8">最终得分: <span className="text-yellow-400 font-bold">{score}</span></div>

                    <button
                        onClick={startGame}
                        className="bg-white text-red-900 text-xl font-black py-4 px-12 rounded-full shadow-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw /> 重新挑战
                    </button>
                    <Link href="/" className="mt-6 text-white/60 hover:text-white underline">
                        返回指挥部
                    </Link>
                </div>
            )}
        </div>
    );
}
