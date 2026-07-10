/* 小公主衣櫥 – 換裝遊戲 */
'use strict';

const $ = s => document.querySelector(s);

/* ---------- 小工具 ---------- */
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
function star(cx, cy, r1, r2, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? r2 : r1;
    const a = (rot + i * 36) * Math.PI / 180;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
  }
  return pts.join(' ');
}
function heart(x, y, s, f) {
  return `<path d="M${x} ${y + 5 * s} C ${x - 7 * s} ${y - 2 * s} ${x - 3 * s} ${y - 7 * s} ${x} ${y - 2 * s} C ${x + 3 * s} ${y - 7 * s} ${x + 7 * s} ${y - 2 * s} ${x} ${y + 5 * s} Z" fill="${f}"/>`;
}
function flower(x, y, petal, center) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180;
    s += `<circle cx="${(x + 6 * Math.cos(a)).toFixed(1)}" cy="${(y + 6 * Math.sin(a)).toFixed(1)}" r="4.5" fill="${petal}"/>`;
  }
  return s + `<circle cx="${x}" cy="${y}" r="3.5" fill="${center}"/>`;
}
function cloud(x, y, s, op = .92) {
  return `<g fill="#fff" opacity="${op}">
    <ellipse cx="${x}" cy="${y}" rx="${30 * s}" ry="${16 * s}"/>
    <ellipse cx="${x - 20 * s}" cy="${y + 5 * s}" rx="${18 * s}" ry="${11 * s}"/>
    <ellipse cx="${x + 22 * s}" cy="${y + 5 * s}" rx="${18 * s}" ry="${11 * s}"/>
  </g>`;
}

/* ---------- 顏色 ---------- */
const HAIR_COLORS = ['#6e4a2f', '#f4c95d', '#f79ac0', '#a97fd6', '#4a4553', '#e8734a'];
const DRESS_COLORS = ['#ff8fc0', '#bf94ea', '#7fc4f2', '#8fdcb8', '#ffd670', '#ff8a80'];

/* ---------- 角色本體 ---------- */
const SKIN = '#ffe3d2';
function body() {
  return `
  <path d="M150 262 Q116 292 112 330" stroke="${SKIN}" stroke-width="20" fill="none" stroke-linecap="round"/>
  <path d="M210 262 Q244 292 248 330" stroke="${SKIN}" stroke-width="20" fill="none" stroke-linecap="round"/>
  <rect x="158" y="350" width="19" height="115" rx="9.5" fill="${SKIN}"/>
  <rect x="183" y="350" width="19" height="115" rx="9.5" fill="${SKIN}"/>
  <rect x="168" y="212" width="24" height="38" rx="10" fill="${SKIN}"/>
  <path d="M150 240 Q180 232 210 240 L214 322 Q180 334 146 322 Z" fill="${SKIN}"/>
  <ellipse cx="180" cy="140" rx="90" ry="85" fill="${SKIN}"/>`;
}
function face() {
  return `
  <path d="M136 127 Q147 120 158 126" stroke="#c99a76" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M202 126 Q213 120 224 127" stroke="#c99a76" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="147" cy="153" rx="12" ry="15" fill="#463a44"/>
  <ellipse cx="213" cy="153" rx="12" ry="15" fill="#463a44"/>
  <circle cx="151" cy="147" r="4.5" fill="#fff"/>
  <circle cx="217" cy="147" r="4.5" fill="#fff"/>
  <circle cx="143" cy="159" r="2" fill="#fff" opacity=".85"/>
  <circle cx="209" cy="159" r="2" fill="#fff" opacity=".85"/>
  <path d="M131 145 L123 140" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M133 154 L124 152" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M229 145 L237 140" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M227 154 L236 152" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="118" cy="180" rx="13" ry="8" fill="#ffb3c4" opacity=".7"/>
  <ellipse cx="242" cy="180" rx="13" ry="8" fill="#ffb3c4" opacity=".7"/>
  <circle cx="180" cy="172" r="2.5" fill="#f0b294"/>
  <path d="M167 189 Q180 205 193 189 Q186 195 180 195 Q174 195 167 189 Z" fill="#d96a7e"/>`;
}

/* ---------- 髮型 ---------- */
const bangs = c => `<path d="M92 152 Q80 52 180 48 Q280 52 268 152 Q254 100 226 116 Q210 90 180 108 Q150 90 134 116 Q106 100 92 152 Z" fill="${c}"/>`;

