import { NextResponse } from 'next/server';
import axios from 'axios';

const MOCK_RESPONSE = {
    valid: true,
    message: "我是一个调皮的谜题精灵！🧞‍♂️",
    riddle: "有时圆圆像个盘，有时弯弯像只船。白天看不见，晚上才出来。（打一自然现象）",
    answer: "月亮",
    isCorrect: false
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const { type, history, userInput } = await request.json();
        // type: "generate" (AI 出题) | "guess" (用户猜 AI 的题) | "ai_guess" (用户出题 AI 猜)

        if (!apiKey) {
            return NextResponse.json(MOCK_RESPONSE);
        }

        let systemPrompt = "";
        let userPrompt = "";

        if (type === "generate") {
            systemPrompt = `你是一个喜欢给二年级小学生出谜语的"谜题精灵" 🧞‍♂️。
            请生成一个简单、有趣的谜语。
            
            【要求】
            1. 谜面要朗朗上口，最好押韵。
            2. 谜底必须是孩子熟悉的日常事物（动物、植物、文具、自然现象等）。
            3. 不要直接说出谜底。
            
            【返回格式 JSON】
            {
                "riddle": string, // 谜面
                "answer": string, // 谜底
                "hint": string // 一个简单的提示（比如"是一种动物"）
            }`;
            userPrompt = "请出一个新谜语！";
        } else if (type === "guess") {
            // 用户猜谜
            systemPrompt = `你是一个公正的裁决者。用户正在猜刚才的谜语。
            谜底是：${history.answer}
            用户的答案是：${userInput}
            
            请判断是否正确（意思对即可，如同音字、别名等）。
            如果不对，给一点提示。
            
            【返回格式 JSON】
            {
                "isCorrect": boolean,
                "message": string, // 你的回复（比如"恭喜你答对了！"或"不对哦，再猜猜，提示：..."）
            }`;
            userPrompt = `用户猜：${userInput}`;
        } else if (type === "ai_guess") {
            // AI 猜用户的谜语
            systemPrompt = `你是一个聪明的猜谜高手。二年级小朋友给你出了一个谜语，请你猜。
            如果不确定，可以礼貌地请求提示。
            回复要幽默有趣。
            
            【返回格式 JSON】
            {
                "reply": string, // 你的猜测或回复，例如 "我猜是...对吗？"
                "isCorrect": boolean // 暂时不需要
            }`;
            userPrompt = `小朋友出谜语：${userInput}`;
        }

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        const result = JSON.parse(response.data.choices[0].message.content);
        return NextResponse.json(result);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(MOCK_RESPONSE);
    }
}
