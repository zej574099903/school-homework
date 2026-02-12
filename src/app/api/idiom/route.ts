import { NextResponse } from 'next/server';
import axios from 'axios';

// Fallback data
const MOCK_RESPONSE = {
    valid: true,
    nextIdiom: "一马当先",
    pinyin: "yī mǎ dāng xiān",
    meaning: "原指作战时策马冲锋在前。形容领先。也比喻工作走在群众前面，积极带头。",
    endGame: false,
    message: "喵~ 接得好！"
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey) {
            return NextResponse.json(MOCK_RESPONSE);
        }

        const { history, lastIdiom, type = "answer" } = await request.json();
        // type: "answer" (user inputs idiom) or "hint" (user asks for hint)

        const prevIdiom = history.length > 0 ? history[history.length - 1] : null;

        let systemPrompt = "";
        let userPrompt = "";

        if (type === "hint") {
            systemPrompt = `你是一个可爱的"成语大师喵" 🐱。用户玩成语接龙卡住了，请你提供一个提示。
            目前的成语是：${prevIdiom}
            请给出一个接得上的成语（常见成语），但不要直接告诉他，而是返回：
            1. 成语的第一个字
            2. 拼音
            3. 简单的释义
            
            返回 JSON 格式：
            {
                "hint": string, // 提示文本，例如 "试一试以 '天' 开头的成语？"
                "firstChar": string, // 第一个字
                "pinyin": string, // 拼音
            }`;
            userPrompt = `喵大师，我接不上 "${prevIdiom}" 了，给个提示吧！`;
        } else {
            systemPrompt = `你是一个可爱的"成语大师喵" 🐱，正在和二年级小学生玩成语接龙。
            
            【规则】
            1. 判断用户输入是否是成语。
            2. 判断是否接上了上一个成语的最后一个字（同音即可）。
            3. 如果用户接对了：
               - 表扬他（用猫咪的语气，如"喵~ 真棒！"）
               - 你接一个**常见的**、**简单的**成语（适合二年级水平）
               - 提供简单易懂的释义
            4. 如果用户错了：
               - 鼓励他，并说明原因
            
            【返回格式 JSON】
            {
              "valid": boolean, // 是否接龙成功
              "message": string, // 你的回复（可爱猫咪语气）
              "nextIdiom": string, // 你接的成语（如果用户赢了或错了则为空）
              "pinyin": string, // 拼音
              "meaning": string, // 释义（通俗易懂）
              "endGame": boolean // 是否结束
            }`;
            userPrompt = `上一条成语：${prevIdiom || "无"}。我出的成语：${lastIdiom}`;
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