const HAIRS = [
  {
    id: 'long', name: '公主長髮',
    back: c => `<path d="M92 140 Q64 44 180 40 Q296 44 268 140 L284 308 Q290 350 254 356 L106 356 Q70 350 76 308 Z" fill="${c}"/>
      <path d="M120 200 Q114 280 122 340" stroke="${shade(c, .78)}" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>
      <path d="M240 200 Q246 280 238 340" stroke="${shade(c, .78)}" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>`,
    front: c => bangs(c) + `
      <path d="M93 148 Q84 210 96 258 Q108 268 113 250 Q104 200 105 156 Z" fill="${c}"/>
      <path d="M267 148 Q276 210 264 258 Q252 268 247 250 Q256 200 255 156 Z" fill="${c}"/>`
  },
  {
    id: 'twin', name: '雙馬尾',
    back: c => `<circle cx="80" cy="118" r="34" fill="${c}"/><circle cx="280" cy="118" r="34" fill="${c}"/>
      <path d="M80 118 Q38 210 76 292 Q94 316 118 288 Q94 212 114 132 Z" fill="${c}"/>
      <path d="M280 118 Q322 210 284 292 Q266 316 242 288 Q266 212 246 132 Z" fill="${c}"/>
      <circle cx="94" cy="290" r="19" fill="${c}"/><circle cx="266" cy="290" r="19" fill="${c}"/>
      <path d="M88 170 Q76 230 88 274" stroke="${shade(c, .78)}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>
      <path d="M272 170 Q284 230 272 274" stroke="${shade(c, .78)}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>`,
    front: c => bangs(c) + `<circle cx="103" cy="104" r="10" fill="#ff7fb2"/><circle cx="257" cy="104" r="10" fill="#ff7fb2"/>`
  },
  {
    id: 'bun', name: '包包頭',
    back: c => `<path d="M90 135 Q62 46 180 42 Q298 46 270 135 L272 185 Q272 220 240 214 L120 214 Q88 220 88 185 Z" fill="${c}"/>`,
    front: c => `<circle cx="180" cy="38" r="34" fill="${c}"/>
      <path d="M152 50 Q180 36 208 50" stroke="${shade(c, .78)}" stroke-width="4" fill="none" opacity=".5"/>
      <ellipse cx="180" cy="64" rx="27" ry="9" fill="#ff7fb2"/>` + bangs(c)
  },
  {
    id: 'wave', name: '波浪捲捲',
    back: c => `<path d="M92 132 Q64 44 180 40 Q296 44 268 132 L272 296 L88 296 Z" fill="${c}"/>
      <circle cx="86" cy="190" r="20" fill="${c}"/><circle cx="274" cy="190" r="20" fill="${c}"/>
      <circle cx="84" cy="248" r="20" fill="${c}"/><circle cx="276" cy="248" r="20" fill="${c}"/>
      <circle cx="96" cy="296" r="24" fill="${c}"/><circle cx="138" cy="308" r="24" fill="${c}"/>
      <circle cx="180" cy="314" r="24" fill="${c}"/><circle cx="222" cy="308" r="24" fill="${c}"/>
      <circle cx="264" cy="296" r="24" fill="${c}"/>
      <path d="M118 292 q10 -14 20 2 M200 296 q10 -14 20 2" stroke="${shade(c, .78)}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>`,
    front: c => bangs(c) + `<circle cx="98" cy="158" r="14" fill="${c}"/><circle cx="262" cy="158" r="14" fill="${c}"/>`
  },
  {
    id: 'short', name: '俏麗短髮',
    back: c => `<path d="M90 130 Q60 42 180 38 Q300 42 270 130 L276 196 Q280 238 234 232 L126 232 Q80 238 84 196 Z" fill="${c}"/>
      <circle cx="112" cy="224" r="16" fill="${c}"/><circle cx="248" cy="224" r="16" fill="${c}"/>`,
    front: c => bangs(c) + `<rect x="228" y="88" width="36" height="8" rx="4" transform="rotate(22 246 92)" fill="#ffd23e"/>`
  }
];

