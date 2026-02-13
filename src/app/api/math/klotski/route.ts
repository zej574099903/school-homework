import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com",
});

export async function POST(req: Request) {
    try {
        const { grade } = await req.json();

        const prompt = `You are a Rune Master in a magic math game. 
    Generate a short, playful riddle in Chinese for a ${grade} student.
    The riddle should instruct them to arrange numbers in a sliding puzzle (3x3 or 4x4).
    You can suggest TWO types of target states:
    1. 'normal': 1, 2, 3... (ascending)
    2. 'reverse': 15, 14, 13... (descending)
    
    Choose ONE state and write a riddle for it.
    Example for normal: "符文感应到了混乱！请将它们按从小到大的顺序排列，唤醒沉睡的魔法。"
    Example for reverse: "时空发生了倒转！请将数字从大到小排列，让一切恢复原状。"

    Return ONLY a JSON object:
    {
      "riddle": "your riddle strings",
      "targetType": "normal" or "reverse"
    }`;

        let result;
        try {
            const response = await openai.chat.completions.create({
                model: "deepseek-chat",
                messages: [{ role: "system", content: prompt }],
                response_format: { type: "json_object" }
            });
            result = JSON.parse(response.choices[0].message.content || "{}");
        } catch (e) {
            console.error("AI failed, using fallback", e);
            result = {
                riddle: "将数字按 1, 2, 3... 的顺序排好，开启密室大门！",
                targetType: "normal"
            };
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Klotski API Error:", error);
        return NextResponse.json({ error: "Failed to generate puzzle" }, { status: 500 });
    }
}
