#!/bin/bash

# 江 Hop 世界杯 AI 预测 - 一键部署脚本

set -e

echo "🚀 江 Hop 世界杯 AI 预测 - Vercel 一键部署"
echo "============================================"

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 已安装: $(node -v)"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI 已就绪"

# 进入项目目录
cd "$(dirname "$0")"

echo ""
echo "📦 安装项目依赖..."
npm install

echo ""
echo "🔑 部署到 Vercel..."
echo "   提示：首次部署会打开浏览器要求登录"
echo ""

# 部署到 Vercel
vercel --prod --env DEEPSEEK_API_KEY=sk-dbbbdc3ab3e3479ba1fee945b559b2e5

# 获取部署 URL（从 .vercel/project.json）
DEPLOYMENT_URL=$(cat .vercel/project.json 2>/dev/null | grep -o '"productionDeploymentUrl":"[^"]*"' | cut -d'"' -f4)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo ""
    echo "✅ 部署成功！"
    echo "🌐 生产 URL: $DEPLOYMENT_URL"
    echo ""
    echo "📱 正在生成二维码..."
    node scripts/generate-qr.js "$DEPLOYMENT_URL"
    echo ""
    echo "✅ 二维码已生成并注入到 index.html"
    echo ""
    echo "🎉 所有步骤完成！"
    echo "   用手机扫描新生成的二维码即可访问应用"
else
    echo ""
    echo "⚠️  部署完成，但无法自动获取 URL"
    echo "   请在 Vercel Dashboard 中查看部署 URL"
    echo "   然后运行：node scripts/generate-qr.js https://your-url"
fi
