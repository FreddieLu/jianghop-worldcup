/* ======================================
   江 Hop 世界杯 AI 预测 — 主逻辑
   ====================================== */

// ─── 国旗 Emoji 映射 ───
const FLAGS = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czech Republic': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'United States': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turkey': '🇹🇷',
  'Germany': '🇩🇪', 'Curaçao': '🇨🇼', 'Ivory Coast': '🇨🇮', 'Ecuador': '🇪🇨',
  'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪', 'Egypt': '🇪🇬', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
  'Spain': '🇪🇸', 'Cape Verde': '🇨🇻', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾',
  'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
  'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
  'Portugal': '🇵🇹', 'DR Congo': '🇨🇩', 'Uzbekistan': '🇺🇿', 'Colombia': '🇨🇴',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦'
};

// ─── 中文队名 ───
const TEAM_CN = {
  'Mexico': '墨西哥', 'South Africa': '南非', 'South Korea': '韩国', 'Czech Republic': '捷克',
  'Canada': '加拿大', 'Bosnia and Herzegovina': '波黑', 'Qatar': '卡塔尔', 'Switzerland': '瑞士',
  'Brazil': '巴西', 'Morocco': '摩洛哥', 'Haiti': '海地', 'Scotland': '苏格兰',
  'United States': '美国', 'Paraguay': '巴拉圭', 'Australia': '澳大利亚', 'Turkey': '土耳其',
  'Germany': '德国', 'Curaçao': '库拉索', 'Ivory Coast': '科特迪瓦', 'Ecuador': '厄瓜多尔',
  'Netherlands': '荷兰', 'Japan': '日本', 'Sweden': '瑞典', 'Tunisia': '突尼斯',
  'Belgium': '比利时', 'Egypt': '埃及', 'Iran': '伊朗', 'New Zealand': '新西兰',
  'Spain': '西班牙', 'Cape Verde': '佛得角', 'Saudi Arabia': '沙特', 'Uruguay': '乌拉圭',
  'France': '法国', 'Senegal': '塞内加尔', 'Iraq': '伊拉克', 'Norway': '挪威',
  'Argentina': '阿根廷', 'Algeria': '阿尔及利亚', 'Austria': '奥地利', 'Jordan': '约旦',
  'Portugal': '葡萄牙', 'DR Congo': '刚果(金)', 'Uzbekistan': '乌兹别克斯坦', 'Colombia': '哥伦比亚',
  'England': '英格兰', 'Croatia': '克罗地亚', 'Ghana': '加纳', 'Panama': '巴拿马'
};

function getFlag(team) {
  return FLAGS[team] || '🏳️';
}

function getCN(team) {
  return TEAM_CN[team] || team;
}

// ─── 日期工具 ───
function parseMatchDate(dateStr) {
  // "June 11, 2026" -> Date
  return new Date(dateStr);
}

