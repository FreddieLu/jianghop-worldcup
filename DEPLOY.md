# 🚀 Vercel 部署指南

## 快速部署（推荐）

### 1. 登录 Vercel
```bash
npx vercel login
```
浏览器会打开，用 GitHub/GitLab/Bitbucket 账户登录。

### 2. 部署项目
```bash
cd /Users/freddie/Desktop/jianghop-worldcup
npx vercel --prod
```

### 3. 配置环境变量
部署完成后，在 Vercel Dashboard 中：
- 进入项目 → Settings → Environment Variables
- 添加：`DEEPSEEK_API_KEY` = `sk-dbbbdc3ab3e3479ba1fee945b559b2e5`
- 重新部署：`npx vercel --prod`

---

## 部署后的 URL

部署成功后，Vercel 会给你一个 URL，如：
```
https://jianghop-worldcup.vercel.app
```

---

## 生成二维码

部署完成后，用 QR Code 生成器生成二维码指向你的 Vercel URL：
- 在线工具：https://www.qr-code-generator.com/
- 输入 URL：`https://jianghop-worldcup.vercel.app`
- 下载二维码图片，替换到 `index.html` 中的 `poster-qr-placeholder` 处

---

## 本地测试（部署前）

```bash
# 终端 1：启动后端
cd /Users/freddie/Desktop/jianghop-worldcup/api
export DEEPSEEK_API_KEY=sk-dbbbdc3ab3e3479ba1fee945b559b2e5
node ../api/server.js

# 终端 2：启动前端
cd /Users/freddie/Desktop/jianghop-worldcup
npx serve .
```

访问 http://localhost:3000，点击「AI 预测」，5 秒后应看到 DeepSeek 的分析。

---

## 常见问题

**Q: 部署后为什么显示"API 未连接"？**
A: 环境变量没有设置。检查 Vercel Dashboard 中的 `DEEPSEEK_API_KEY` 是否已添加。

**Q: 为什么预测很慢？**
A: DeepSeek API 首次调用可能需要 5-10 秒。同一场比赛第二次调用会使用缓存（瞬间）。

**Q: 如何更新球队数据？**
A: 编辑 `js/teams.json`，然后重新部署：`npx vercel --prod`
