# ⚽ 江 Hop 世界杯 AI 预测

2026 世界杯 AI 比分预测工具，由 DeepSeek AI 驱动权威分析。

## 📁 项目结构

```
jianghop-worldcup/
├── index.html          # 主页面
├── css/style.css       # 样式
├── js/
│   ├── matches.js      # 赛程数据（72 场小组赛）
│   ├── teams.json      # 48 支球队信息库
│   └── app.js          # 主逻辑
├── api/
│   └── server.js       # DeepSeek API 后端
└── README.md
```

## 🚀 快速开始

### 前端本地预览
```bash
# 用 Live Server 或任何本地服务器打开
npx serve .
# 或用 Python
python3 -m http.server 8000
```

### 后端 API 部署（获得真实 AI 分析）

1. **安装依赖**
```bash
cd api
npm install express cors node-fetch
```

2. **配置 DeepSeek API Key**
```bash
export DEEPSEEK_API_KEY=sk_your_deepseek_key
```

3. **启动后端**
```bash
node server.js
```

后端会在 `http://localhost:3001` 上运行。

## 🤖 工作流程

```
用户点击「AI 预测」
    ↓
前端显示 5 秒广告插屏
    ↓
后端异步调用 DeepSeek API
    ↓
API 接收球队真实数据：
  - 世界排名
  - 关键球员 + 主教练
  - 球队身价
  - 优势特点
  - 伤病情况
  - 近期战绩
    ↓
DeepSeek 基于这些数据进行权威分析
    ↓
返回：比分预测 + AI 分析文本 + 趣味标签
    ↓
5 秒后显示结果页
    ↓
用户可保存为海报分享
```

## 📊 球队数据源

`teams.json` 包含每支球队的：
- 🏆 **世界排名** — 2026 年 6 月官方排名
- 👥 **关键球员** — 每队 3-5 个核心球员名单
- 💰 **阵容身价** — 单位：10 亿欧元
- ⚽ **优势特点** — 防线/中场/进攻等
- 🤕 **伤病情况** — 缺阵球员列表
- 📊 **近期成绩** — 最近战绩简述

**数据准确性**：这些数据会在 6 月中旬前更新为最新信息。

## 🎯 API 调用示例

```javascript
const prediction = await fetch('http://localhost:3001/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    team1: 'Brazil',
    team2: 'Mexico',
    group: 'A',
    date: 'June 11, 2026',
    team1Data: { ranking: 1, keyPlayers: [...], injuries: [], ... },
    team2Data: { ranking: 13, keyPlayers: [...], injuries: [], ... },
  }),
});

// 返回
{
  "score1": 2,
  "score2": 1,
  "analysis": "巴西排名世界第一，近期状态稳定...",
  "tag": "🐶 稳如老狗",
  "tagClass": "tag-safe"
}
```

## 🔧 自定义

### 修改门店信息
编辑 `index.html` 中的广告页面和海报部分，更新：
- 门店地址
- 电话号码
- 营业信息

### 更新球队数据
直接编辑 `teams.json`，修改排名、伤病、近期成绩等。

### 替换二维码
在 `poster-qr-placeholder` 处替换为真实二维码图片（指向本应用首页）。

## 📱 部署到云端

### Vercel（推荐）
```bash
# 前端部署
vercel deploy

# 后端部署为 Serverless Function
# 将 api/server.js 改写为 Vercel Function
```

### 其他选项
- **Netlify** — 前端 + Netlify Function
- **Railway** — 一键部署整个应用
- **Docker** — 容器化后上传 Docker Hub

## ⚠️ 注意事项

- **API Key 安全**：生产环境下，不要在前端代码中暴露 API Key，必须通过后端中转
- **缓存策略**：同一场比赛的预测结果会被缓存，避免重复调用
- **淘汰赛支持**：当前仅支持小组赛 72 场，淘汰赛需手动添加

## 📝 更新日志

### v1.0 (2026-06-13)
- ✅ 完整小组赛赛程
- ✅ 48 支球队信息库
- ✅ DeepSeek AI 权威分析
- ✅ 海报生成 + 分享
- ✅ localStorage 缓存
- ✅ 移动端完美适配