function formatDateCN(dateStr) {
  const d = parseMatchDate(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekdays[d.getDay()]}`;
}

function formatDateShort(dateStr) {
  const d = parseMatchDate(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isToday(dateStr) {
  const d = parseMatchDate(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

function isMatchPlayed(match) {
  return match.score && match.score !== 'TBD';
}

// ─── 赛程渲染 ───
const dates = [...new Set(MATCH_DATA.matches.map(m => m.date))]
  .sort((a, b) => new Date(a) - new Date(b));
let activeDate = null;

function initDateFilter() {
  const container = document.getElementById('dateFilter');

  // 「全部」按钮
  const allChip = document.createElement('div');
  allChip.className = 'date-chip active';
  allChip.textContent = '全部';
  allChip.onclick = () => selectDate(null, allChip);
  container.appendChild(allChip);

  dates.forEach(dateStr => {
    const chip = document.createElement('div');
    chip.className = 'date-chip';
    const d = parseMatchDate(dateStr);
    const shortDate = `${d.getMonth() + 1}/${d.getDate()}`;
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

    if (isToday(dateStr)) {
      chip.innerHTML = `今天`;
      chip.classList.add('active');
      // 默认选中今天
      allChip.classList.remove('active');
      activeDate = dateStr;
    } else {
      chip.innerHTML = `${shortDate}<span class="chip-day">周${weekdays[d.getDay()]}</span>`;
    }

    chip.onclick = () => selectDate(dateStr, chip);
    container.appendChild(chip);
  });

  renderMatches();

  // 滚动到"今天"
  const activeChip = container.querySelector('.date-chip.active');
  if (activeChip) {
    activeChip.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }
}

function selectDate(date, chip) {
  document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  activeDate = date;
  renderMatches();
}

function renderMatches() {
  const container = document.getElementById('matchList');
  container.innerHTML = '';

  const filtered = activeDate
    ? MATCH_DATA.matches.filter(m => m.date === activeDate)
    : MATCH_DATA.matches;

  let lastDate = '';
  filtered.forEach(match => {
    if (match.date !== lastDate) {
      lastDate = match.date;
      const header = document.createElement('div');
      header.className = 'match-date-header';
      header.textContent = formatDateCN(match.date);
      container.appendChild(header);
    }

    const card = document.createElement('div');
    card.className = 'match-card';
    const played = isMatchPlayed(match);

    card.innerHTML = `
      <div class="match-meta">
        <span class="match-group">小组 ${match.group}</span>
        <span class="match-time">${match.time_bj ? '北京 ' + match.time_bj : ''}</span>
      </div>
      <div class="match-teams">
        <div class="match-team">
          <span class="team-flag">${getFlag(match.team1)}</span>
          <span class="team-name">${getCN(match.team1)}</span>
        </div>
        ${played
          ? `<div class="match-score-display">${match.score}</div>`
          : `<span class="match-vs">VS</span>`
        }
        <div class="match-team right">
          <span class="team-flag">${getFlag(match.team2)}</span>
          <span class="team-name">${getCN(match.team2)}</span>
        </div>
      </div>
      <div class="match-bottom">
        <span class="match-venue">${match.venue || ''}</span>
        ${played
          ? `<button class="predict-btn played">已结束</button>`
          : `<button class="predict-btn available" onclick="startPredict('${match.id}')">🔮 AI 预测</button>`
        }
      </div>
    `;

    container.appendChild(card);
  });
}

// ─── 预测缓存 ───
const predictionCache = {};

// ─── 持久化缓存（IndexedDB） ───
const DB_NAME = 'JiangHopWorldCup';
const STORE_NAME = 'predictions';

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function getCachedPrediction(matchId) {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(matchId);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('缓存读取失败:', e);
    return null;
  }
}

async function savePrediction(matchId, prediction) {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({
        id: matchId,
        data: prediction,
        timestamp: Date.now(),
      });
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('缓存保存失败:', e);
    return false;
  }
}

// ─── 预测流程 ───
let currentMatch = null;

async function startPredict(matchId) {
  const match = MATCH_DATA.matches.find(m => m.id === matchId);
  if (!match) return;
  currentMatch = match;

  // 检查缓存
  const cached = await getCachedPrediction(matchId);
  if (cached) {
    console.log('✅ 使用缓存预测');
    showResult(match, cached);
    return;
  }

  // 显示广告页
  showPage('page-ad');
  startAdCountdown(match);
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

function startAdCountdown(match) {
  const progressBar = document.getElementById('adProgress');
  const countdownEl = document.getElementById('adCountdown');
  const totalTime = 5000; // 5秒
  const startTime = Date.now();

  // 同时发起 AI 预测请求
  const predictionPromise = fetchPrediction(match);

  function tick() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / totalTime * 100, 100);
    progressBar.style.width = progress + '%';
    countdownEl.textContent = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));

    if (elapsed < totalTime) {
      requestAnimationFrame(tick);
    } else {
      // 广告结束，等预测完成
      predictionPromise.then(async prediction => {
        await savePrediction(match.id, prediction);
        showResult(match, prediction);
      }).catch(e => {
        console.error('预测失败:', e);
        alert('预测失败，请重试');
        showPage('page-home');
      });
    }
  }
  requestAnimationFrame(tick);
}

// ─── AI 预测（调用 DeepSeek API） ───
async function fetchPrediction(match) {
  // 根据环境动态设置 API URL
  let API_URL;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = 'http://localhost:3001/api/predict';
  } else {
    // 生产环境：假设前后端同域
    API_URL = `${window.location.origin}/api/predict`;
  }

  if (!window.teamsData) {
    console.warn('⚠️ 球队数据未加载');
    return generateLocalPrediction(match);
  }

  const team1Data = window.teamsData[match.team1];
  const team2Data = window.teamsData[match.team2];

  if (!team1Data || !team2Data) {
    console.warn(`⚠️ 找不到 ${match.team1} 或 ${match.team2} 的数据`);
    return generateLocalPrediction(match);
  }

  try {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team1: match.team1,
        team2: match.team2,
        group: match.group,
        date: match.date,
        team1Data: team1Data,
        team2Data: team2Data,
      }),
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const result = await resp.json();
    console.log('✅ AI 预测成功:', result);
    return result;
  } catch (error) {
    console.warn('⚠️ API 调用失败，使用本地模拟:', error.message);
    return generateLocalPrediction(match);
  }
}

function generateLocalPrediction(match) {
  // 本地模拟（仅作为 API 不可用时的后备方案）
  // 不再返回分析文本，只返回技术层面的预测

  const teamStrength = {
    'Brazil': 92, 'France': 91, 'Argentina': 93, 'England': 90, 'Spain': 90,
    'Germany': 89, 'Portugal': 89, 'Netherlands': 88, 'Belgium': 86, 'Croatia': 85,
    'Uruguay': 84, 'Colombia': 83, 'Japan': 82, 'South Korea': 81, 'Mexico': 81,
    'United States': 82, 'Morocco': 83, 'Senegal': 80, 'Switzerland': 82, 'Turkey': 80,
    'Egypt': 78, 'Australia': 78, 'Canada': 79, 'Ecuador': 79, 'Sweden': 79,
    'Ivory Coast': 79, 'Iran': 77, 'Qatar': 75, 'Austria': 80, 'Norway': 79,
    'Scotland': 77, 'Algeria': 76, 'Tunisia': 76, 'Saudi Arabia': 75, 'Ghana': 76,
    'Panama': 74, 'Iraq': 74, 'New Zealand': 72, 'Paraguay': 76, 'Jordan': 73,
    'Curaçao': 65, 'Cape Verde': 68, 'Haiti': 66, 'DR Congo': 73,
    'Czech Republic': 79, 'Uzbekistan': 74, 'Bosnia and Herzegovina': 77,
    'South Africa': 75,
  };

  const s1 = teamStrength[match.team1] || 75;
  const s2 = teamStrength[match.team2] || 75;
  const diff = s1 - s2;

  const seed = hashCode(match.id + match.team1 + match.team2);
  const rng = mulberry32(seed);

  let goals1, goals2;
  if (diff > 15) {
    goals1 = Math.floor(rng() * 3) + 2;
    goals2 = Math.floor(rng() * 2);
  } else if (diff > 5) {
    goals1 = Math.floor(rng() * 3) + 1;
    goals2 = Math.floor(rng() * 2);
  } else if (diff > -5) {
    goals1 = Math.floor(rng() * 3);
    goals2 = Math.floor(rng() * 3);
  } else if (diff > -15) {
    goals1 = Math.floor(rng() * 2);
    goals2 = Math.floor(rng() * 3) + 1;
  } else {
    goals1 = Math.floor(rng() * 2);
    goals2 = Math.floor(rng() * 3) + 2;
  }

  // 标签
  let tag, tagClass;
  const goalDiff = Math.abs(goals1 - goals2);
  if (goalDiff >= 3) {
    tag = '🔥 大比分预警';
    tagClass = 'tag-hot';
  } else if (goalDiff === 0) {
    tag = '⚖️ 五五开';
    tagClass = 'tag-even';
  } else if (goals1 > goals2 && s1 < s2) {
    tag = '🚨 冷门预警';
    tagClass = 'tag-hot';
  } else if (goals2 > goals1 && s2 < s1) {
    tag = '🚨 冷门预警';
    tagClass = 'tag-hot';
  } else {
    tag = '🐶 稳如老狗';
    tagClass = 'tag-safe';
  }

  return {
    score1: goals1,
    score2: goals2,
    analysis: '⚠️ API 未连接，显示数据模拟预测。请配置后端 DeepSeek API 以获得真实分析。',
    tag: tag,
    tagClass: tagClass,
  };
}

// ─── 确定性随机 ───
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ─── 展示结果 ───
function showResult(match, prediction) {
  showPage('page-result');

  document.getElementById('resultGroup').textContent = `小组 ${match.group} · ${formatDateCN(match.date)}`;
  document.getElementById('flag1').textContent = getFlag(match.team1);
  document.getElementById('flag2').textContent = getFlag(match.team2);
  document.getElementById('teamName1').textContent = getCN(match.team1);
  document.getElementById('teamName2').textContent = getCN(match.team2);

  // 比分动画
  animateScore('score1', prediction.score1);
  animateScore('score2', prediction.score2);

  // 标签
  const tagEl = document.getElementById('resultTag');
  tagEl.innerHTML = `<span class="${prediction.tagClass}">${prediction.tag}</span>`;

  // 分析
  document.getElementById('resultAnalysis').textContent = prediction.analysis;

  // 同步到海报
  document.getElementById('posterFlag1').textContent = getFlag(match.team1);
  document.getElementById('posterFlag2').textContent = getFlag(match.team2);
  document.getElementById('posterTeam1').textContent = getCN(match.team1);
  document.getElementById('posterTeam2').textContent = getCN(match.team2);
  document.getElementById('posterScore1').textContent = prediction.score1;
  document.getElementById('posterScore2').textContent = prediction.score2;

  // 海报文案
  const cn1 = getCN(match.team1);
  const cn2 = getCN(match.team2);
  if (prediction.score1 > prediction.score2) {
    document.getElementById('posterTagline').textContent = `AI 说${cn1}赢，你觉得呢？`;
  } else if (prediction.score1 < prediction.score2) {
    document.getElementById('posterTagline').textContent = `AI 说${cn2}赢，你觉得呢？`;
  } else {
    document.getElementById('posterTagline').textContent = `AI 说打平，你同意吗？`;
  }
}

function animateScore(elId, target) {
  const el = document.getElementById(elId);
  el.textContent = '0';
  if (target === 0) return;

  let current = 0;
  const step = () => {
    current++;
    el.textContent = current;
    if (current < target) {
      setTimeout(step, 200);
    }
  };
  setTimeout(step, 300);
}

// ─── 保存海报 ───
document.getElementById('saveBtn').addEventListener('click', async () => {
  const canvas = document.getElementById('posterCanvas');
  canvas.style.left = '0';
  canvas.style.position = 'relative';

  try {
    const canvasEl = await html2canvas(canvas, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0A0E1A',
      width: 375,
    });

    canvas.style.left = '-9999px';
    canvas.style.position = 'fixed';

    const dataUrl = canvasEl.toDataURL('image/png');

    // 创建预览弹层
    const overlay = document.createElement('div');
    overlay.className = 'preview-overlay';
    overlay.innerHTML = `
      <img src="${dataUrl}" alt="预测海报">
      <p class="preview-hint">📱 长按图片保存到相册</p>
      <button class="preview-close" onclick="this.parentElement.remove()">关闭</button>
    `;
    document.body.appendChild(overlay);
  } catch (e) {
    canvas.style.left = '-9999px';
    canvas.style.position = 'fixed';
    alert('海报生成失败，请重试');
    console.error(e);
  }
});

// ─── 返回按钮 ───
document.getElementById('backBtn').addEventListener('click', () => {
  showPage('page-home');
});

// ─── 启动 ───
initDateFilter();