/* ---------- 洋裝 ---------- */
const DRESSES = [
  {
    id: 'gown', name: '蓬蓬禮服',
    svg: c => {
      const d = shade(c, .78);
      return `
      <circle cx="143" cy="253" r="16" fill="${c}"/><circle cx="217" cy="253" r="16" fill="${c}"/>
      <path d="M148 238 Q180 252 212 238 L218 308 L142 308 Z" fill="${c}"/>
      <path d="M142 302 Q180 292 218 302 Q266 348 258 402 L102 402 Q94 348 142 302 Z" fill="${c}"/>
      <path d="M102 400 Q115 418 128 400 Q141 418 154 400 Q167 418 180 400 Q193 418 206 400 Q219 418 232 400 Q245 418 258 400 Z" fill="${c}"/>
      <path d="M142 302 Q180 290 218 302 L218 316 Q180 304 142 316 Z" fill="${d}"/>
      <path d="M160 320 L146 394 M200 320 L214 394" stroke="${d}" stroke-width="4" opacity=".45" fill="none" stroke-linecap="round"/>
      <circle cx="180" cy="314" r="7" fill="#fff" opacity=".95"/>
      <circle cx="150" cy="360" r="5" fill="#fff" opacity=".7"/>
      <circle cx="210" cy="360" r="5" fill="#fff" opacity=".7"/>
      <circle cx="180" cy="384" r="5" fill="#fff" opacity=".7"/>`;
    }
  },
  {
    id: 'aline', name: '甜心洋裝',
    svg: c => {
      const d = shade(c, .78);
      return `
      <circle cx="146" cy="250" r="13" fill="${c}"/><circle cx="214" cy="250" r="13" fill="${c}"/>
      <path d="M150 238 L210 238 L238 384 Q180 400 122 384 Z" fill="${c}"/>
      <path d="M124 372 Q180 388 236 372 L238 384 Q180 400 122 384 Z" fill="${d}"/>
      <circle cx="168" cy="243" r="9" fill="#fff"/><circle cx="192" cy="243" r="9" fill="#fff"/>
      <path d="M180 258 L166 250 L166 268 Z" fill="${d}"/>
      <path d="M180 258 L194 250 L194 268 Z" fill="${d}"/>
      <circle cx="180" cy="259" r="4.5" fill="${d}"/>
      ${heart(156, 330, 1.4, '#ffffff')}${heart(204, 348, 1.4, '#ffffff')}`;
    }
  },
  {
    id: 'tutu', name: '芭蕾紗裙',
    svg: c => {
      const d = shade(c, .78);
      return `
      <path d="M150 238 Q180 250 210 238 L214 318 Q180 330 146 318 Z" fill="${c}"/>
      <ellipse cx="180" cy="326" rx="80" ry="26" fill="${c}" opacity=".38"/>
      <ellipse cx="180" cy="334" rx="68" ry="24" fill="${c}" opacity=".55"/>
      <ellipse cx="180" cy="342" rx="54" ry="22" fill="${c}"/>
      <rect x="146" y="308" width="68" height="10" rx="5" fill="${d}"/>
      <circle cx="166" cy="266" r="3" fill="#fff" opacity=".85"/>
      <circle cx="194" cy="284" r="3" fill="#fff" opacity=".85"/>
      <circle cx="176" cy="298" r="3" fill="#fff" opacity=".85"/>`;
    }
  },
  {
    id: 'flowerdress', name: '花花洋裝',
    svg: c => {
      const d = shade(c, .78);
      return `
      <circle cx="146" cy="250" r="13" fill="${c}"/><circle cx="214" cy="250" r="13" fill="${c}"/>
      <path d="M150 238 L210 238 L234 378 Q180 392 126 378 Z" fill="${c}"/>
      <path d="M126 378 Q139 392 152 378 Q165 392 178 378 Q191 392 204 378 Q217 392 234 378 L232 386 Q180 398 128 386 Z" fill="${d}"/>
      <path d="M150 238 L210 238 L212 250 L148 250 Z" fill="#fff" opacity=".9"/>
      ${flower(152, 330, '#ffffff', '#ffd23e')}
      ${flower(198, 352, '#ffffff', '#ffd23e')}
      ${flower(176, 300, '#ffffff', '#ffd23e')}`;
    }
  }
];

