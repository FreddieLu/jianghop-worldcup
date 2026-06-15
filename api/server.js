/**
 * DeepSeek API 后端 - 真实 AI 分析
 *
 * 本地运行：
 *   DEEPSEEK_API_KEY=sk-xxx node api/server.js
 *
 * Vercel 部署：
 *   设置环境变量 DEEPSEEK_API_KEY
 *   vercel deploy
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000', 'http://localhost:5000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const PORT = process.env.PORT || 3001;

if (!DEEPSEEK_API_KEY) {
  console.warn('⚠️ 环境变量 DEEPSEEK_API_KEY 未设置');
  console.warn('💡 请设置环境变量: export DEEPSEEK_API_KEY=sk-xxx');
  if (!process.env.VERCEL) {
    console.warn('❌ 本地运行需要设置 API Key，否则预测将失败');
  }
}

// 预测缓存（生产环境应用 Redis）
const cache = {};

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/predict', async (req, res) => {
  const { team1, team2, group, date, team1Data, team2Data } = req.body;
  const cacheKey = `${team1}_${team2}`;

  // 命中缓存
  if (cache[cacheKey]) {
    console.log(`✅ 缓存命中: ${team1} vs ${team2}`);
    return res.json(cache[cacheKey]);
  }

  console.log(`🔮 开始分析: ${team1} vs ${team2}`);

  // 构建提示词
  const prompt = `你是一位资深足球分析师和数据专家。现在需要预测 2026 年世界杯小组赛的比分。

## 比赛信息
- 比赛：${team1} vs ${team2}
- 小组：${group}
- 日期：${date}

## ${team1} 队情况
- 世界排名：第 ${team1Data.ranking} 位
- 主教练：${team1Data.coach}
- 阵容身价：${team1Data.marketValue} 亿欧元
- 关键球员：${team1Data.keyPlayers.join('、')}
- 球队优势：${team1Data.strengths.join('、')}
- 伤病情况：${team1Data.injuries.length > 0 ? team1Data.injuries.join('；') : '无'}
- 近期战绩：${team1Data.recentForm}

## ${team2} 队情况
- 世界排名：第 ${team2Data.ranking} 位
- 主教练：${team2Data.coach}
- 阵容身价：${team2Data.marketValue} 亿欧元
- 关键球员：${team2Data.keyPlayers.join('、')}
- 球队优势：${team2Data.strengths.join('、')}
- 伤病情况：${team2Data.injuries.length > 0 ? team2Data.injuries.join('；') : '无'}
- 近期战绩：${team2Data.recentForm}

## 任务
请基于上述真实数据，综合考虑排名、身价、伤病、近期战绩等因素进行专业分析。

返回格式（严格 JSON）：
{
  "score1": 数字,
  "score2": 数字,
  "analysis": "基于具体数据的分析理由（2-3句话）",
  "tag": "标签（🔥 大比分预警 / 🚨 冷门预警 / 🐶 稳如老狗 / ⚖️ 五五开）",
  "tagClass": "tag-hot 或 tag-safe 或 tag-even"
}

只返回 JSON，不要其他内容。`;

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位权威的足球分析专家，基于真实数据进行比分预测。预测要有根据，分析要具体，不要空泛描述。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('❌ DeepSeek API 错误:', data.error);
      return res.status(500).json({ error: `API 错误: ${data.error.message}` });
    }

    const content = data.choices?.[0]?.message?.content || '';
    console.log('📝 AI 原始响应:', content);

    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ 无法从响应中解析 JSON:', content);
      return res.status(500).json({ error: '无法解析 AI 响应' });
    }

    const prediction = JSON.parse(jsonMatch[0]);

    // 验证字段
    if (
      typeof prediction.score1 !== 'number' ||
      typeof prediction.score2 !== 'number' ||
      !prediction.analysis ||
      !prediction.tag ||
      !prediction.tagClass
    ) {
      console.error('❌ 响应字段不完整:', prediction);
      return res.status(500).json({ error: '响应字段不完整' });
    }

    // 缓存结果
    cache[cacheKey] = prediction;
    console.log(`✅ 预测完成: ${team1} ${prediction.score1}:${prediction.score2} ${team2}`);

    res.json(prediction);
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    res.status(500).json({ error: `请求失败: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 DeepSeek 预测 API 运行在 http://localhost:${PORT}`);
  console.log(`📌 前端应设置 API_URL = 'http://localhost:${PORT}/api/predict'`);
});

export default app;
