import { NextResponse } from 'next/server';
import axios from 'axios';

const MOCK_RESPONSE = {
    content: "于是，小兔子决定和乌龟再比一次赛跑。这次，它发誓绝对不睡觉了！💪🐰",
    isEnd: false
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;

        if (!apiKey) {
            return NextResponse.json(MOCK_RESPONSE);
        }

        const { history, userInput } = await request.json();
        // history: string[] containing previous story segments
        // userInput: string (latest sentence from user)

        const fullStory = history.join("\n");

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `你是一个儿童绘本作家，正在和一个二年级的小朋友一起创作故事。
                        
                        【规则】
                        1. 故事接龙模式：你一句，我一句。
                        2. 你的任务：根据上文和用户的最新句子，续写下一句情节。
                        3. 长度限制：50字以内，不要太长。
                        4. 风格：生动、有趣、充满想象力，适合7-8岁儿童。
                        5. 包含表情符号：在句末或适当位置加上Emoji。
                        6. 逻辑连贯：确保故事发展合理。
                        
                        【输出格式 JSON】
                        {
                            "content": string, // 你续写的内容
                            "isEnd": boolean // 如果故事逻辑上已经完美结束（如"从此他们幸福地生活在一起"），设为 true
                        }`
                    },
                    {
                        role: "user",
                        content: `【已有故事】：\n${fullStory}\n\n【小朋友接着说】：\n${userInput}\n\n请续写：`
                    }
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