/* ---------- 鞋子 ---------- */
const SHOES = [
  {
    id: 'flats', name: '芭蕾鞋',
    svg: s => {
      const d = shade(s, .75);
      return `
      <ellipse cx="167" cy="460" rx="15" ry="11" fill="${s}"/>
      <ellipse cx="193" cy="460" rx="15" ry="11" fill="${s}"/>
      <path d="M158 452 Q167 447 176 452 M184 452 Q193 447 202 452" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="167" cy="450" r="4" fill="${d}"/><circle cx="193" cy="450" r="4" fill="${d}"/>`;
    }
  },
  {
    id: 'maryjane', name: '小皮鞋',
    svg: s => {
      const d = shade(s, .72);
      return `
      <rect x="158" y="430" width="19" height="18" rx="6" fill="#fff"/>
      <rect x="183" y="430" width="19" height="18" rx="6" fill="#fff"/>
      <rect x="152" y="446" width="30" height="22" rx="11" fill="${s}"/>
      <rect x="178" y="446" width="30" height="22" rx="11" fill="${s}"/>
      <rect x="152" y="448" width="30" height="5" rx="2.5" fill="${d}"/>
      <rect x="178" y="448" width="30" height="5" rx="2.5" fill="${d}"/>
      <circle cx="167" cy="450" r="2.5" fill="#fff"/><circle cx="193" cy="450" r="2.5" fill="#fff"/>`;
    }
  },
  {
    id: 'boots', name: '小靴子',
    svg: s => {
      const d = shade(s, .72);
      return `
      <rect x="154" y="416" width="26" height="52" rx="8" fill="${s}"/>
      <rect x="180" y="416" width="26" height="52" rx="8" fill="${s}"/>
      <rect x="152" y="412" width="30" height="12" rx="6" fill="${d}"/>
      <rect x="178" y="412" width="30" height="12" rx="6" fill="${d}"/>
      <polygon points="${star(167, 442, 7, 3)}" fill="#fff"/>
      <polygon points="${star(193, 442, 7, 3)}" fill="#fff"/>`;
    }
  },
  {
    id: 'bunny', name: '兔兔鞋',
    svg: s => `
      <ellipse cx="159" cy="441" rx="5" ry="12" fill="#fff"/><ellipse cx="173" cy="441" rx="5" ry="12" fill="#fff"/>
      <ellipse cx="159" cy="443" rx="2.5" ry="8" fill="${s}"/><ellipse cx="173" cy="443" rx="2.5" ry="8" fill="${s}"/>
      <ellipse cx="185" cy="441" rx="5" ry="12" fill="#fff"/><ellipse cx="199" cy="441" rx="5" ry="12" fill="#fff"/>
      <ellipse cx="185" cy="443" rx="2.5" ry="8" fill="${s}"/><ellipse cx="199" cy="443" rx="2.5" ry="8" fill="${s}"/>
      <ellipse cx="166" cy="459" rx="17" ry="12" fill="#fff"/>
      <ellipse cx="192" cy="459" rx="17" ry="12" fill="#fff"/>
      <circle cx="161" cy="457" r="2" fill="#463a44"/><circle cx="171" cy="457" r="2" fill="#463a44"/>
      <circle cx="187" cy="457" r="2" fill="#463a44"/><circle cx="197" cy="457" r="2" fill="#463a44"/>
      <path d="M164 462 L168 462 L166 465 Z" fill="#ff8fb8"/>
      <path d="M190 462 L194 462 L192 465 Z" fill="#ff8fb8"/>`
  }
];

