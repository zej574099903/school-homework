import { NextResponse } from 'next/server';
import axios from 'axios';

const MOCK_RESPONSE = {
    sentence: "Apple 🍎 掉在了牛顿的头上！",
    meaning: "苹果",
    emoji: "🍎",
    scene: "一个阳光明媚的果园里，红彤彤的苹果挂满枝头。"
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const { word } = await request.json();

        if (!apiKey) {
            return NextResponse.json(MOCK_RESPONSE);
        }

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `你是一个英语单词魔法师 🧙‍♂️，专门帮助二年级小学生记忆单词。
                        
                        【任务】
                        1. 接收一个英语单词。
                        2. 生成一个有趣的中文联想句子（中英夹杂），必须包含这个单词和emoji。
                        3. 提供简单的中文释义。
                        4. 描述一个生动的场景（用于未来生成图片，现在只展示文字）。
                        
                        【返回格式 JSON】
                        {
                            "sentence": string, // 例："Monkey 🐒 喜欢在树上跳来跳去！"
                            "meaning": string, // 例："猴子"
                            "emoji": string, // 例："🐒"
                            "scene": string // 例："茂密的丛林里，一只顽皮的猴子倒挂在树枝上。"
                        }`
                    },
                    {
                        role: "user",
                        content: `单词：${word}`
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
