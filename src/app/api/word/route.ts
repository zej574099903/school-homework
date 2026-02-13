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
                        content: `你是一个英语单词魔法师 🧙‍♂️，专门帮助二年级小学生学习单词。
                        
                        【任务】
                        1. 接收一个单词（可能是英语，也可能是中文）。
                        2. 识别输入语言：
                           - 如果是英语，返回中文释义。
                           - 如果是中文，将其翻译为对应的英语单词，并作为主要的 "word" 返回。
                        3. 生成一个有趣的联想句子（中英夹杂），必须包含这个英语单词和emoji。
                        4. 描述一个生动的场景。
                        
                        【返回格式 JSON】
                        {
                            "word": string, // 统一返回对应的英语单词，首字母大写
                           "sentence": string, // 例："Tiger 🐯 是森林里的百兽之王！"
                            "meaning": string, // 中文释义，例："老虎"
                            "emoji": string, // 对应的 emoji，例："🐯"
                            "scene": string // 场景描述，例："在这片茂密的森林里，一只威武的老虎正迈着优雅的步子在河边喝水。"
                        }`
                    },
                    {
                        role: "user",
                        content: `输入内容：${word}`
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