/* ---------- 配件 ---------- */
const ACCS = [
  {
    id: 'crown', name: '小皇冠', vb: '185 5 100 78',
    svg: () => `<g transform="rotate(14 235 45)">
      <path d="M198 66 L206 26 L222 48 L235 18 L248 48 L264 26 L272 66 Z" fill="#ffd23e" stroke="#eda711" stroke-width="3" stroke-linejoin="round"/>
      <rect x="196" y="62" width="78" height="10" rx="5" fill="#eda711"/>
      <circle cx="235" cy="18" r="5" fill="#ff6fa5"/>
      <circle cx="206" cy="26" r="4" fill="#7fc4f2"/><circle cx="264" cy="26" r="4" fill="#7fc4f2"/>
    </g>`
  },
  {
    id: 'bow', name: '蝴蝶結', vb: '68 28 100 76',
    svg: () => `<g transform="rotate(-14 118 66)">
      <path d="M118 66 Q86 40 80 66 Q86 92 118 66 Z" fill="#ff6fa5"/>
      <path d="M118 66 Q150 40 156 66 Q150 92 118 66 Z" fill="#ff6fa5"/>
      <path d="M118 66 Q94 50 90 66 Q94 82 118 66 Z" fill="#ff8fb8"/>
      <path d="M118 66 Q142 50 146 66 Q142 82 118 66 Z" fill="#ff8fb8"/>
      <circle cx="118" cy="66" r="9" fill="#e0447e"/>
    </g>`
  },
  {
    id: 'necklace', name: '珍珠項鍊', vb: '142 234 76 48',
    svg: () => {
      const pts = [[156, 246], [164, 252], [172, 256], [180, 258], [188, 256], [196, 252], [204, 246]];
      return pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#fff" stroke="#e3c9ef" stroke-width="1.5"/>`).join('') +
        heart(180, 270, 1.2, '#ff6fa5');
    }
  },
  {
    id: 'wand', name: '魔法棒', vb: '222 255 78 92',
    svg: () => `<g transform="rotate(20 250 320)">
      <rect x="246" y="280" width="8" height="58" rx="4" fill="#f79ac0"/>
      <polygon points="${star(250, 272, 15, 6.5)}" fill="#ffd23e" stroke="#eda711" stroke-width="2" stroke-linejoin="round"/>
    </g>
    <circle cx="277" cy="268" r="3" fill="#ffd23e"/>
    <circle cx="231" cy="286" r="2.5" fill="#ff9ec7"/>
    <circle cx="284" cy="296" r="2.5" fill="#ff9ec7"/>`
  },
  {
    id: 'wings', name: '小翅膀', vb: '35 228 290 115', back: true,
    svg: () => `
      <path d="M140 268 Q62 224 58 286 Q60 330 136 306 Z" fill="#fff" opacity=".9" stroke="#ffc7dd" stroke-width="3"/>
      <path d="M140 292 Q84 300 92 330 Q120 344 142 312 Z" fill="#fff" opacity=".82" stroke="#ffc7dd" stroke-width="3"/>
      <path d="M220 268 Q298 224 302 286 Q300 330 224 306 Z" fill="#fff" opacity=".9" stroke="#ffc7dd" stroke-width="3"/>
      <path d="M220 292 Q276 300 268 330 Q240 344 218 312 Z" fill="#fff" opacity=".82" stroke="#ffc7dd" stroke-width="3"/>`
  },
  {
    id: 'glasses', name: '圓圓眼鏡', vb: '112 122 136 62',
    svg: () => `
      <circle cx="146" cy="152" r="19" fill="#fff" opacity=".25" stroke="#9b7ad6" stroke-width="4"/>
      <circle cx="214" cy="152" r="19" fill="#fff" opacity=".25" stroke="#9b7ad6" stroke-width="4"/>
      <path d="M165 150 Q180 142 195 150" stroke="#9b7ad6" stroke-width="4" fill="none"/>`
  }
];

