import { NextResponse } from 'next/server';
import axios from 'axios';

const SYSTEM_PROMPT = `你是一位学识渊博但非常温柔的“成语博士”。你正在陪小朋友玩“成语接龙”游戏。

【规则】
1. 小朋友给出一个成语，你必须接一个以该成语最后一个字开头的成语（音同即可，首选字同）。
2. 成语必须是真实的、常用的。
3. 如果小朋友给出的不是成语或者接不上，你要温柔地指出。

【任务类型】
- type === "play": 正常接龙。
- type === "hint": 小朋友想不出来了，请给出一个正确的成语作为提示，并鼓励他。

【输出要求】
必须返回 JSON 格式：
{
  "next_idiom": "成语名称",
  "pinyin": "chéng yǔ pīn yīn",
  "meaning": "简单易懂的解释，适合小学生",
  "derivation": "成语背后的简短小故事或出处（可选，10字以内）",
  "status": "success" | "error",
  "message": "提示信息（正常接龙时为空，求助时为鼓励的话）"
}`;

export async function POST(req: Request) {
    try {
        const { word, lastWord, grade, type = "play" } = await req.json();
        const apiKey = process.env.ZHIPU_API_KEY;

        if (!apiKey) {
            // Fallback for demo
            return NextResponse.json({
                next_idiom: "大公无私",
                pinyin: "dà gōng wú sī",
                meaning: "形容人做事非常公正，没有私心。",
                status: "success",
                message: type === "hint" ? "别担心，博士来帮你！这个成语怎么样？" : ""
            });
        }

        const response = await axios.post(
            'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            {
                model: "glm-4",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    {
                        role: "user", content: type === "hint"
                            ? `小朋友在接“${lastWord}”时卡住了，请给出一个以“${lastWord[lastWord.length - 1]}”开头的成语作为提示。`
                            : `上一个成语是“${lastWord || '开始'}”，小朋友接的是“${word}”。请按照规则接龙。当前年级：${grade}`
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
        console.error("Idiom Chain API Error:", error);
        return NextResponse.json({ error: "Failed to play idiom solitaire" }, { status: 500 });
    }
}
