import { NextResponse } from 'next/server';
import axios from 'axios';

const MOCK_RESPONSE = {
    category: "Recyclable",
    name: "可回收物",
    color: "blue", // blue, red, brown, black
    icon: "♻️",
    explanation: "废纸是可以回收再利用的，请保持平整干燥。",
    item: "废纸"
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.DEEPSEEK_API_KEY; // Using DeepSeek
        const { item } = await request.json();

        if (!item) return NextResponse.json({ error: "No item provided" }, { status: 400 });

        if (!apiKey) {
            // Simple mock logic for demo without key
            if (item.includes("电池")) return NextResponse.json({ ...MOCK_RESPONSE, category: "Hazardous", name: "有害垃圾", color: "red", icon: "☠️", explanation: "电池含有害物质", item });
            if (item.includes("饭") || item.includes("果皮")) return NextResponse.json({ ...MOCK_RESPONSE, category: "Wet", name: "湿垃圾 (厨余)", color: "brown", icon: "🍲", explanation: "容易腐烂的生物质废弃物", item });
            return NextResponse.json(MOCK_RESPONSE);
        }

        const response = await axios.post(
            'https://api.deepseek.com/chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: `你是一个垃圾分类专家（上海标准）。用户输入物品，请判断类别。
            类别必须是以下之一：
            - Recyclable (可回收物)
            - Hazardous (有害垃圾)
            - Wet (湿垃圾/厨余垃圾)
            - Dry (干垃圾/其他垃圾)

            返回纯 JSON 格式：
            {
              "category": "Recyclable" | "Hazardous" | "Wet" | "Dry",
              "name": "中文类别名称",
              "explanation": "简短的分类理由（适合小学生看，50字以内）"
            }`
                    },
                    {
                        role: "user",
                        content: `请分类：${item}`
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

        // Add color/icon mapping
        const map = {
            Recyclable: { color: "blue", icon: "♻️" },
            Hazardous: { color: "red", icon: "☠️" },
            Wet: { color: "brown", icon: "🍲" },
            Dry: { color: "black", icon: "🗑️" }
        };

        const info = map[result.category as keyof typeof map] || map.Dry;

        return NextResponse.json({
            ...result,
            color: info.color,
            icon: info.icon,
            item
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(MOCK_RESPONSE);
    }
}