/* ---------- 場景 ---------- */
const BGS = [
  {
    id: 'castle', name: '粉紅城堡',
    svg: () => `
    <defs><linearGradient id="skyCastle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd9ec"/><stop offset="1" stop-color="#e6d6ff"/>
    </linearGradient></defs>
    <rect width="360" height="520" fill="url(#skyCastle)"/>
    <circle cx="304" cy="62" r="28" fill="#ffe08a"/>
    ${cloud(80, 66, 1)}${cloud(250, 128, .8)}${cloud(46, 178, .7)}
    <g>
      <rect x="30" y="252" width="34" height="150" rx="4" fill="#eadcfb"/>
      <path d="M20 254 L47 198 L74 254 Z" fill="#ff9ec7"/>
      <rect x="70" y="292" width="30" height="110" rx="4" fill="#e0cef7"/>
      <path d="M62 294 L85 248 L108 294 Z" fill="#ff8fb8"/>
      <rect x="43" y="286" width="9" height="16" rx="4.5" fill="#b28ae0"/>
      <rect x="80" y="320" width="8" height="14" rx="4" fill="#b28ae0"/>
      <line x1="47" y1="198" x2="47" y2="178" stroke="#c2557f" stroke-width="3"/>
      <path d="M47 178 L67 184 L47 192 Z" fill="#ff6fa5"/>
    </g>
    <g>
      <rect x="300" y="272" width="30" height="130" rx="4" fill="#eadcfb"/>
      <path d="M292 274 L315 224 L338 274 Z" fill="#ff9ec7"/>
      <rect x="310" y="304" width="9" height="15" rx="4.5" fill="#b28ae0"/>
    </g>
    <path d="M0 430 Q180 400 360 430 L360 520 L0 520 Z" fill="#f7c9e4"/>
    ${heart(320, 460, 1.6, '#ff9ec7')}${heart(36, 470, 1.3, '#ff9ec7')}`
  },
  {
    id: 'garden', name: '花花花園',
    svg: () => `
    <defs><linearGradient id="skyGarden" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c8e9ff"/><stop offset="1" stop-color="#eefaff"/>
    </linearGradient></defs>
    <rect width="360" height="520" fill="url(#skyGarden)"/>
    <circle cx="52" cy="60" r="26" fill="#ffe08a"/>
    ${cloud(270, 70, 1)}${cloud(120, 130, .75)}
    <ellipse cx="70" cy="490" rx="230" ry="95" fill="#b8e6a8"/>
    <ellipse cx="310" cy="510" rx="230" ry="105" fill="#a3dd90"/>
    <g stroke="#6fbf5e" stroke-width="4" stroke-linecap="round">
      <line x1="34" y1="432" x2="34" y2="464"/><line x1="74" y1="452" x2="74" y2="484"/>
      <line x1="322" y1="438" x2="322" y2="470"/><line x1="292" y1="466" x2="292" y2="496"/>
      <line x1="344" y1="482" x2="344" y2="510"/>
    </g>
    <path d="M25 418 Q25 404 34 410 Q43 404 43 418 Q43 430 34 430 Q25 430 25 418 Z" fill="#ff8fb8"/>
    <path d="M65 438 Q65 424 74 430 Q83 424 83 438 Q83 450 74 450 Q65 450 65 438 Z" fill="#ffd670"/>
    <path d="M313 424 Q313 410 322 416 Q331 410 331 424 Q331 436 322 436 Q313 436 313 424 Z" fill="#c39be8"/>
    <path d="M283 452 Q283 438 292 444 Q301 438 301 452 Q301 464 292 464 Q283 464 283 452 Z" fill="#ff8fb8"/>
    <path d="M335 468 Q335 454 344 460 Q353 454 353 468 Q353 480 344 480 Q335 480 335 468 Z" fill="#ffd670"/>
    <g>
      <ellipse cx="52" cy="222" rx="9" ry="12" fill="#ff8fb8" transform="rotate(-24 52 222)"/>
      <ellipse cx="70" cy="222" rx="9" ry="12" fill="#c39be8" transform="rotate(24 70 222)"/>
      <line x1="61" y1="212" x2="61" y2="234" stroke="#8a6bb8" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g>
      <ellipse cx="292" cy="172" rx="8" ry="11" fill="#ffd670" transform="rotate(-24 292 172)"/>
      <ellipse cx="308" cy="172" rx="8" ry="11" fill="#ff8fb8" transform="rotate(24 308 172)"/>
      <line x1="300" y1="163" x2="300" y2="183" stroke="#8a6bb8" stroke-width="3" stroke-linecap="round"/>
    </g>`
  },
  {
    id: 'party', name: '星空舞會',
    svg: () => {
      let stars = '';
      const spots = [[40, 60], [90, 130], [140, 50], [230, 90], [290, 150], [330, 50], [30, 200], [320, 230], [60, 300], [300, 330]];
      spots.forEach((p, i) => {
        if (i % 2) stars += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff" opacity=".9"/>`;
        else stars += `<path d="M${p[0]} ${p[1] - 7} L${p[0] + 2} ${p[1] - 2} L${p[0] + 7} ${p[1]} L${p[0] + 2} ${p[1] + 2} L${p[0]} ${p[1] + 7} L${p[0] - 2} ${p[1] + 2} L${p[0] - 7} ${p[1]} L${p[0] - 2} ${p[1] - 2} Z" fill="#ffe9a8"/>`;
      });
      return `
      <defs><linearGradient id="skyParty" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2c2960"/><stop offset="1" stop-color="#5a4a9e"/>
      </linearGradient></defs>
      <rect width="360" height="520" fill="url(#skyParty)"/>
      ${stars}
      <circle cx="300" cy="76" r="30" fill="#ffeaa0"/>
      <circle cx="290" cy="68" r="5" fill="#f5d97e" opacity=".8"/>
      <circle cx="308" cy="86" r="7" fill="#f5d97e" opacity=".8"/>
      <path d="M0 30 Q90 74 180 34 Q270 74 360 30" stroke="#7c6cc4" stroke-width="3" fill="none"/>
      <circle cx="45" cy="52" r="5" fill="#ff8fb8"/><circle cx="110" cy="62" r="5" fill="#ffd670"/>
      <circle cx="180" cy="48" r="5" fill="#8fdcb8"/><circle cx="250" cy="62" r="5" fill="#7fc4f2"/>
      <circle cx="315" cy="52" r="5" fill="#ff8fb8"/>
      <path d="M0 442 Q180 414 360 442 L360 520 L0 520 Z" fill="#453a85"/>
      <circle cx="80" cy="470" r="3" fill="#fff" opacity=".5"/>
      <circle cx="280" cy="480" r="3" fill="#fff" opacity=".5"/>
      <circle cx="180" cy="500" r="3" fill="#fff" opacity=".5"/>`;
    }
  },
  {
    id: 'rainbow', name: '彩虹樂園',
    svg: () => {
      const cols = ['#ff8fa3', '#ffc48a', '#fff3a0', '#a8e6a3', '#9ad0f5', '#c9a8f5'];
      let arcs = '';
      cols.forEach((c, i) => {
        const r = 210 - i * 13;
        arcs += `<path d="M ${180 - r} 330 A ${r} ${r} 0 0 1 ${180 + r} 330" stroke="${c}" stroke-width="13" fill="none"/>`;
      });
      return `
      <defs><linearGradient id="skyRainbow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d2eeff"/><stop offset="1" stop-color="#f2fbff"/>
      </linearGradient></defs>
      <rect width="360" height="520" fill="url(#skyRainbow)"/>
      <circle cx="60" cy="58" r="26" fill="#ffe08a"/>
      ${arcs}
      ${cloud(6, 330, 1.2)}${cloud(354, 330, 1.2)}
      ${cloud(300, 90, .8)}
      ${heart(40, 220, 1.5, '#ffb0c8')}${heart(322, 180, 1.3, '#ffb0c8')}
      <path d="M0 452 Q180 426 360 452 L360 520 L0 520 Z" fill="#c3ecb2"/>`;
    }
  }
];

