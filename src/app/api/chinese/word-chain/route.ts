import { NextResponse } from 'next/server';
import axios from 'axios';

const SYSTEM_PROMPT = `你是一个亲切的小书虫，专门陪小朋友玩“词语接龙”游戏。

【核心规则 - 绝对不能违反】
1. 小朋友给出一个词，你必须给出一个以该词“最后一个字”开头的词。
   - 例子：小朋友说“苹果”，你必须接“果”开头的词，如“果实”。
   - 例子：小朋友说“太阳”，你必须接“阳”开头的词，如“阳光”。
2. 词语必须是适合小学1-6年级的常用词汇。
3. 如果小朋友给出的词不合法（不是词语或者接不上），你要温柔地指出并给出建议。

【输出要求】
必须严格返回 JSON 格式：
{
  "next_word": "你的接龙词语",
  "pinyin": "词语拼音",
  "meaning": "简单易懂的词义解释",
  "status": "success" | "error",
  "message": "如果出错了，给小朋友的提示信息"
}`;

export async function POST(req: Request) {
    try {
        const { word, lastWord, grade } = await req.json();
        const apiKey = process.env.ZHIPU_API_KEY;

        if (!apiKey) {
            // Fallback logic for local testing
            if (lastWord && word[0] !== lastWord[lastWord.length - 1]) {
                return NextResponse.json({ status: "error", message: `哎呀，这个词要以“${lastWord[lastWord.length - 1]}”开头才对哦！` });
            }
            return NextResponse.json({
                next_word: "未来",
                pinyin: "wèi lái",
                meaning: "指现在以后的时间。",
                status: "success"
            });
        }

        let attempts = 0;
        let lastError = "";

        while (attempts < 3) {
            const response = await axios.post(
                'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                {
                    model: "glm-4",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        {
                            role: "user", content: lastError
                                ? `你刚才接错了：${lastError}。请重新接：上一个词是“${lastWord || '开始'}”，小朋友接的是“${word}”。必须以“${word[word.length - 1]}”开头！`
                                : `上一个词是“${lastWord || '开始'}”，小朋友接的是“${word}”。请按照规则接下去。当前年级水平：${grade}`
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

            // 逻辑校验：AI 返回的词必须以用户的最后一个字开头
            if (result.status === "success" && result.next_word) {
                const userLastChar = word[word.length - 1];
                if (result.next_word[0] === userLastChar) {
                    return NextResponse.json(result);
                } else {
                    lastError = `你返回了“${result.next_word}”，但它不是以“${userLastChar}”开头的。`;
                    attempts++;
                    continue;
                }
            }

            return NextResponse.json(result);
        }

        return NextResponse.json({
            status: "error",
            message: "小书虫刚才打了个盹，没接上，我们再试一次吧！"
        });

    } catch (error) {
        console.error("Word Chain API Error:", error);
        return NextResponse.json({ error: "Failed to play word solitaire" }, { status: 500 });
    }
}
