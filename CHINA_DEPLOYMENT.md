# 🚀 国内部署方案（免费）

## 方案一：Railway（推荐）- 国内访问最快

### 1. 连接 GitHub
访问 https://railway.app/，用 GitHub 账号登录

### 2. 一键部署
点击 "Create New Project" → "Deploy from GitHub" → 选择 `jianghop-worldcup` 仓库

### 3. 配置环境变量
部署后，进入项目 → "Variables" → 添加：
```
DEEPSEEK_API_KEY=sk-dbbbdc3ab3e3479ba1fee945b559b2e5
```

### 4. 部署完成
Railway 会自动分配一个 URL，如：
```
https://jianghop-worldcup-production.up.railway.app
```

国内访问速度：✅ 快

---

## 方案二：Hugging Face Spaces（完全免费）

### 1. 创建 Space
访问 https://huggingface.co/spaces，创建新 Space

### 2. 选择 Docker
选择模板为 Docker

### 3. 上传代码
```bash
git clone https://huggingface.co/spaces/your-username/jianghop-worldcup
cd jianghop-worldcup
git remote add origin https://github.com/你的用户名/jianghop-worldcup
git push -u origin main
```

### 4. 部署
Hugging Face 会自动部署，获得 URL：
```
https://your-username-jianghop-worldcup.hf.space
```

国内访问速度：✅ 可以（有时需要等待）

---

## 方案三：本地 + 内网穿透（完全免费但需要电脑）

如果用 **ngrok**（免费） 或 **Cloudflare Tunnel**（免费）将本地服务暴露到网络

```bash
# 本地运行
DEEPSEEK_API_KEY=sk-xxx npm start

# 另一个终端用 ngrok 暴露
ngrok http 3001
```

国内访问速度：⚠️ 取决于内网穿透服务

---

## 我的建议

👉 **首选：Railway**
- 部署超快（3 分钟完成）
- 国内访问稳定快速
- 免费额度充足（$5/月）
- 环境变量配置简单

---

## 当前状态

❌ Vercel（需要 VPN）
✅ DeepSeek API 配置代码已修复
⏳ 等待你选择部署方案