/* ---------- 狀態 ---------- */
const SAVE_KEY = 'princess-closet-v1';
const DEFAULT_STATE = {
  hair: 'long', hairColor: '#6e4a2f',
  dress: 'gown', dressColor: '#ff8fc0',
  shoes: 'flats', shoeColor: '#ff8fc0',
  accs: ['crown'], bg: 'castle'
};
let state = loadState();
let curTab = 'dress';
let muted = localStorage.getItem(SAVE_KEY + ':muted') === '1';

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.hair) return Object.assign({}, DEFAULT_STATE, s);
  } catch (e) { /* 壞檔就重來 */ }
  return Object.assign({}, DEFAULT_STATE);
}
function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }

/* ---------- 畫面組裝 ---------- */
function charSVG() {
  const hair = HAIRS.find(h => h.id === state.hair);
  const dress = DRESSES.find(d => d.id === state.dress);
  const shoes = SHOES.find(s => s.id === state.shoes);
  const accBack = ACCS.filter(a => state.accs.includes(a.id) && a.back).map(a => a.svg()).join('');
  const accFront = ACCS.filter(a => state.accs.includes(a.id) && !a.back).map(a => a.svg()).join('');
  return accBack + hair.back(state.hairColor) + body() + face() +
    dress.svg(state.dressColor) + shoes.svg(state.shoeColor) +
    hair.front(state.hairColor) + accFront;
}
function renderScene() {
  const bg = BGS.find(b => b.id === state.bg);
  $('#scene').innerHTML = bg.svg() + charSVG();
}

/* ---------- 面板 ---------- */
const TABS = [
  { id: 'hair', label: '髮型', em: '💇‍♀️' },
  { id: 'dress', label: '洋裝', em: '👗' },
  { id: 'shoes', label: '鞋鞋', em: '🥿' },
  { id: 'acc', label: '配件', em: '👑' },
  { id: 'bg', label: '場景', em: '🏰' }
];
function renderTabs() {
  $('#tabs').innerHTML = TABS.map(t =>
    `<button data-tab="${t.id}" class="${t.id === curTab ? 'on' : ''}"><span class="em">${t.em}</span>${t.label}</button>`
  ).join('');
}
function renderSwatches() {
  const box = $('#swatches');
  let colors = null, key = null;
  if (curTab === 'hair') { colors = HAIR_COLORS; key = 'hairColor'; }
  if (curTab === 'dress') { colors = DRESS_COLORS; key = 'dressColor'; }
  if (curTab === 'shoes') { colors = DRESS_COLORS; key = 'shoeColor'; }
  if (!colors) { box.innerHTML = ''; box.style.display = 'none'; return; }
  box.style.display = 'flex';
  box.innerHTML = colors.map(c =>
    `<button data-color="${c}" class="${state[key] === c ? 'on' : ''}" style="background:${c}"></button>`
  ).join('');
}
function preview(item, cat) {
  if (cat === 'hair') {
    const c = state.hairColor;
    return `<svg viewBox="15 0 330 340">${item.back(c)}<ellipse cx="180" cy="140" rx="90" ry="85" fill="${SKIN}"/>${item.front(c)}</svg>`;
  }
  if (cat === 'dress') return `<svg viewBox="85 225 190 200">${item.svg(state.dressColor)}</svg>`;
  if (cat === 'shoes') return `<svg viewBox="138 400 88 78">${item.svg(state.shoeColor)}</svg>`;
  if (cat === 'acc') return `<svg viewBox="${item.vb}">${item.svg()}</svg>`;
  return `<svg viewBox="0 0 360 520">${item.svg()}</svg>`;
}
function renderItems() {
  const box = $('#items');
  let list, isOn;
  if (curTab === 'hair') { list = HAIRS; isOn = i => state.hair === i.id; }
  else if (curTab === 'dress') { list = DRESSES; isOn = i => state.dress === i.id; }
  else if (curTab === 'shoes') { list = SHOES; isOn = i => state.shoes === i.id; }
  else if (curTab === 'acc') { list = ACCS; isOn = i => state.accs.includes(i.id); }
  else { list = BGS; isOn = i => state.bg === i.id; }
  box.innerHTML = list.map(i =>
    `<button data-item="${i.id}" class="${isOn(i) ? 'on' : ''}">${preview(i, curTab)}<div class="nm">${i.name}</div></button>`
  ).join('');
}
function renderPanel() { renderTabs(); renderSwatches(); renderItems(); }

