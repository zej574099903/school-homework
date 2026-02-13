import { NextResponse } from 'next/server';
import axios from 'axios';

// Themes Mock Data
const MOCK_DATA = {
    magic: [
        { id: 1, question: "🐰 魔法兔拔了8根胡萝卜，炼药用了3根，还剩下几根？", options: ["5根", "6根", "7根", "4根"], answer: "5根", explanation: "8 - 3 = 5，魔法兔还剩5根胡萝卜。" },
        { id: 2, question: "🧚‍♀️ 精灵女王有12颗魔法石，又找到了5颗，一共有多少颗？", options: ["15颗", "16颗", "17颗", "18颗"], answer: "17颗", explanation: "12 + 5 = 17，一共有17颗魔法石。" },
        { id: 3, question: "🐉 喷火龙每天吃4个火焰果，吃了4天，一共吃了多少个？", options: ["12个", "14个", "16个", "18个"], answer: "16个", explanation: "4 × 4 = 16，一共吃了16个火焰果。" },
        { id: 4, question: "🧙‍♂️ 巫师有20瓶药水，分给学徒6瓶，自己喝了7瓶，还剩几瓶？", options: ["5瓶", "6瓶", "7瓶", "8瓶"], answer: "7瓶", explanation: "20 - 6 - 7 = 7，还剩7瓶药水。" },
        { id: 5, question: "🏰 城堡里有9个守卫，又来了6个，一共有多少个守卫？", options: ["13个", "14个", "15个", "16个"], answer: "15个", explanation: "9 + 6 = 15，一共有15个守卫。" },
        { id: 6, question: "🦄 独角兽原本有15位朋友，走了8位，又来了5位，现在有几位？", options: ["10位", "11位", "12位", "13位"], answer: "12位", explanation: "15 - 8 + 5 = 12，现在有12位朋友。" },
        { id: 7, question: "🍄 魔法蘑菇有24个，平均分给6个小矮人，每个分几个？", options: ["3个", "4个", "5个", "6个"], answer: "4个", explanation: "24 ÷ 6 = 4，每个小矮人分4个。" },
        { id: 8, question: "🦉 智慧猫头鹰抓了7只害虫，又抓了9只，跑了3只，还剩几只？", options: ["11只", "12只", "13只", "14只"], answer: "13只", explanation: "7 + 9 - 3 = 13，还剩13只。" },
        { id: 9, question: "✨ 小仙女变出了5朵花，小精灵变出了7朵，一共变出了多少朵？", options: ["10朵", "11朵", "12朵", "13朵"], answer: "12朵", explanation: "5 + 7 = 12，一共变出了12朵花。" },
        { id: 10, question: "👹 【BOSS】巨魔守着18个宝箱，被勇士拿走5个，又坏了2个，还剩几个？", options: ["9个", "10个", "11个", "12个"], answer: "11个", explanation: "18 - 5 - 2 = 11，还剩11个宝箱。", isBoss: true }
    ],
    space: [
        { id: 1, question: "🚀 火箭发射倒计时10秒，已经过了3秒，还剩几秒？", options: ["6秒", "7秒", "8秒", "5秒"], answer: "7秒", explanation: "10 - 3 = 7，还剩7秒。" },
        { id: 2, question: "👽 遇到了5个外星人，又来了6个，一共有多少个外星人？", options: ["10个", "11个", "12个", "13个"], answer: "11个", explanation: "5 + 6 = 11，一共有11个外星人。" },
        { id: 3, question: "🪐 飞船飞过4个星球，每个星球有3颗卫星，一共看到几颗卫星？", options: ["10颗", "11颗", "12颗", "13颗"], answer: "12颗", explanation: "4 × 3 = 12，一共12颗卫星。" },
        { id: 4, question: "☄️ 宇航员收集了15块陨石，丢了5块，又找到3块，现在有几块？", options: ["12块", "13块", "14块", "15块"], answer: "13块", explanation: "15 - 5 + 3 = 13，现在有13块陨石。" },
        { id: 5, question: "🛸 飞碟停了8架，飞走了3架，又飞来4架，现在有几架？", options: ["8架", "9架", "10架", "7架"], answer: "9架", explanation: "8 - 3 + 4 = 9，现在有9架飞碟。" },
        { id: 6, question: "🤖 机器人通过了3个关卡，每关得5分，一共得了多少分？", options: ["10分", "12分", "15分", "20分"], answer: "15分", explanation: "3 × 5 = 15，一共得了15分。" },
        { id: 7, question: "🌌 银河系有20颗亮星，被黑洞遮住8颗，还剩几颗？", options: ["11颗", "12颗", "13颗", "14颗"], answer: "12颗", explanation: "20 - 8 = 12，还剩12颗亮星。" },
        { id: 8, question: "👨‍🚀 太空舱有6个座位，已经坐了4人，还能坐几人？", options: ["1人", "2人", "3人", "4人"], answer: "2人", explanation: "6 - 4 = 2，还能坐2人。" },
        { id: 9, question: "🛰️ 卫星发送了9条信号，接收了6条，一共处理了多少条？", options: ["14条", "15条", "16条", "13条"], answer: "15条", explanation: "9 + 6 = 15，一共处理了15条信号。" },
        { id: 10, question: "👾 【BOSS】外星母舰有16个引擎，坏了4个，修好2个，现在几个能用？", options: ["12个", "13个", "14个", "15个"], answer: "14个", explanation: "16 - 4 + 2 = 14，现在14个能用。", isBoss: true }
    ],
    dino: [
        { id: 1, question: "🦖 霸王龙有8颗摇晃的牙齿，掉了3颗，还剩几颗？", options: ["4颗", "5颗", "6颗", "7颗"], answer: "5颗", explanation: "8 - 3 = 5，还剩5颗摇晃的牙齿。" },
        { id: 2, question: "🦕 三角龙吃了12堆草，又吃了5堆，一共吃了多少堆？", options: ["16堆", "17堆", "18堆", "19堆"], answer: "17堆", explanation: "12 + 5 = 17，一共吃了17堆草。" },
        { id: 3, question: "🥚 恐龙窝里有4个蛋，每个蛋孵出1只小恐龙，会有几只？", options: ["3只", "4只", "5只", "6只"], answer: "4只", explanation: "1个蛋1只，4个蛋就是4只。" },
        { id: 4, question: "🦎 翼龙抓了10条鱼，吃了6条，又抓了4条，现在有几条？", options: ["7条", "8条", "9条", "6条"], answer: "8条", explanation: "10 - 6 + 4 = 8，现在有8条鱼。" },
        { id: 5, question: "🦴 考古学家发现了15块化石，送给博物馆5块，自己留了8块，由于数错了其实是送了多少块？(15-x=8)", options: ["6块", "7块", "8块", "5块"], answer: "7块", explanation: "15 - 7 = 8，所以是送了7块。" },
        { id: 6, question: "🌋 火山喷发了5次，每次喷出3块大石头，一共喷出几块？", options: ["12块", "15块", "18块", "20块"], answer: "15块", explanation: "5 × 3 = 15，一共喷出15块。" },
        { id: 7, question: "🐾 迅猛龙留下了18个脚印，被雨水冲掉9个，还剩几个？", options: ["8个", "9个", "10个", "11个"], answer: "9个", explanation: "18 - 9 = 9，还剩9个脚印。" },
        { id: 8, question: "🌴 剑龙经过了7棵树，又经过了6棵，一共经过了几棵？", options: ["12棵", "13棵", "14棵", "15棵"], answer: "13棵", explanation: "7 + 6 = 13，一共经过了13棵树。" },
        { id: 9, question: "🐢 甲龙有9个坚硬的甲片，又长出4个，一共有几个？", options: ["12个", "13个", "14个", "11个"], answer: "13个", explanation: "9 + 4 = 13，一共有13个甲片。" },
        { id: 10, question: "👑 【BOSS】暴龙王带领16只小弟，跑了4只，又回来2只，现在有多少只恐龙？", options: ["13只", "14只", "15只", "16只"], answer: "14只", explanation: "16 - 4 + 2 = 14，现在有14只小弟。", isBoss: true }
    ]
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        const { difficulty = "easy", theme = "magic", grade = "二年级" } = await request.json().catch(() => ({}));

        // Fallback if no API key
        if (!apiKey) {
            console.warn("DeepSeek API Key missing, using mock data.");
            // @ts-ignore
            const mockProblems = MOCK_DATA[theme] || MOCK_DATA.magic;
            return NextResponse.json({ problems: mockProblems });
        }

        // Theme Configuration
        const themePrompts: Record<string, string> = {
            magic: `你是一位神秘的魔法森林守护者，用魔法药水、精灵、飞龙等元素出题。当前学生年级：${grade}`,
            space: `你是一位星际探险队的队长，用飞船、外星人、星球、陨石等元素出题。当前学生年级：${grade}`,
            dino: `你是一位恐龙公园的园长，用霸王龙、三角龙、恐龙蛋、化石等元素出题。当前学生年级：${grade}`
        };

        const currentPersona = themePrompts[theme] || themePrompts.magic;

        // Generate questions in batches with different difficulty levels
        const difficultyConfigs = [
            { level: "easy", count: 4, desc: "简单热身" },
            { level: "medium", count: 4, desc: "中等挑战" },
            { level: "hard", count: 2, desc: "BOSS挑战" }
        ];

        let allProblems: any[] = [];

        // Use Promise.all to fetch questions in parallel to avoid long pending times
        const problemPromises = difficultyConfigs.map(async (diff) => {
            try {
                const response = await axios.post(
                    'https://api.deepseek.com/chat/completions',
                    {
                        model: "deepseek-chat",
                        messages: [
                            {
                                role: "system",
                                content: `你是一个充满创意的小学老师。${currentPersona} 请生成 ${diff.count} 道${diff.desc}的数学题。
                                
【目标年级】
${grade}

【难度定义】
- 简单：符合该年级基础水平的简单运算或应用题
- 中等：该年级的中等难度挑战，可能包含多步运算
- BOSS挑战：该年级的综合难题，描述要宏大一点，作为关底BOSS

【题目要求】
1. **必须严格严格符合 ${grade} 的教学大纲和难度水平**。
2. **严格结合主题场景**：${theme === 'dino' ? '恐龙、化石' : theme === 'space' ? '星球、飞船' : '魔法、精灵'}
3. 在问题开头加上相关的表情符号
4. 包含多种题型：加减乘除根据年级水平选择
5. 返回纯 JSON 数组

【返回格式】
[
  {
    "question": "文字描述...",
    "options": ["选项1", "选项2", "...", "..."],
    "answer": "正确选项文字",
    "explanation": "生动有趣的解析"
  }
]`
                            },
                            {
                                role: "user",
                                content: `请为${grade}学生生成 ${diff.count} 道${diff.desc}难度的趣味数学题。`
                            }
                        ],
                        stream: false
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        timeout: 30000 // 30s timeout per call
                    }
                );

                const content = response.data.choices[0].message.content;
                const jsonString = content.replace(/```json\n|\n```/g, '').trim();
                const problems = JSON.parse(jsonString);

                return problems.map((p: any) => ({
                    ...p,
                    isBoss: diff.level === 'hard'
                }));
            } catch (e) {
                console.error(`Failed to fetch ${diff.level} problems:`, e);
                return [];
            }
        });

        const results = await Promise.all(problemPromises);

        let currentId = 1;
        results.forEach(batch => {
            batch.forEach((p: any) => {
                allProblems.push({
                    id: currentId++,
                    ...p
                });
            });
        });

        // Fallback to mock data if generation failed
        if (allProblems.length === 0) {
            // @ts-ignore
            return NextResponse.json({ problems: MOCK_DATA[theme] || MOCK_DATA.magic });
        }

        return NextResponse.json({ problems: allProblems });

    } catch (error) {
        console.error("API Error:", error);
        // @ts-ignore
        return NextResponse.json({ problems: MOCK_DATA[theme] || MOCK_DATA.magic }, { status: 500 });
    }
}
