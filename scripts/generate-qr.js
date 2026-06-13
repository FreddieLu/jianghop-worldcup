#!/usr/bin/env node

/**
 * 生成 QR Code 并注入到 HTML
 * 用法：node scripts/generate-qr.js https://jianghop-worldcup.vercel.app
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEPLOYED_URL = process.argv[2] || 'https://jianghop-worldcup.vercel.app';

console.log(`📱 为 URL 生成二维码: ${DEPLOYED_URL}`);

// 使用 qr-server API 生成二维码
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(DEPLOYED_URL)}`;

https.get(qrApiUrl, (res) => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', () => {
    const qrImage = Buffer.concat(chunks);
    const base64 = qrImage.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // 更新 HTML
    const htmlPath = path.join(__dirname, '../index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // 替换 QR 占位符
    html = html.replace(
      /<div class="poster-qr-placeholder"[^>]*>.*?<\/div>/,
      `<img class="poster-qr-img" src="${dataUrl}" alt="QR Code" style="width: 100px; height: 100px; border-radius: 4px;">`
    );

    fs.writeFileSync(htmlPath, html);
    console.log(`✅ 二维码已生成并注入到 index.html`);
    console.log(`📍 指向 URL: ${DEPLOYED_URL}`);
  });
}).on('error', err => {
  console.error('❌ 生成二维码失败:', err.message);
  process.exit(1);
});