/* ---------- 音效 ---------- */
let actx = null;
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq1, freq2, dur, delay = 0, vol = .15) {
  if (muted) return;
  try {
    const ctx = audio();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq1, t);
    o.frequency.exponentialRampToValueAtTime(freq2, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur);
  } catch (e) { /* 沒音效也沒關係 */ }
}
function pop() { tone(520, 900, .12); }
function chime() { tone(660, 660, .15); tone(830, 830, .15, .12); tone(990, 990, .25, .24); }

/* ---------- 星星特效 ---------- */
const SPARK_EMOJI = ['✨', '💖', '⭐', '🌟', '💫'];
function burst(n = 8) {
  const box = $('#sparkles');
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = SPARK_EMOJI[Math.floor(Math.random() * SPARK_EMOJI.length)];
    s.style.left = (10 + Math.random() * 80) + '%';
    s.style.top = (15 + Math.random() * 65) + '%';
    s.style.animationDelay = (Math.random() * .25) + 's';
    box.appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }
}

/* ---------- 互動 ---------- */
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-tab]');
  if (!b) return;
  curTab = b.dataset.tab;
  renderPanel();
  pop();
});
$('#swatches').addEventListener('click', e => {
  const b = e.target.closest('button[data-color]');
  if (!b) return;
  const key = curTab === 'hair' ? 'hairColor' : curTab === 'dress' ? 'dressColor' : 'shoeColor';
  state[key] = b.dataset.color;
  saveState(); renderScene(); renderSwatches(); renderItems();
  burst(5); pop();
});
$('#items').addEventListener('click', e => {
  const b = e.target.closest('button[data-item]');
  if (!b) return;
  const id = b.dataset.item;
  if (curTab === 'hair') state.hair = id;
  else if (curTab === 'dress') state.dress = id;
  else if (curTab === 'shoes') state.shoes = id;
  else if (curTab === 'bg') state.bg = id;
  else {
    const i = state.accs.indexOf(id);
    if (i >= 0) state.accs.splice(i, 1); else state.accs.push(id);
  }
  saveState(); renderScene(); renderItems();
  burst(); pop();
});
$('#btn-random').addEventListener('click', () => {
  const pick = a => a[Math.floor(Math.random() * a.length)];
  state.hair = pick(HAIRS).id;
  state.hairColor = pick(HAIR_COLORS);
  state.dress = pick(DRESSES).id;
  state.dressColor = pick(DRESS_COLORS);
  state.shoes = pick(SHOES).id;
  state.shoeColor = pick(DRESS_COLORS);
  state.bg = pick(BGS).id;
  state.accs = ACCS.filter(() => Math.random() < .4).map(a => a.id);
  saveState(); renderScene(); renderPanel();
  burst(14); chime();
});
$('#btn-photo').addEventListener('click', () => {
  const bg = BGS.find(b => b.id === state.bg);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 520" width="720" height="1040">${bg.svg()}${charSVG()}</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement('canvas');
    cv.width = 720; cv.height = 1040;
    cv.getContext('2d').drawImage(img, 0, 0, 720, 1040);
    URL.revokeObjectURL(url);
    cv.toBlob(b => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = '小公主造型.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    }, 'image/png');
  };
  img.src = url;
  burst(10); chime();
});
$('#btn-sound').addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(SAVE_KEY + ':muted', muted ? '1' : '0');
  $('#btn-sound').textContent = muted ? '🔇' : '🔊';
  if (!muted) pop();
});

/* ---------- 啟動 ---------- */
$('#btn-sound').textContent = muted ? '🔇' : '🔊';
renderScene();
renderPanel();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
