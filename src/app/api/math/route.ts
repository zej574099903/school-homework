import { NextResponse } from 'next/server';
import axios from 'axios';

// Mock data for fallback (when API key is missing)
const MOCK_PROBLEMS = [
    {
        id: 1,
        question: "🐰 小兔子拔了8根胡萝卜，吃掉了3根，还剩下几根？",
        options: ["5根", "6根", "7根", "4根"],
        answer: "5根",
        explanation: "8 - 3 = 5，所以还剩下5根胡萝卜。"
    },
    {
        id: 2,
        question: "🎈 小明过生日，妈妈买了12个气球，爸爸又买了5个，一共有多少个气球？",
        options: ["15个", "16个", "17个", "18个"],
        answer: "17个",
        explanation: "12 + 5 = 17，所以一共有17个气球。"
    },
    {
        id: 3,
        question: "🐕 公园里有4只小狗在玩耍，每只小狗有4条腿，一共有多少条腿？",
        options: ["12条", "14条", "16条", "18条"],
        answer: "16条",
        explanation: "4只小狗 × 4条腿 = 16条腿。"
    },
    {
        id: 4,
        question: "🍎 妈妈买了20个苹果，分给了邻居6个，自己家吃了7个，还剩多少个？",
        options: ["5个", "6个", "7个", "8个"],
        answer: "7个",
        explanation: "20 - 6 - 7 = 7，所以还剩7个苹果。"
    },
    {
        id: 5,
        question: "📚 小红上周借了9本书，这周又借了6本书，她一共借了多少本书？",
        options: ["13本", "14本", "15本", "16本"],
        answer: "15本",
        explanation: "9 + 6 = 15，所以一共借了15本书。"
    },
    {
        id: 6,
        question: "🚗 停车场原来有15辆车，开走了8辆，又开来了5辆，现在有几辆车？",
        options: ["10辆", "11辆", "12辆", "13辆"],
        answer: "12辆",
        explanation: "15 - 8 + 5 = 12，所以现在有12辆车。"
    },
    {
        id: 7,
        question: "🍭 老师有24颗糖果，要平均分给6个小朋友，每个小朋友能得到几颗？",
        options: ["3颗", "4颗", "5颗", "6颗"],
        answer: "4颗",
        explanation: "24 ÷ 6 = 4，每个小朋友能得到4颗糖果。"
    },
    {
        id: 8,
        question: "🦆 池塘里有7只鸭子在游泳，又飞来了9只，然后有3只飞走了，现在有几只鸭子？",
        options: ["11只", "12只", "13只", "14只"],
        answer: "13只",
        explanation: "7 + 9 - 3 = 13，所以现在有13只鸭子。"
    },
    {
        id: 9,
        question: "⚽ 小明踢进了5个球，小刚踢进了7个球，他们一共踢进了多少个球？",
        options: ["10个", "11个", "12个", "13个"],
        answer: "12个",
        explanation: "5 + 7 = 12，他们一共踢进了12个球。"
    },
    {
        id: 10,
        question: "🎨 小华有一盒18支彩色铅笔，借给同学5支，又丢了2支，还剩几支？",
        options: ["9支", "10支", "11支", "12支"],
        answer: "11支",
        explanation: "18 - 5 - 2 = 11，所以还剩11支彩色铅笔。"
    }
];

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;

        // Fallback if no API key
        if (!apiKey) {
            console.warn("DeepSeek API Key missing, using mock data.");
            return NextResponse.json({ problems: MOCK_PROBLEMS });
        }

        const { difficulty = "easy" } = await request.json().catch(() => ({}));

        // Generate questions in batches with different difficulty levels
        const difficulties = [
            { level: "easy", count: 6, desc: "简单" },
            { level: "medium", count: 3, desc: "中等" },
            { level: "hard", count: 1, desc: "较难" }
        ];

        let allProblems: any[] = [];
        let currentId = 1;

        for (const diff of difficulties) {
            const response = await axios.post(
                'https://api.deepseek.com/chat/completions',
                {
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: `你是一个充满创意的小学二年级数学老师。请生成 ${diff.count} 道${diff.desc}的数学题。

【难度定义】
- 简单：10以内加减法，简单加法应用题
- 中等：20以内加减法，简单乘除法（乘数不超过5）
- 较难：20以内综合运算，乘除法混合，两步应用题

【题目要求】
1. 适合二年级学生水平
2. 使用孩子熟悉的场景：动物、玩具、食物、游戏、学校等
3. 在问题开头加上相关的表情符号（如🐰🎈🐕🍎📚等）
4. 语言生动有趣，让孩子有代入感
5. 包含多种题型：加法、减法、乘法、除法、综合应用题

【返回格式】
必须是纯 JSON 数组，不要包含 markdown 格式和其他文字。
JSON 结构示例（不需要id字段，我会自动添加）：
[
  {
    "question": "🐰 小兔子拔了8根胡萝卜，吃掉了3根，还剩下几根？",
    "options": ["5根", "6根", "7根", "4根"],
    "answer": "5根",
    "explanation": "8 - 3 = 5，所以还剩下5根胡萝卜。"
  }
]`
                        },
                        {
                            role: "user",
                            content: `请生成 ${diff.count} 道${diff.desc}难度的趣味数学题。记住要生动有趣，让孩子喜欢做题！`
                        }
                    ],
                    stream: false
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            const content = response.data.choices[0].message.content;

            // Parse JSON from content
            try {
                const jsonString = content.replace(/```json\n|\n```/g, '').trim();
                const problems = JSON.parse(jsonString);

                // Add IDs and append to results
                problems.forEach((p: any) => {
                    allProblems.push({
                        id: currentId++,
                        ...p
                    });
                });
            } catch (e) {
                console.error(`Failed to parse ${diff.level} difficulty response:`, content);
            }
        }

        // Fallback to mock data if generation failed
        if (allProblems.length === 0) {
            return NextResponse.json({ problems: MOCK_PROBLEMS });
        }

        return NextResponse.json({ problems: allProblems });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ problems: MOCK_PROBLEMS }, { status: 500 });
    }
}
