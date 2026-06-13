#!/usr/bin/env node

/**
 * 快速测试 DeepSeek API 是否正常工作
 * 用法：DEEPSEEK_API_KEY=sk-xxx node scripts/test-deepseek.js
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

if (!DEEPSEEK_API_KEY) {
  console.error('❌ 错误：DEEPSEEK_API_KEY 环境变量未设置');
  console.error('   请运行：export DEEPSEEK_API_KEY=sk-你的key');
  process.exit(1);
}

console.log('🧪 测试 DeepSeek API...');
console.log(`📝 API Key: ${DEEPSEEK_API_KEY.slice(0, 10)}...${DEEPSEEK_API_KEY.slice(-5)}`);
console.log('');

import('node-fetch').then(async ({ default: fetch }) => {
  try {
    console.log('⏳ 发送请求到 DeepSeek...');
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
            content: '你是一位足球分析专家。',
          },
          {
            role: 'user',
            content: '请用 JSON 格式预测巴西 vs 墨西哥的比分。返回 {"score1": 数字, "score2": 数字, "analysis": "分析文本", "tag": "标签"}',
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('❌ API 返回错误：');
      console.error(JSON.stringify(data.error, null, 2));
      process.exit(1);
    }

    console.log('✅ API 连接成功！');
    console.log('');
    console.log('📊 API 响应：');
    const content = data.choices?.[0]?.message?.content;
    console.log(content);
    console.log('');
    console.log('✅ DeepSeek API 工作正常！');
  } catch (error) {
    console.error('❌ 网络错误或 API 不可用：');
    console.error(error.message);
    console.error('');
    console.error('可能的原因：');
    console.error('1. 无法连接到 api.deepseek.com（需要翻墙访问）');
    console.error('2. API Key 无效或已过期');
    console.error('3. 网络连接问题');
    process.exit(1);
  }
});
