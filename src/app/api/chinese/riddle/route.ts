import { NextResponse } from 'next/server';
import axios from 'axios';

const SYSTEM_PROMPT = `你是一位神秘的“猜字谜大师”。你会给小朋友出一些有趣的字谜。

【你的任务】
1. 根据年级生成一个汉字及其对应的谜面。
2. 谜面要生动、形象，最好带点顺口溜的感觉。
3. 提供三个逐步递进的提示（Hint）。
4. 解释为什么谜底是这个字（字形拆解）。

【输出要求】
必须返回 JSON 格式：
{
  "riddle": "谜面内容",
  "answer": "谜底汉字",
  "pinyin": "谜底拼音",
  "hints": ["提示1", "提示2", "提示3"],
  "explanation": "原理解释..."
}`;

export async function POST(req: Request) {
    try {
        const { type, grade } = await req.json();
        const apiKey = process.env.ZHIPU_API_KEY;

        if (!apiKey) {
            // Fallback for demo
            return NextResponse.json({
                riddle: "两棵树，挨着站，不说话，变森林。",
                answer: "林",
                pinyin: "lín",
                hints: ["是一个左右结构的字", "跟树木（木）有关", "两个木合起来"],
                explanation: "两个‘木’（树）并排站，就成了‘林’。"
            });
        }

        const response = await axios.post(
            'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            {
                model: "glm-4",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `请为${grade}学生生成一个猜字谜挑战。` }
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
        console.error("Riddle API Error:", error);
        return NextResponse.json({ error: "Failed to generate riddle" }, { status: 500 });
    }
}
