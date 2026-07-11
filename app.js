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
function dropShadow(cx, cy, rx, ry, op = .16) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3a2a4a" opacity="${op}"/>`;
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
function face(mode) {
  let eyes, mouth;
  if (mode === 'sleep') {
    eyes = `<path d="M135 150 Q147 160 159 150" stroke="#463a44" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M201 150 Q213 160 225 150" stroke="#463a44" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    mouth = `<ellipse cx="180" cy="192" rx="6" ry="7" fill="#d96a7e"/>`;
  } else if (mode === 'eat') {
    eyes = `<path d="M135 150 Q147 142 159 150" stroke="#463a44" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M201 150 Q213 142 225 150" stroke="#463a44" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    mouth = `<ellipse cx="180" cy="193" rx="10" ry="9" fill="#8a4a54"/><ellipse cx="180" cy="196" rx="6.5" ry="4.5" fill="#e8879a"/>`;
  } else {
    eyes = `<ellipse cx="147" cy="153" rx="12" ry="15" fill="#463a44"/>
  <ellipse cx="213" cy="153" rx="12" ry="15" fill="#463a44"/>
  <circle cx="151" cy="147" r="4.5" fill="#fff"/>
  <circle cx="217" cy="147" r="4.5" fill="#fff"/>
  <circle cx="143" cy="159" r="2" fill="#fff" opacity=".85"/>
  <circle cx="209" cy="159" r="2" fill="#fff" opacity=".85"/>
  <path d="M131 145 L123 140" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M133 154 L124 152" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M229 145 L237 140" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>
  <path d="M227 154 L236 152" stroke="#463a44" stroke-width="3" stroke-linecap="round"/>`;
    mouth = `<path d="M167 189 Q180 205 193 189 Q186 195 180 195 Q174 195 167 189 Z" fill="#d96a7e"/>`;
  }
  return `
  <path d="M136 127 Q147 120 158 126" stroke="#c99a76" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M202 126 Q213 120 224 127" stroke="#c99a76" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${eyes}
  <ellipse cx="118" cy="180" rx="13" ry="8" fill="#ffb3c4" opacity=".7"/>
  <ellipse cx="242" cy="180" rx="13" ry="8" fill="#ffb3c4" opacity=".7"/>
  <circle cx="180" cy="172" r="2.5" fill="#f0b294"/>
  ${mouth}`;
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
  },
  {
    id: 'braid', name: '公主編髮', price: 12,
    back: c => {
      const d = shade(c, .78);
      return `<path d="M92 140 Q64 44 180 40 Q296 44 268 140 L284 308 Q290 350 254 356 L106 356 Q70 350 76 308 Z" fill="${c}"/>
      <path d="M150 170 L166 178 M146 200 L164 208 M144 230 L162 238 M142 260 L160 268 M140 290 L158 298 M140 320 L156 326" stroke="${d}" stroke-width="3" opacity=".55" stroke-linecap="round"/>
      <path d="M210 170 L194 178 M214 200 L196 208 M216 230 L198 238 M218 260 L200 268 M220 290 L202 298 M220 320 L204 326" stroke="${d}" stroke-width="3" opacity=".55" stroke-linecap="round"/>
      <circle cx="180" cy="330" r="9" fill="#ff7fb2"/>
      <path d="M180 330 Q170 322 164 330 Q170 338 180 330 Z M180 330 Q190 322 196 330 Q190 338 180 330 Z" fill="#ff9ec7"/>`;
    },
    front: c => bangs(c)
  },
  {
    id: 'buns', name: '泡泡雙丸子', price: 16,
    back: c => `<circle cx="122" cy="76" r="26" fill="${c}"/><circle cx="238" cy="76" r="26" fill="${c}"/>
      <path d="M122 100 Q116 130 108 152" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M238 100 Q244 130 252 152" stroke="${c}" stroke-width="18" fill="none" stroke-linecap="round"/>`,
    front: c => bangs(c) + `<rect x="106" y="92" width="32" height="9" rx="4.5" fill="#ff7fb2"/><rect x="222" y="92" width="32" height="9" rx="4.5" fill="#ff7fb2"/>`
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
  },
  {
    id: 'mermaid', name: '人魚尾裙', hideShoes: true,
    svg: c => {
      const d = shade(c, .72);
      let scales = '';
      [[330, 34], [352, 30], [374, 24]].forEach(row => {
        const [y, half] = row;
        for (let x = 180 - half; x < 180 + half; x += 12) {
          scales += `<path d="M${x} ${y} Q${x + 6} ${y + 8} ${x + 12} ${y}" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>`;
        }
      });
      return `
      <path d="M148 238 Q180 252 212 238 L216 306 L144 306 Z" fill="${c}"/>
      <path d="M146 300 Q180 290 214 300 Q224 370 192 420 Q184 448 190 464 L170 464 Q176 448 168 420 Q136 370 146 300 Z" fill="${c}"/>
      <path d="M146 300 Q180 290 214 300 L214 314 Q180 304 146 314 Z" fill="${d}"/>
      <path d="M180 456 Q146 466 134 498 Q166 494 180 478 Q194 494 226 498 Q214 466 180 456 Z" fill="${d}"/>
      ${scales}
      <circle cx="164" cy="266" r="3" fill="#fff" opacity=".85"/>
      <circle cx="196" cy="280" r="3" fill="#fff" opacity=".85"/>
      <circle cx="182" cy="398" r="3.5" fill="#fff" opacity=".7"/>`;
    }
  },
  {
    id: 'stardress', name: '星星洋裝', price: 10,
    svg: c => {
      const d = shade(c, .78);
      return `
      <circle cx="146" cy="250" r="13" fill="${c}"/><circle cx="214" cy="250" r="13" fill="${c}"/>
      <path d="M150 238 L210 238 L236 382 Q180 396 124 382 Z" fill="${c}"/>
      <path d="M126 370 Q180 384 234 370 L236 382 Q180 396 124 382 Z" fill="${d}"/>
      <polygon points="${star(160, 300, 9, 4)}" fill="#fff" opacity=".95"/>
      <polygon points="${star(202, 330, 7, 3)}" fill="#fff" opacity=".95"/>
      <polygon points="${star(170, 356, 8, 3.5)}" fill="#fff" opacity=".95"/>
      <polygon points="${star(206, 282, 5, 2.2)}" fill="#fff" opacity=".8"/>
      <polygon points="${star(142, 336, 5, 2.2)}" fill="#fff" opacity=".8"/>
      <circle cx="180" cy="252" r="5" fill="#ffd23e"/>`;
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
  },
  {
    id: 'shell', name: '貝殼項鍊', vb: '156 242 48 46',
    svg: () => `
      <path d="M158 246 Q180 262 202 246" stroke="#e8c9a0" stroke-width="2.5" fill="none"/>
      <path d="M170 260 Q180 253 190 260 L193 272 Q180 284 167 272 Z" fill="#ffdba8" stroke="#e8b06e" stroke-width="2" stroke-linejoin="round"/>
      <path d="M180 256 L180 281 M173 258 L170 274 M187 258 L190 274" stroke="#e8b06e" stroke-width="1.5" fill="none"/>`
  },
  {
    id: 'starfish', name: '海星髮飾', vb: '222 70 46 46',
    svg: () => `
      <polygon points="${star(244, 92, 17, 8)}" fill="#ff8fb8" stroke="#f26a9a" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="244" cy="88" r="2" fill="#fff" opacity=".9"/>
      <circle cx="238" cy="96" r="2" fill="#fff" opacity=".9"/>
      <circle cx="250" cy="96" r="2" fill="#fff" opacity=".9"/>`
  },
  {
    id: 'catears', name: '貓耳髮箍', price: 15, vb: '100 24 160 76',
    svg: () => `
      <path d="M108 92 Q180 34 252 92" stroke="#ff8fb8" stroke-width="7" fill="none"/>
      <path d="M118 74 L112 40 L146 56 Z" fill="#ff8fb8"/>
      <path d="M242 74 L248 40 L214 56 Z" fill="#ff8fb8"/>
      <path d="M122 66 L119 48 L137 57 Z" fill="#ffd9ec"/>
      <path d="M238 66 L241 48 L223 57 Z" fill="#ffd9ec"/>`
  },
  {
    id: 'bag', name: '小提包', price: 20, vb: '76 292 76 96',
    svg: () => `
      <path d="M98 314 Q112 288 126 314" stroke="#e078a8" stroke-width="5" fill="none"/>
      <rect x="86" y="312" width="52" height="44" rx="12" fill="#ff8fb8"/>
      <rect x="86" y="312" width="52" height="16" rx="8" fill="#e078a8"/>
      ${heart(112, 340, 1.3, '#ffffff')}`
  },
  {
    id: 'parasol', name: '蕾絲陽傘', price: 16, vb: '210 195 100 120',
    svg: () => `<g transform="rotate(15 260 250)">
      <line x1="260" y1="250" x2="260" y2="308" stroke="#d4af6a" stroke-width="4"/>
      <path d="M215 250 Q260 202 305 250 Q290 240 275 250 Q260 240 245 250 Q230 240 215 250 Z" fill="#fff" stroke="#e8d0e8" stroke-width="2"/>
      <circle cx="260" cy="248" r="4" fill="#d4af6a"/>
    </g>`
  },
  {
    id: 'rainbowclip', name: '彩虹髮夾', gacha: true, weight: 3, rare: false, vb: '78 30 100 70',
    svg: () => `<g transform="rotate(-10 128 62)">
      <path d="M98 62 Q128 44 158 62" stroke="#ff8fa3" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M100 68 Q128 52 156 68" stroke="#ffc48a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M102 74 Q128 60 154 74" stroke="#fff3a0" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="128" cy="58" r="6" fill="#fff"/>
    </g>`
  },
  {
    id: 'bowearrings', name: '蝴蝶結耳環', gacha: true, weight: 3, rare: false, vb: '120 130 120 60',
    svg: () => `<g>
      <path d="M138 150 Q132 144 126 150 Q132 156 138 150 Z M138 150 Q144 144 150 150 Q144 156 138 150 Z" fill="#ff9ec7"/>
      <circle cx="138" cy="150" r="3" fill="#e0447e"/>
      <path d="M222 150 Q216 144 210 150 Q216 156 222 150 Z M222 150 Q228 144 234 150 Q228 156 222 150 Z" fill="#ff9ec7"/>
      <circle cx="222" cy="150" r="3" fill="#e0447e"/>
    </g>`
  },
  {
    id: 'scarf', name: '彩色圍巾', gacha: true, weight: 3, rare: false, vb: '145 232 90 70',
    svg: () => `<g>
      <path d="M150 240 Q180 254 210 240 L206 258 Q180 270 154 258 Z" fill="#7fc4f2"/>
      <path d="M170 258 L166 296 L182 292 L178 258 Z" fill="#ffd670"/>
      <circle cx="170" cy="292" r="4" fill="#ff8fc0"/><circle cx="178" cy="298" r="4" fill="#8fdcb8"/>
    </g>`
  },
  {
    id: 'diamondcrown', name: '鑽石皇冠', gacha: true, weight: 1, rare: true, vb: '178 0 110 85',
    svg: () => `<g transform="rotate(14 232 42)">
      <path d="M195 64 L203 20 L219 42 L232 12 L245 42 L261 20 L269 64 Z" fill="#bfe8ff" stroke="#8fd0f0" stroke-width="3" stroke-linejoin="round"/>
      <rect x="193" y="60" width="78" height="10" rx="5" fill="#8fd0f0"/>
      <circle cx="232" cy="16" r="5" fill="#fff" stroke="#8fd0f0" stroke-width="2"/>
      <circle cx="203" cy="24" r="4" fill="#fff" stroke="#8fd0f0" stroke-width="1.5"/>
      <circle cx="261" cy="24" r="4" fill="#fff" stroke="#8fd0f0" stroke-width="1.5"/>
      <path d="M215 40 L220 46 L228 32" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    </g>`
  },
  {
    id: 'unicornhorn', name: '獨角獸角', gacha: true, weight: 1, rare: true, vb: '110 20 150 80',
    svg: () => `<g>
      <path d="M120 90 Q180 40 240 90" stroke="#fff" stroke-width="7" fill="none"/>
      <path d="M178 46 L172 8 L188 46 Z" fill="#ffe9a8" stroke="#f0c060" stroke-width="2" stroke-linejoin="round"/>
      <path d="M175 40 L181 40 M174 32 L182 32 M173 24 L183 24" stroke="#f0c060" stroke-width="1.5"/>
      <circle cx="128" cy="72" r="9" fill="#ffb3c4"/><circle cx="232" cy="72" r="9" fill="#bfe0ff"/>
    </g>`
  }
];

/* ---------- 寵物 ---------- */
const PETS = [
  { id: 'none', name: '沒有', svg: () => '' },
  {
    id: 'cat', name: '小貓咪',
    svg: () => `<g>
      <path d="M326 450 Q348 442 344 418" stroke="#f7c98e" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="304" cy="450" rx="21" ry="16" fill="#f7c98e"/>
      <path d="M290 400 L285 384 L300 392 Z" fill="#f7c98e"/>
      <path d="M318 400 L323 384 L308 392 Z" fill="#f7c98e"/>
      <path d="M291 396 L288 388 L296 392 Z" fill="#ffb3c4"/>
      <path d="M317 396 L320 388 L312 392 Z" fill="#ffb3c4"/>
      <circle cx="304" cy="414" r="19" fill="#f7c98e"/>
      <path d="M295 412 Q298 408 301 412" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M307 412 Q310 408 313 412" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M302 419 L306 419 L304 422 Z" fill="#e0707e"/>
      <path d="M304 422 Q301 426 298 424 M304 422 Q307 426 310 424" stroke="#5a4636" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M284 416 L274 414 M284 420 L275 422 M324 416 L334 414 M324 420 L333 422" stroke="#5a4636" stroke-width="1.5" stroke-linecap="round"/>
      <ellipse cx="290" cy="428" rx="5" ry="3" fill="#ffb3c4" opacity=".7"/>
      <ellipse cx="318" cy="428" rx="5" ry="3" fill="#ffb3c4" opacity=".7"/>
      <ellipse cx="296" cy="462" rx="6" ry="4" fill="#fce3bd"/>
      <ellipse cx="312" cy="462" rx="6" ry="4" fill="#fce3bd"/>
    </g>`
  },
  {
    id: 'bunny', name: '小兔兔',
    svg: () => `<g>
      <ellipse cx="298" cy="384" rx="6.5" ry="20" fill="#fff"/>
      <ellipse cx="316" cy="384" rx="6.5" ry="20" fill="#fff"/>
      <ellipse cx="298" cy="386" rx="3" ry="14" fill="#ffc7dd"/>
      <ellipse cx="316" cy="386" rx="3" ry="14" fill="#ffc7dd"/>
      <ellipse cx="307" cy="452" rx="20" ry="15" fill="#fff"/>
      <circle cx="307" cy="418" r="18" fill="#fff"/>
      <path d="M299 416 Q302 412 305 416" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M309 416 Q312 412 315 416" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M305 422 L309 422 L307 425 Z" fill="#ff8fb8"/>
      <ellipse cx="294" cy="428" rx="5" ry="3" fill="#ffc7dd" opacity=".8"/>
      <ellipse cx="320" cy="428" rx="5" ry="3" fill="#ffc7dd" opacity=".8"/>
      <ellipse cx="299" cy="463" rx="6" ry="4" fill="#fff"/>
      <ellipse cx="315" cy="463" rx="6" ry="4" fill="#fff"/>
      <circle cx="326" cy="450" r="7" fill="#fff"/>
    </g>`
  },
  {
    id: 'puppy', name: '小狗狗', price: 18,
    svg: () => `<g>
      <path d="M326 452 Q346 446 342 424" stroke="#d9a066" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="304" cy="452" rx="21" ry="16" fill="#e8b47a"/>
      <ellipse cx="286" cy="404" rx="10" ry="18" fill="#c98a4a" transform="rotate(-20 286 404)"/>
      <ellipse cx="322" cy="404" rx="10" ry="18" fill="#c98a4a" transform="rotate(20 322 404)"/>
      <circle cx="304" cy="416" r="19" fill="#e8b47a"/>
      <path d="M295 414 Q298 410 301 414" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M307 414 Q310 410 313 414" stroke="#5a4636" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="304" cy="424" rx="6" ry="4.5" fill="#463a44"/>
      <path d="M304 428 Q300 433 296 430 M304 428 Q308 433 312 430" stroke="#5a4636" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="290" cy="428" rx="5" ry="3" fill="#ffb3c4" opacity=".7"/>
      <ellipse cx="318" cy="428" rx="5" ry="3" fill="#ffb3c4" opacity=".7"/>
      <ellipse cx="296" cy="462" rx="6" ry="4" fill="#f0c78e"/>
      <ellipse cx="312" cy="462" rx="6" ry="4" fill="#f0c78e"/>
    </g>`
  },
  {
    id: 'panda', name: '小熊貓', price: 22,
    svg: () => `<g>
      <ellipse cx="304" cy="452" rx="22" ry="16" fill="#fff"/>
      <circle cx="288" cy="400" r="10" fill="#2c2c2c"/><circle cx="320" cy="400" r="10" fill="#2c2c2c"/>
      <circle cx="304" cy="416" r="19" fill="#fff"/>
      <ellipse cx="296" cy="412" rx="7" ry="9" fill="#2c2c2c" transform="rotate(-10 296 412)"/>
      <ellipse cx="312" cy="412" rx="7" ry="9" fill="#2c2c2c" transform="rotate(10 312 412)"/>
      <circle cx="296" cy="413" r="2.3" fill="#fff"/><circle cx="312" cy="413" r="2.3" fill="#fff"/>
      <ellipse cx="304" cy="424" rx="5" ry="4" fill="#2c2c2c"/>
      <path d="M304 428 Q300 432 297 430 M304 428 Q308 432 311 430" stroke="#2c2c2c" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="296" cy="462" rx="6" ry="4" fill="#f0f0f0"/>
      <ellipse cx="312" cy="462" rx="6" ry="4" fill="#f0f0f0"/>
    </g>`
  }
];

/* ---------- 餐廳菜單 ---------- */
const FOODS = [
  {
    id: 'cake', name: '草莓蛋糕', price: 6,
    svg: () => `
      <ellipse cx="50" cy="78" rx="30" ry="7" fill="#e8b6d0" opacity=".6"/>
      <path d="M24 74 L50 24 L76 74 Z" fill="#fff6ea"/>
      <path d="M24 74 L76 74 L76 66 L24 66 Z" fill="#ff9ec7"/>
      <path d="M31 66 L46 40 L61 66 Z" fill="#ffd9ec" opacity=".8"/>
      <path d="M24 74 Q50 82 76 74 L76 78 Q50 86 24 78 Z" fill="#e878a4"/>
      <circle cx="50" cy="30" r="7" fill="#e0384f"/>
      <circle cx="47" cy="27" r="2.5" fill="#fff" opacity=".8"/>
      <circle cx="36" cy="58" r="2.5" fill="#fff" opacity=".9"/>
      <circle cx="58" cy="52" r="2.5" fill="#fff" opacity=".9"/>`
  },
  {
    id: 'icecream', name: '冰淇淋', price: 5,
    svg: () => `
      <ellipse cx="50" cy="90" rx="16" ry="5" fill="#e8b6d0" opacity=".5"/>
      <path d="M38 60 L62 60 L52 92 Q50 96 48 92 Z" fill="#f0c896"/>
      <path d="M40 62 L60 62 M42 70 L58 70 M44 78 L56 78" stroke="#d4a875" stroke-width="1.6"/>
      <circle cx="50" cy="48" r="20" fill="#ffd6e8"/>
      <circle cx="38" cy="40" r="15" fill="#fff6ea"/>
      <circle cx="62" cy="40" r="15" fill="#ffb3c4"/>
      <circle cx="50" cy="26" r="5" fill="#e0384f"/>`
  },
  {
    id: 'donut', name: '甜甜圈', price: 4,
    svg: () => `
      <circle cx="50" cy="52" r="30" fill="#e8a05a"/>
      <circle cx="50" cy="52" r="26" fill="#ffb3c4"/>
      <circle cx="50" cy="52" r="9" fill="#fff6ea"/>
      <circle cx="38" cy="38" r="3" fill="#7fc4f2"/><circle cx="62" cy="38" r="3" fill="#ffd23e"/>
      <circle cx="66" cy="52" r="3" fill="#8fdcb8"/><circle cx="34" cy="60" r="3" fill="#ff8fc0"/>
      <circle cx="50" cy="76" r="3" fill="#bf94ea"/><circle cx="60" cy="68" r="3" fill="#7fc4f2"/>`
  },
  {
    id: 'bubbletea', name: '珍珠奶茶', price: 4,
    svg: () => `
      <path d="M32 40 L68 40 L60 92 Q50 98 40 92 Z" fill="#fff6ea" opacity=".9"/>
      <path d="M34 55 L66 55 L60 92 Q50 98 40 92 Z" fill="#d9a066"/>
      <circle cx="42" cy="82" r="3" fill="#3a2a20"/><circle cx="50" cy="86" r="3" fill="#3a2a20"/><circle cx="58" cy="82" r="3" fill="#3a2a20"/>
      <circle cx="46" cy="76" r="3" fill="#3a2a20"/><circle cx="54" cy="76" r="3" fill="#3a2a20"/>
      <rect x="30" y="36" width="40" height="8" rx="3" fill="#ffb3c4"/>
      <rect x="47" y="12" width="6" height="30" rx="3" fill="#ff8fb8"/>`
  },
  {
    id: 'chips', name: '洋芋片', price: 3,
    svg: () => `
      <path d="M28 30 Q50 20 72 30 L66 88 Q50 96 34 88 Z" fill="#ffd23e"/>
      <path d="M28 30 Q50 20 72 30 L70 40 Q50 30 30 40 Z" fill="#ff9ec7"/>
      <path d="M34 88 Q50 96 66 88" stroke="#e0a010" stroke-width="2" fill="none"/>
      <circle cx="50" cy="58" r="12" fill="#fff" opacity=".85"/>
      <path d="M44 54 Q50 50 56 54 Q56 60 50 64 Q44 60 44 54 Z" fill="#e8a05a"/>`
  },
  {
    id: 'popsicle', name: '冰棒', price: 3,
    svg: () => `
      <rect x="46" y="70" width="8" height="26" rx="3" fill="#e8b6d0"/>
      <path d="M30 30 Q50 18 70 30 L66 74 Q50 82 34 74 Z" fill="#ff8fb8"/>
      <path d="M30 30 Q50 18 70 30 L68 40 Q50 28 32 40 Z" fill="#fff" opacity=".5"/>
      <circle cx="42" cy="48" r="3" fill="#fff" opacity=".6"/>
      <circle cx="58" cy="56" r="3" fill="#fff" opacity=".6"/>`
  }
];

/* ---------- 房間主題 ---------- */
const ROOMS = [
  { id: 'pink', name: '粉紅甜心房', price: 0, wall: '#fff3f8', floor: '#e8bd8a', curtain: '#ff9ec7', wardrobe: '#f6bcd8', bed: '#f0b4d0', pillow: '#ff9ec7', rug: '#ffd9ec' },
  { id: 'mint', name: '森林小屋房', price: 15, wall: '#eefaf0', floor: '#c9dfc0', curtain: '#7ec86a', wardrobe: '#a8dda0', bed: '#8fd0a0', pillow: '#6fc482', rug: '#cdeecf' },
  { id: 'sky', name: '海洋泡泡房', price: 18, wall: '#e6f5fc', floor: '#bcd8e6', curtain: '#5fb0e0', wardrobe: '#8fcdf0', bed: '#6fb8e8', pillow: '#4a9edb', rug: '#cdeaf7' },
  { id: 'lavender', name: '星空夢幻房', price: 20, wall: '#f2ecfb', floor: '#cdbfe8', curtain: '#a688e0', wardrobe: '#c9aef0', bed: '#b090e6', pillow: '#9670d8', rug: '#e2d4f7' }
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
  },
  {
    id: 'sea', name: '海底世界',
    svg: () => {
      let bubbles = '';
      [[40, 90, 7], [60, 150, 4], [320, 70, 8], [300, 130, 5], [335, 200, 4], [30, 280, 5], [330, 320, 6], [50, 380, 4]].forEach(b => {
        bubbles += `<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>
        <circle cx="${b[0] - b[2] / 3}" cy="${b[1] - b[2] / 3}" r="${b[2] / 4}" fill="#fff" opacity=".6"/>`;
      });
      const fish = (x, y, c, flip) => `<g transform="translate(${x} ${y})${flip ? ' scale(-1,1)' : ''}">
        <ellipse cx="0" cy="0" rx="11" ry="7" fill="${c}"/>
        <path d="M-9 0 L-18 -7 L-18 7 Z" fill="${c}"/>
        <circle cx="5" cy="-1.5" r="1.8" fill="#463a44"/>
        <path d="M2 3 Q4 5 7 3" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7"/>
      </g>`;
      return `
      <defs><linearGradient id="skySea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8fd8f2"/><stop offset="1" stop-color="#3a8fd0"/>
      </linearGradient></defs>
      <rect width="360" height="520" fill="url(#skySea)"/>
      <polygon points="60,0 105,0 170,240 100,240" fill="#fff" opacity=".08"/>
      <polygon points="230,0 265,0 330,220 270,220" fill="#fff" opacity=".08"/>
      ${bubbles}
      ${fish(66, 190, '#ffd670', false)}
      ${fish(296, 150, '#ff9ec7', true)}
      ${fish(44, 330, '#8fdcb8', true)}
      <path d="M0 448 Q180 424 360 448 L360 520 L0 520 Z" fill="#f2ddb0"/>
      <path d="M22 470 Q8 430 24 396 Q36 372 26 344" stroke="#4db38a" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M44 478 Q34 444 46 416" stroke="#63c49b" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M338 472 Q352 434 336 400 Q326 378 336 352" stroke="#4db38a" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M316 480 Q326 450 314 424" stroke="#63c49b" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M300 478 Q300 452 322 452 Q344 452 344 478 Z" fill="#ff9d76"/>
      <circle cx="312" cy="462" r="2.5" fill="#fff" opacity=".8"/>
      <circle cx="326" cy="466" r="2.5" fill="#fff" opacity=".8"/>
      <circle cx="332" cy="458" r="2.5" fill="#fff" opacity=".8"/>
      <path d="M60 486 Q66 478 72 486 L70 492 Q66 495 62 492 Z" fill="#ffdba8" stroke="#e8b06e" stroke-width="1.5"/>
      ${heart(180, 30, 1.2, '#ffffff44')}`;
    }
  }
];

/* ---------- 狀態 ---------- */
const SAVE_KEY = 'princess-closet-v1';
const DEFAULT_STATE = {
  hair: 'long', hairColor: '#6e4a2f',
  dress: 'gown', dressColor: '#ff8fc0',
  shoes: 'flats', shoeColor: '#ff8fc0',
  accs: ['crown'], bg: 'castle', pet: 'none',
  coins: 30, owned: [],
  room: 'pink', ownedRooms: ['pink']
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
function charSVG(mode) {
  const hair = HAIRS.find(h => h.id === state.hair);
  const dress = DRESSES.find(d => d.id === state.dress);
  const shoes = SHOES.find(s => s.id === state.shoes);
  const pet = PETS.find(p => p.id === state.pet) || PETS[0];
  const accBack = ACCS.filter(a => state.accs.includes(a.id) && a.back).map(a => a.svg()).join('');
  const accFront = ACCS.filter(a => state.accs.includes(a.id) && !a.back).map(a => a.svg()).join('');
  return accBack + hair.back(state.hairColor) + body() + face(mode) +
    dress.svg(state.dressColor) + (dress.hideShoes ? '' : shoes.svg(state.shoeColor)) +
    hair.front(state.hairColor) + accFront + pet.svg();
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
  { id: 'pet', label: '寵物', em: '🐱' },
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
  if (cat === 'dress') return `<svg viewBox="85 225 190 ${item.hideShoes ? 280 : 200}">${item.svg(state.dressColor)}</svg>`;
  if (cat === 'shoes') return `<svg viewBox="138 400 88 78">${item.svg(state.shoeColor)}</svg>`;
  if (cat === 'acc') return `<svg viewBox="${item.vb}">${item.svg()}</svg>`;
  if (cat === 'pet') return item.id === 'none'
    ? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke="#e0b0c8" stroke-width="6"/><line x1="30" y1="70" x2="70" y2="30" stroke="#e0b0c8" stroke-width="6" stroke-linecap="round"/></svg>`
    : `<svg viewBox="268 372 78 102">${item.svg()}</svg>`;
  return `<svg viewBox="0 0 360 520">${item.svg()}</svg>`;
}
function renderItems() {
  const box = $('#items');
  let list, isOn;
  if (curTab === 'hair') { list = HAIRS; isOn = i => state.hair === i.id; }
  else if (curTab === 'dress') { list = DRESSES; isOn = i => state.dress === i.id; }
  else if (curTab === 'shoes') { list = SHOES; isOn = i => state.shoes === i.id; }
  else if (curTab === 'acc') { list = ACCS; isOn = i => state.accs.includes(i.id); }
  else if (curTab === 'pet') { list = PETS; isOn = i => state.pet === i.id; }
  else { list = BGS; isOn = i => state.bg === i.id; }
  box.innerHTML = list.map(i => {
    const lk = isLocked(i);
    return `<button data-item="${i.id}" class="${isOn(i) ? 'on' : ''}${lk ? ' locked' : ''}">${preview(i, curTab)}<div class="nm">${lk ? (i.gacha ? '🔒 🎰' : '🔒 🪙' + i.price) : i.name}</div></button>`;
  }).join('');
}
function isLocked(item) { return !!(item.price || item.gacha) && !(state.owned || []).includes(item.id); }
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
  const allItems = [...HAIRS, ...DRESSES, ...SHOES, ...ACCS, ...PETS, ...BGS];
  const it = allItems.find(i => i.id === id && i.price);
  if (it && isLocked(it)) { tone(300, 220, .18); showBubble('去服飾店買才能穿喔 🛍️'); return; }
  if (curTab === 'hair') state.hair = id;
  else if (curTab === 'dress') state.dress = id;
  else if (curTab === 'shoes') state.shoes = id;
  else if (curTab === 'pet') state.pet = id;
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
  const ownedOnly = a => a.filter(i => !isLocked(i));
  state.hair = pick(ownedOnly(HAIRS)).id;
  state.hairColor = pick(HAIR_COLORS);
  state.dress = pick(ownedOnly(DRESSES)).id;
  state.dressColor = pick(DRESS_COLORS);
  state.shoes = pick(SHOES).id;
  state.shoeColor = pick(DRESS_COLORS);
  state.bg = pick(BGS).id;
  state.pet = pick(ownedOnly(PETS)).id;
  state.accs = ownedOnly(ACCS).filter(() => Math.random() < .4).map(a => a.id);
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

/* ==================== 小鎮模式 ==================== */
const TOWN_W = 2540;
const CHAR_S = 0.42;
let townActive = false;
let loopTimer = null;
let zzzTimer = null;
const town = {
  loc: 'street', x: 185, tx: 185, facing: 1, cam: 0, phase: 0,
  entering: null, napping: false, eating: false, lampOff: false, coinSpots: [], quiz: null,
  riding: false, ridePhase: 0, balloons: [false, false, false, false], balloonColors: [],
  tasksDone: { home: false, shop: false, restaurant: false, salon: false, school: false, park: false }
};
const DOOR_X = { home: 185, shop: 515, restaurant: 835, salon: 1105, school: 1405, park: 1740, convenience: 2040, department: 2340 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function showBubble(msg) {
  const old = $('#stage .bubble');
  if (old) old.remove();
  const d = document.createElement('div');
  d.className = 'bubble';
  d.textContent = msg;
  $('#stage').appendChild(d);
  setTimeout(() => d.remove(), 1900);
}
function coinsUI() { $('#coins').textContent = '🪙 ' + (state.coins || 0); }

/* ---------- 今日任務 ---------- */
const TASKS = [
  { id: 'home', em: '🏠', text: '回家睡個午覺' },
  { id: 'shop', em: '👗', text: '去服飾店逛一逛' },
  { id: 'restaurant', em: '🍰', text: '去餐廳吃點心' },
  { id: 'salon', em: '💇‍♀️', text: '去美髮店臭美一下' },
  { id: 'school', em: '🏫', text: '去學校認真上課' },
  { id: 'park', em: '🎡', text: '去遊樂園玩一下' }
];
function pingTaskBtn() {
  const b = $('#btn-tasks');
  b.classList.remove('pulse');
  void b.offsetWidth;
  b.classList.add('pulse');
}
function renderTaskPanel() {
  const list = $('#taskList');
  if (!list) return;
  list.innerHTML = TASKS.map(t =>
    `<li class="${town.tasksDone[t.id] ? 'done' : ''}"><span>${t.em} ${t.text}</span><span class="check">${town.tasksDone[t.id] ? '✔' : ''}</span></li>`
  ).join('');
}
function completeTask(id) {
  if (!town.tasksDone.hasOwnProperty(id) || town.tasksDone[id]) return;
  town.tasksDone[id] = true;
  pingTaskBtn();
  renderTaskPanel();
  if (Object.values(town.tasksDone).every(v => v)) {
    setTimeout(() => {
      state.coins = (state.coins || 0) + 15;
      saveState(); coinsUI(); chime(); burst(16);
      showBubble('今日任務全部完成！+15 金幣 🎉');
      TASKS.forEach(t => { town.tasksDone[t.id] = false; });
      renderTaskPanel();
    }, 1600);
  }
}
function ding() { tone(880, 1320, .12); }
function chaching() { tone(660, 660, .09); tone(990, 990, .2, .09); }
function doorSound() { tone(440, 560, .15); }
function lullaby() { tone(523, 523, .4, 0, .08); tone(392, 392, .5, .35, .08); tone(330, 330, .6, .75, .07); }

/* ---------- 街道 ---------- */
function buildingSVG(bx, w, wall, roof, sign, act, loc) {
  const doorX = bx + w / 2;
  const wallSide = shade(wall, .72);
  const roofSide = shade(roof, .7);
  return `
  ${dropShadow(bx + w / 2 + 12, 455, w / 2 + 28, 15, .16)}
  <path d="M${doorX} 194 L${doorX + 20} 180 L${bx + w + 34} 250 L${bx + w + 14} 260 Z" fill="${roofSide}"/>
  <path d="M${bx + w} 256 L${bx + w + 20} 242 L${bx + w + 20} 434 L${bx + w} 450 Z" fill="${wallSide}"/>
  <path d="M${bx - 14} 260 L${doorX} 194 L${bx + w + 14} 260 Z" fill="${roof}"/>
  <path d="M${bx - 14} 260 L${bx + w + 14} 260 L${bx + w + 14} 266 L${bx - 14} 266 Z" fill="${shade(roof, .82)}" opacity=".6"/>
  <rect x="${bx}" y="256" width="${w}" height="194" rx="6" fill="${wall}"/>
  <rect x="${bx + 22}" y="288" width="46" height="46" rx="9" fill="#fff" opacity=".88"/>
  <rect x="${bx + w - 68}" y="288" width="46" height="46" rx="9" fill="#fff" opacity=".88"/>
  <path d="M${bx + 22} 311 h46 M${bx + 45} 288 v46 M${bx + w - 68} 311 h46 M${bx + w - 45} 288 v46" stroke="${shade(wall, .8)}" stroke-width="3"/>
  <g data-act="${act}" data-loc="${loc}" data-x="${doorX}" style="cursor:pointer">
    <rect x="${doorX - 30}" y="352" width="60" height="98" rx="11" fill="${shade(wall, .68)}"/>
    <rect x="${doorX - 30}" y="352" width="14" height="98" rx="7" fill="${shade(wall, .58)}" opacity=".7"/>
    <circle cx="${doorX + 17}" cy="404" r="4.5" fill="#ffd23e"/>
  </g>
  <rect x="${doorX - 66}" y="220" width="132" height="32" rx="16" fill="#fff" opacity=".95"/>
  <text x="${doorX}" y="243" font-size="17" text-anchor="middle" fill="#c2557f">${sign}</text>`;
}
function hillsLayer(baseY, amp, color, op) {
  const startX = -420, endX = TOWN_W + 420, step = 220;
  let d = `M${startX} ${baseY}`;
  let x = startX, up = true;
  while (x < endX) {
    const nx = x + step;
    const cy = baseY + (up ? -amp : amp * .4);
    d += ` Q${x + step / 2} ${cy} ${nx} ${baseY}`;
    up = !up; x = nx;
  }
  d += ` L${endX} 470 L${startX} 470 Z`;
  return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
}
function farSVG() {
  return `
  <defs><linearGradient id="skyTown" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cfe9ff"/><stop offset="1" stop-color="#fdf3fb"/>
  </linearGradient></defs>
  <rect x="-420" width="${TOWN_W + 840}" height="520" fill="url(#skyTown)"/>
  <circle cx="150" cy="72" r="28" fill="#ffe08a"/>
  ${cloud(320, 80, 1)}${cloud(640, 120, .8)}${cloud(960, 66, .9)}${cloud(1180, 140, .7)}${cloud(-140, 110, .85)}${cloud(1420, 95, .9)}
  ${hillsLayer(430, 26, '#e3d2f2', .55)}
  ${hillsLayer(448, 22, '#f0ddef', .65)}`;
}
function streetSVG() {
  const coins = town.coinSpots.map((cx, i) => `
    <g data-act="coin" data-i="${i}" style="cursor:pointer">
      ${dropShadow(cx, 493, 13, 4, .15)}
      <circle cx="${cx}" cy="483" r="14" fill="#ffd23e" stroke="#eda711" stroke-width="3"/>
      <polygon points="${star(cx, 483, 7, 3)}" fill="#fff" opacity=".9"/>
    </g>`).join('');
  const lamp = x => `
    ${dropShadow(x, 452, 11, 4, .14)}
    <rect x="${x - 3}" y="330" width="6" height="118" fill="#b98cc9"/>
    <rect x="${x - 3}" y="330" width="3" height="118" fill="${shade('#b98cc9', .78)}"/>
    <circle cx="${x}" cy="322" r="12" fill="#fff3b0" stroke="#b98cc9" stroke-width="3"/>
    <circle cx="${x - 4}" cy="318" r="4" fill="#fff" opacity=".55"/>`;
  const bush = x => `
    ${dropShadow(x, 453, 28, 8, .12)}
    <ellipse cx="${x}" cy="446" rx="26" ry="15" fill="#9ed98c"/>
    <ellipse cx="${x - 7}" cy="440" rx="14" ry="7" fill="#b8ecac" opacity=".7"/>
    ${flower(x - 8, 442, '#ff8fb8', '#ffd23e')}${flower(x + 10, 448, '#ffffff', '#ffd23e')}`;
  return `
  <defs>
    <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c7f0b4"/><stop offset="1" stop-color="#9ed98c"/>
    </linearGradient>
    <linearGradient id="sidewalkGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f5eefc"/><stop offset="1" stop-color="#dcc9ee"/>
    </linearGradient>
  </defs>
  <rect y="436" width="${TOWN_W}" height="18" fill="url(#grassGrad)"/>
  <rect y="450" width="${TOWN_W}" height="70" fill="url(#sidewalkGrad)"/>
  <path d="${Array.from({ length: 13 }, (_, i) => `M${i * 100} 450 v70`).join(' ')}" stroke="#dcd0ea" stroke-width="3" opacity=".6"/>
  <rect y="516" width="${TOWN_W}" height="4" fill="#c9b0dc"/>
  ${buildingSVG(60, 250, '#ffd9ec', '#ff9ec7', '🏠 小公主的家', 'door', 'home')}
  ${buildingSVG(390, 250, '#eadcfb', '#b28ae0', '👗 服飾店', 'door', 'shop')}
  ${buildingSVG(720, 230, '#ffe9c9', '#ffb37f', '🍰 餐廳', 'door', 'restaurant')}
  ${buildingSVG(1000, 210, '#d8f2e4', '#7fd0b0', '💇‍♀️ 美髮店', 'door', 'salon')}
  ${buildingSVG(1290, 230, '#fdeec0', '#e0a85f', '🏫 小小學校', 'door', 'school')}
  ${buildingSVG(1600, 280, '#ffe3ec', '#ff6f91', '🎡 遊樂園', 'door', 'park')}
  ${buildingSVG(1930, 220, '#e8f7e0', '#5cb85c', '🏪 便利商店', 'door', 'convenience')}
  ${buildingSVG(2210, 260, '#faf3e0', '#d4af6a', '🏬 百貨公司', 'door', 'department')}
  ${heart(185, 210, 1.6, '#ff6fa5')}
  <svg x="425" y="290" width="50" height="56" viewBox="85 225 190 200">${DRESSES[0].svg('#ff8fc0')}</svg>
  ${lamp(345)}${lamp(675)}${lamp(965)}${lamp(1250)}${lamp(1560)}${lamp(1890)}${lamp(2180)}
  ${bush(320)}${bush(700)}${bush(985)}${bush(1245)}${bush(2490)}
  ${coins}`;
}

/* ---------- 家 ---------- */
function roomSwatch(cx, cy, room) {
  const owned = state.ownedRooms.includes(room.id);
  const active = state.room === room.id;
  return `<g data-act="room" data-id="${room.id}" style="cursor:pointer">
    ${active ? `<circle cx="${cx}" cy="${cy}" r="19" fill="none" stroke="#ff6fa5" stroke-width="3"/>` : ''}
    <circle cx="${cx}" cy="${cy}" r="15" fill="${room.bed}" stroke="#fff" stroke-width="3"/>
    ${!owned ? `<circle cx="${cx + 12}" cy="${cy - 12}" r="9" fill="#ffd23e" stroke="#eda711" stroke-width="1.5"/><text x="${cx + 12}" y="${cy - 9}" font-size="9" text-anchor="middle" fill="#8a5510" font-weight="bold">${room.price}</text>` : ''}
  </g>`;
}
function homeSVG() {
  const room = ROOMS.find(r => r.id === state.room) || ROOMS[0];
  const floorTop = shade(room.floor, 1.18), floorLine = shade(room.floor, .8);
  const curtainRail = shade(room.curtain, .78);
  const wardrobeSide = shade(room.wardrobe, .78), wardrobeTop = shade(room.wardrobe, 1.2);
  const bedFrame = shade(room.bed, .86), bedSide = shade(room.bed, .78);
  const pillowSide = shade(room.pillow, .86);
  const rugStroke = shade(room.rug, .76);
  return `
  <defs><linearGradient id="floorHome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${floorTop}"/><stop offset="1" stop-color="${room.floor}"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="${room.wall}"/>
  <rect y="400" width="480" height="120" fill="url(#floorHome)"/>
  <path d="M0 440 h480 M0 480 h480 M120 400 v120 M300 400 v120 M420 400 v120" stroke="${floorLine}" stroke-width="3" opacity=".7"/>
  <rect x="185" y="76" width="130" height="116" rx="8" fill="#cfe9ff" stroke="#fff" stroke-width="8"/>
  <circle cx="290" cy="104" r="14" fill="#ffe08a"/>
  ${cloud(220, 130, .5)}
  <path d="M185 134 h130 M250 76 v116" stroke="#fff" stroke-width="6"/>
  <path d="M180 70 Q168 130 182 196 L196 196 Q186 130 196 70 Z" fill="${room.curtain}"/>
  <path d="M320 70 Q332 130 318 196 L304 196 Q314 130 304 70 Z" fill="${room.curtain}"/>
  <rect x="172" y="64" width="156" height="10" rx="5" fill="${curtainRail}"/>
  ${heart(90, 110, 2, '#ffb0c8')}
  <rect x="70" y="96" width="42" height="34" rx="6" fill="none" stroke="#e8a0c0" stroke-width="5"/>
  ${dropShadow(96, 408, 62, 13, .16)}
  <g data-act="wardrobe" style="cursor:pointer">
    <path d="M152 190 L166 178 L166 402 L152 412 Z" fill="${wardrobeSide}"/>
    <rect x="40" y="170" width="112" height="232" rx="12" fill="${room.wardrobe}"/>
    <path d="M40 170 L54 158 L166 158 L152 170 Z" fill="${wardrobeTop}"/>
    <path d="M96 170 v232" stroke="${wardrobeSide}" stroke-width="4"/>
    <circle cx="86" cy="292" r="5" fill="#fff"/><circle cx="106" cy="292" r="5" fill="#fff"/>
    <text x="96" y="248" font-size="34" text-anchor="middle">👗</text>
    <polygon points="${star(96, 152, 13, 5.5)}" fill="#ffd23e"/>
  </g>
  ${dropShadow(392, 408, 92, 14, .16)}
  <g data-act="bed" style="cursor:pointer">
    <rect x="318" y="252" width="20" height="150" rx="9" fill="${bedFrame}"/>
    <rect x="318" y="332" width="150" height="70" rx="12" fill="${room.bed}"/>
    <path d="M468 332 L482 322 L482 392 L468 402 Z" fill="${bedSide}"/>
    <rect x="328" y="318" width="136" height="36" rx="12" fill="#fff"/>
    <rect x="334" y="306" width="48" height="28" rx="9" fill="#ffe9f4"/>
    <rect x="382" y="314" width="84" height="60" rx="12" fill="${room.pillow}"/>
    <path d="M466 314 L478 304 L478 364 L466 374 Z" fill="${pillowSide}"/>
    <circle cx="404" cy="336" r="4" fill="#fff" opacity=".8"/>
    <circle cx="434" cy="352" r="4" fill="#fff" opacity=".8"/>
  </g>
  ${dropShadow(276, 406, 26, 8, .14)}
  <g data-act="lamp" style="cursor:pointer">
    <rect x="272" y="330" width="9" height="72" rx="4" fill="#d0a0c0"/>
    <ellipse cx="276" cy="402" rx="20" ry="7" fill="#d0a0c0"/>
    <path d="M254 330 L262 296 L292 296 L299 330 Z" fill="${town.lampOff ? '#c9b8d6' : '#ffd670'}"/>
    ${town.lampOff ? '' : `<ellipse cx="276" cy="330" rx="30" ry="14" fill="#fff3b0" opacity=".35"/>`}
  </g>
  ${dropShadow(168, 392, 20, 6, .13)}
  <g data-act="teddy" style="cursor:pointer">
    <circle cx="158" cy="362" r="10" fill="#c98d5f"/><circle cx="178" cy="362" r="10" fill="#c98d5f"/>
    <circle cx="168" cy="380" r="15" fill="#c98d5f"/>
    <circle cx="158" cy="356" r="4" fill="#e8b88a"/><circle cx="178" cy="356" r="4" fill="#e8b88a"/>
    <circle cx="163" cy="376" r="2" fill="#463a44"/><circle cx="173" cy="376" r="2" fill="#463a44"/>
    <ellipse cx="168" cy="384" rx="5" ry="4" fill="#e8b88a"/>
  </g>
  ${dropShadow(240, 464, 98, 20, .1)}
  <ellipse cx="240" cy="462" rx="98" ry="26" fill="${room.rug}" stroke="${rugStroke}" stroke-width="4"/>
  <text x="452" y="34" font-size="20" text-anchor="middle">🎨</text>
  ${roomSwatch(452, 66, ROOMS[0])}
  ${roomSwatch(452, 106, ROOMS[1])}
  ${roomSwatch(452, 146, ROOMS[2])}
  ${roomSwatch(452, 186, ROOMS[3])}`;
}

/* ---------- 服飾店 ---------- */
function shopStand(cx, item, kind) {
  const owned = !isLocked(item);
  const art = kind === 'dress'
    ? `<svg x="${cx - 45}" y="235" width="90" height="95" viewBox="85 225 190 200">${item.svg('#7fc4f2')}</svg>`
    : kind === 'hair'
    ? `<svg x="${cx - 45}" y="228" width="90" height="94" viewBox="20 10 320 330">${item.back('#8a5a3a')}<ellipse cx="180" cy="140" rx="90" ry="85" fill="${SKIN}"/>${item.front('#8a5a3a')}</svg>`
    : kind === 'pet'
    ? `<svg x="${cx - 40}" y="238" width="80" height="86" viewBox="268 372 78 102">${item.svg()}</svg>`
    : `<svg x="${cx - 42}" y="240" width="84" height="90" viewBox="${item.vb}">${item.svg()}</svg>`;
  return `
  ${dropShadow(cx + 4, 420, 54, 12, .15)}
  <g data-act="buy" data-id="${item.id}" style="cursor:pointer">
    <rect x="${cx - 52}" y="222" width="104" height="196" rx="14" fill="#fff" opacity=".55"/>
    <path d="M${cx + 46} 340 L${cx + 56} 332 L${cx + 56} 344 L${cx + 46} 354 Z" fill="#c090d8"/>
    <rect x="${cx - 46}" y="340" width="92" height="14" rx="7" fill="#d9b8ea"/>
    <rect x="${cx - 7}" y="352" width="14" height="44" rx="7" fill="#d9b8ea"/>
    ${art}
    <rect x="${cx - 36}" y="392" width="72" height="27" rx="13" fill="#fff" stroke="${owned ? '#7fc98f' : '#eda711'}" stroke-width="2.5"/>
    ${owned
      ? `<text x="${cx}" y="411" font-size="14" text-anchor="middle" fill="#4a9e5e">✔ 買過了</text>`
      : `<circle cx="${cx - 14}" cy="405" r="8" fill="#ffd23e" stroke="#eda711" stroke-width="2"/>
         <text x="${cx + 10}" y="411" font-size="16" text-anchor="middle" fill="#d09010">${item.price}</text>`}
  </g>`;
}
function shopSVG() {
  const stardress = DRESSES.find(d => d.id === 'stardress');
  const catears = ACCS.find(a => a.id === 'catears');
  const bag = ACCS.find(a => a.id === 'bag');
  return `
  <defs><linearGradient id="floorShop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#efe0fa"/><stop offset="1" stop-color="#dcc4ee"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#f6efff"/>
  <rect y="400" width="480" height="120" fill="url(#floorShop)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#c9a8de" stroke-width="3" opacity=".6"/>
  <rect x="100" y="34" width="280" height="46" rx="23" fill="#ff9ec7"/>
  <text x="240" y="65" font-size="21" text-anchor="middle" fill="#fff">👗 小小服飾店 👗</text>
  <g transform="translate(-232 -125)">${PETS.find(p => p.id === 'bunny').svg()}</g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#a878c8"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#c9a0e0"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#d9b8ea"/>
  ${heart(75, 366, 2, '#ffffff')}
  <rect x="94" y="282" width="38" height="32" rx="5" fill="#b28ae0"/>
  <rect x="100" y="290" width="26" height="10" rx="3" fill="#e8d8f4"/>
  ${shopStand(200, stardress, 'dress')}
  ${shopStand(310, catears, 'acc')}
  ${shopStand(415, bag, 'acc')}`;
}

/* ---------- 百貨公司 ---------- */
const GACHA_PRICE = 8;
function gachaMachine(cx, cy) {
  return `
  ${dropShadow(cx, cy + 88, 40, 10, .15)}
  <g data-act="gacha" style="cursor:pointer">
    <rect x="${cx - 34}" y="${cy + 18}" width="68" height="50" rx="8" fill="#ff9ec7"/>
    <circle cx="${cx}" cy="${cy - 14}" r="42" fill="#bfe8ff" opacity=".55" stroke="#8fd0f0" stroke-width="4"/>
    <circle cx="${cx - 18}" cy="${cy - 24}" r="8" fill="#ff8fb8"/>
    <circle cx="${cx + 10}" cy="${cy - 30}" r="7" fill="#ffd670"/>
    <circle cx="${cx - 4}" cy="${cy - 8}" r="7" fill="#8fdcb8"/>
    <circle cx="${cx + 16}" cy="${cy - 6}" r="6" fill="#bf94ea"/>
    <circle cx="${cx - 22}" cy="${cy + 2}" r="6" fill="#7fc4f2"/>
    <rect x="${cx - 8}" y="${cy + 30}" width="16" height="16" rx="4" fill="#fff"/>
    <circle cx="${cx + 28}" cy="${cy + 40}" r="9" fill="#e078a8"/>
    <rect x="${cx + 26}" y="${cy + 30}" width="6" height="14" fill="#e078a8"/>
    <text x="${cx}" y="${cy + 78}" font-size="13" text-anchor="middle" fill="#c2557f">扭一下 🪙${GACHA_PRICE}</text>
  </g>`;
}
function departmentSVG() {
  const puppy = PETS.find(p => p.id === 'puppy');
  const panda = PETS.find(p => p.id === 'panda');
  const parasol = ACCS.find(a => a.id === 'parasol');
  return `
  <defs><linearGradient id="floorDept" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fdf6e4"/><stop offset="1" stop-color="#f0dcae"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#fffbf0"/>
  <rect y="400" width="480" height="120" fill="url(#floorDept)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#d4af6a" stroke-width="3" opacity=".55"/>
  <rect x="80" y="34" width="320" height="46" rx="23" fill="#d4af6a"/>
  <text x="240" y="65" font-size="21" text-anchor="middle" fill="#fff">🏬 百貨公司 🏬</text>
  <g transform="translate(20 96)">
    <path d="M-6 20 Q28 -12 62 20 L54 30 Q28 8 2 30 Z" fill="#5aa8bc"/>
    <circle cx="-6" cy="16" r="6" fill="#7fc4a0"/><circle cx="14" cy="2" r="6" fill="#7fc4a0"/>
    <circle cx="42" cy="2" r="6" fill="#7fc4a0"/><circle cx="62" cy="16" r="6" fill="#7fc4a0"/>
    <ellipse cx="28" cy="70" rx="10" ry="34" fill="#4a90a4"/>
    <circle cx="28" cy="46" r="20" fill="#4a90a4"/>
    <path d="M22 28 L18 16 L28 24 Z" fill="#3a7a8c"/>
    <circle cx="20" cy="44" r="4" fill="#463a44"/><circle cx="36" cy="44" r="4" fill="#463a44"/>
    <circle cx="20" cy="44" r="7" fill="none" stroke="#d4af6a" stroke-width="1.5"/>
    <path d="M25 52 L31 52 L28 57 Z" fill="#ffb347"/>
  </g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#b8935a"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#d4af6a"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#f0dcae"/>
  ${heart(75, 366, 2, '#ffffff')}
  ${gachaMachine(240, 132)}
  ${shopStand(200, puppy, 'pet')}
  ${shopStand(310, panda, 'pet')}
  ${shopStand(415, parasol, 'acc')}`;
}

/* ---------- 餐廳 ---------- */
function foodStand(cx, food) {
  return `
  ${dropShadow(cx + 3, 414, 50, 11, .15)}
  <g data-act="food" data-id="${food.id}" style="cursor:pointer">
    <rect x="${cx - 48}" y="248" width="96" height="150" rx="14" fill="#fff" opacity=".55"/>
    <path d="M${cx + 38} 330 L${cx + 48} 322 L${cx + 48} 334 L${cx + 38} 344 Z" fill="#e0a868"/>
    <rect x="${cx - 42}" y="330" width="84" height="14" rx="7" fill="#f2c78e"/>
    <svg x="${cx - 38}" y="256" width="76" height="76" viewBox="0 0 100 100">${food.svg()}</svg>
    <rect x="${cx - 32}" y="352" width="64" height="27" rx="13" fill="#fff" stroke="#eda711" stroke-width="2.5"/>
    <circle cx="${cx - 12}" cy="365" r="8" fill="#ffd23e" stroke="#eda711" stroke-width="2"/>
    <text x="${cx + 12}" y="371" font-size="16" text-anchor="middle" fill="#d09010">${food.price}</text>
  </g>`;
}
function restaurantSVG() {
  const cake = FOODS.find(f => f.id === 'cake');
  const ice = FOODS.find(f => f.id === 'icecream');
  const donut = FOODS.find(f => f.id === 'donut');
  return `
  <defs><linearGradient id="floorRest" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff0da"/><stop offset="1" stop-color="#f2d4a8"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#fff7ec"/>
  <rect y="400" width="480" height="120" fill="url(#floorRest)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#e0b880" stroke-width="3" opacity=".6"/>
  <rect x="90" y="34" width="300" height="46" rx="23" fill="#ffb37f"/>
  <text x="240" y="65" font-size="21" text-anchor="middle" fill="#fff">🍰 小小餐廳 🍰</text>
  <g transform="translate(24 68)">
    <path d="M4 226 Q4 202 28 200 Q52 202 52 226 Q52 214 42 216 Q44 194 28 194 Q12 194 14 216 Q4 214 4 226 Z" fill="#fff"/>
    <rect x="6" y="222" width="44" height="10" rx="5" fill="#fff"/>
    <circle cx="6" cy="234" r="12" fill="#c98d5f"/><circle cx="50" cy="234" r="12" fill="#c98d5f"/>
    <circle cx="6" cy="232" r="6" fill="#e8b88a"/><circle cx="50" cy="232" r="6" fill="#e8b88a"/>
    <circle cx="28" cy="246" r="26" fill="#c98d5f"/>
    <circle cx="18" cy="242" r="3" fill="#463a44"/><circle cx="38" cy="242" r="3" fill="#463a44"/>
    <ellipse cx="28" cy="252" rx="8" ry="6" fill="#e8b88a"/>
    <circle cx="28" cy="254" r="2" fill="#463a44"/>
    <path d="M20 258 Q28 264 36 258" stroke="#463a44" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M4 274 L52 274 L46 306 L10 306 Z" fill="#fff"/>
    ${heart(28, 290, 1.3, '#ff9ec7')}
  </g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#c99060"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#e0a868"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#f2c78e"/>
  ${heart(75, 366, 2, '#ffffff')}
  ${dropShadow(410, 380, 30, 8, .13)}
  <ellipse cx="410" cy="330" rx="34" ry="10" fill="#fff" opacity=".85"/>
  <rect x="404" y="330" width="12" height="44" fill="#e0b880"/>
  <ellipse cx="410" cy="376" rx="20" ry="6" fill="#c99060" opacity=".5"/>
  ${foodStand(200, cake)}
  ${foodStand(310, ice)}
  ${foodStand(415, donut)}`;
}

/* ---------- 便利商店 ---------- */
function convenienceSVG() {
  const tea = FOODS.find(f => f.id === 'bubbletea');
  const chips = FOODS.find(f => f.id === 'chips');
  const pop = FOODS.find(f => f.id === 'popsicle');
  return `
  <defs><linearGradient id="floorConv" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f0fbe8"/><stop offset="1" stop-color="#cdeab8"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#f7fdf2"/>
  <rect y="400" width="480" height="120" fill="url(#floorConv)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#a8d898" stroke-width="3" opacity=".6"/>
  <rect x="90" y="34" width="300" height="46" rx="23" fill="#5cb85c"/>
  <text x="240" y="65" font-size="21" text-anchor="middle" fill="#fff">🏪 便利商店 🏪</text>
  <g transform="translate(24 68)">
    <ellipse cx="8" cy="220" rx="9" ry="16" fill="#c98a4a" transform="rotate(-15 8 220)"/>
    <ellipse cx="48" cy="220" rx="9" ry="16" fill="#c98a4a" transform="rotate(15 48 220)"/>
    <circle cx="28" cy="246" r="26" fill="#e8b47a"/>
    <path d="M6 210 Q28 196 50 210 L46 216 Q28 206 10 216 Z" fill="#5cb85c"/>
    <circle cx="18" cy="242" r="3" fill="#463a44"/><circle cx="38" cy="242" r="3" fill="#463a44"/>
    <ellipse cx="28" cy="252" rx="7" ry="5" fill="#463a44"/>
    <path d="M20 258 Q28 263 36 258" stroke="#463a44" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M4 274 L52 274 L46 306 L10 306 Z" fill="#fff"/>
    ${heart(28, 290, 1.3, '#5cb85c')}
  </g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#4a9e4a"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#5cb85c"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#a8dda0"/>
  ${heart(75, 366, 2, '#ffffff')}
  ${foodStand(200, tea)}
  ${foodStand(310, chips)}
  ${foodStand(415, pop)}`;
}

/* ---------- 美髮店 ---------- */
function colorDot(cx, cy, c) {
  const on = state.hairColor === c;
  return `<g data-act="haircolor" data-color="${c}" style="cursor:pointer">
    <circle cx="${cx}" cy="${cy}" r="14" fill="${c}" stroke="#fff" stroke-width="3"/>
    ${on ? `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="#ff6fa5" stroke-width="3"/>` : ''}
  </g>`;
}
function salonSVG() {
  const braid = HAIRS.find(h => h.id === 'braid');
  const buns = HAIRS.find(h => h.id === 'buns');
  return `
  <defs><linearGradient id="floorSalon" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e4f7ec"/><stop offset="1" stop-color="#bfe8d2"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#f2fdf6"/>
  <rect y="400" width="480" height="120" fill="url(#floorSalon)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#9fd6b8" stroke-width="3" opacity=".6"/>
  <rect x="90" y="34" width="300" height="46" rx="23" fill="#7fd0b0"/>
  <text x="240" y="65" font-size="21" text-anchor="middle" fill="#fff">💇‍♀️ 小小美髮店 💇‍♀️</text>
  <g transform="translate(14 60)">
    <ellipse cx="60" cy="220" rx="38" ry="34" fill="#7ec8e3"/>
    <circle cx="60" cy="170" r="30" fill="#7ec8e3"/>
    <path d="M40 150 L30 130 L48 140 Z" fill="#5fa8c8"/>
    <circle cx="52" cy="166" r="4" fill="#463a44"/><circle cx="68" cy="166" r="4" fill="#463a44"/>
    <path d="M56 176 L64 176 L60 182 Z" fill="#ffb347"/>
    <path d="M20 300 L100 300 L92 330 L28 330 Z" fill="#fff"/>
    ${heart(60, 314, 1.2, '#7ec8e3')}
    <g transform="translate(92 210) rotate(25)">
      <path d="M0 0 L14 4 M0 0 L14 -4" stroke="#c0c0c8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="3" fill="#8a8a94"/>
    </g>
  </g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#5fae8a"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#7fd0b0"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#a8e6c4"/>
  ${heart(75, 366, 2, '#ffffff')}
  ${dropShadow(410, 392, 34, 10, .13)}
  <ellipse cx="410" cy="118" rx="26" ry="32" fill="#fff" stroke="#c9a8de" stroke-width="6"/>
  <ellipse cx="404" cy="106" rx="8" ry="14" fill="#fff" opacity=".5"/>
  <rect x="404" y="150" width="12" height="10" fill="#c9a8de"/>
  <rect x="392" y="350" width="12" height="42" fill="#c9a0c0"/>
  <ellipse cx="410" cy="352" rx="34" ry="14" fill="#ff9ec7"/>
  <ellipse cx="410" cy="342" rx="30" ry="12" fill="#ffb8d4"/>
  <rect x="398" y="372" width="24" height="20" fill="#c9a0c0"/>
  <ellipse cx="410" cy="392" rx="22" ry="6" fill="#a87898"/>
  <rect x="372" y="150" width="76" height="66" rx="12" fill="#fff" opacity=".7"/>
  ${colorDot(392, 172, HAIR_COLORS[0])}${colorDot(410, 172, HAIR_COLORS[1])}${colorDot(428, 172, HAIR_COLORS[2])}
  ${colorDot(392, 198, HAIR_COLORS[3])}${colorDot(410, 198, HAIR_COLORS[4])}${colorDot(428, 198, HAIR_COLORS[5])}
  ${shopStand(200, braid, 'hair')}
  ${shopStand(310, buns, 'hair')}`;
}

/* ---------- 學校（小測驗） ---------- */
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function uniqueDistractors(correct, min, max) {
  const set = new Set([correct]);
  let guard = 0;
  while (set.size < 3 && guard++ < 50) set.add(min + Math.floor(Math.random() * (max - min + 1)));
  return shuffle([...set]);
}
const SHAPES = ['circle', 'square', 'triangle', 'star'];
const ENGLISH_WORDS = [
  { word: 'CAT', emoji: '🐱' }, { word: 'DOG', emoji: '🐶' }, { word: 'SUN', emoji: '☀️' },
  { word: 'MOON', emoji: '🌙' }, { word: 'STAR', emoji: '⭐' }, { word: 'FISH', emoji: '🐟' },
  { word: 'BIRD', emoji: '🐦' }, { word: 'TREE', emoji: '🌳' }, { word: 'CAKE', emoji: '🎂' },
  { word: 'BOOK', emoji: '📖' }, { word: 'BALL', emoji: '⚽' }, { word: 'DUCK', emoji: '🦆' },
  { word: 'FROG', emoji: '🐸' }, { word: 'MILK', emoji: '🥛' }, { word: 'BEAR', emoji: '🐻' }
];
function shapeIcon(id, cx, cy, s, color) {
  if (id === 'circle') return `<circle cx="${cx}" cy="${cy}" r="${18 * s}" fill="${color}"/>`;
  if (id === 'square') return `<rect x="${cx - 16 * s}" y="${cy - 16 * s}" width="${32 * s}" height="${32 * s}" rx="${4 * s}" fill="${color}"/>`;
  if (id === 'triangle') return `<polygon points="${cx},${cy - 18 * s} ${cx - 18 * s},${cy + 14 * s} ${cx + 18 * s},${cy + 14 * s}" fill="${color}"/>`;
  return `<polygon points="${star(cx, cy, 18 * s, 8 * s)}" fill="${color}"/>`;
}
function starsGrid(n, cx, cy) {
  const perRow = 4, rows = Math.ceil(n / perRow);
  let out = '';
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow), col = i % perRow;
    const rowCount = Math.min(perRow, n - row * perRow);
    const x = cx - (rowCount - 1) * 22 + col * 44;
    const y = cy - (rows - 1) * 22 + row * 44;
    out += `<polygon points="${star(x, y, 14, 6)}" fill="#ffd23e" stroke="#eda711" stroke-width="1.5"/>`;
  }
  return out;
}
const MATH_TIERS = [
  { id: 'easy', label: '簡單', weight: 4, reward: 4, ops: ['+'] },
  { id: 'normal', label: '一般', weight: 3, reward: 6, ops: ['+', '-'] },
  { id: 'hard', label: '困難', weight: 2, reward: 8, ops: ['+', '-', '×'] },
  { id: 'expert', label: '高級', weight: 1, reward: 10, ops: ['+', '-', '×'] }
];
function pickWeighted(list) {
  const total = list.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of list) { if ((r -= item.weight) < 0) return item; }
  return list[list.length - 1];
}
function genMath() {
  const rnd = n => Math.floor(Math.random() * n);
  const tier = pickWeighted(MATH_TIERS);
  const op = pick(tier.ops);
  let a, b, correct;
  if (op === '+') {
    if (tier.id === 'easy') { a = 1 + rnd(5); b = 1 + rnd(4); }
    else if (tier.id === 'normal') { a = 1 + rnd(10); b = 1 + rnd(10); }
    else if (tier.id === 'hard') { a = 1 + rnd(20); b = 1 + rnd(20); }
    else { a = 1 + rnd(30); b = 1 + rnd(30); }
    correct = a + b;
  } else if (op === '-') {
    const hi = tier.id === 'normal' ? 10 : tier.id === 'hard' ? 20 : 30;
    a = 2 + rnd(hi);
    b = 1 + rnd(Math.min(a - 1, hi));
    correct = a - b;
  } else {
    if (tier.id === 'hard') { a = 2 + rnd(4); b = 1 + rnd(9); }
    else { a = 2 + rnd(8); b = 2 + rnd(8); }
    correct = a * b;
  }
  const spread = Math.max(3, Math.round(correct * .25));
  return {
    type: 'math', tierLabel: tier.label, op, a, b, reward: tier.reward,
    choices: uniqueDistractors(correct, Math.max(0, correct - spread), correct + spread),
    correct, solved: false
  };
}
function genQuiz() {
  const type = pick(['count', 'math', 'shape', 'english']);
  if (type === 'count') {
    const n = 2 + Math.floor(Math.random() * 7);
    return { type, n, reward: 5, choices: uniqueDistractors(n, 1, 9), correct: n, solved: false };
  }
  if (type === 'math') return genMath();
  if (type === 'english') {
    const target = pick(ENGLISH_WORDS);
    const others = shuffle(ENGLISH_WORDS.filter(w => w.word !== target.word)).slice(0, 2);
    return { type, emoji: target.emoji, choices: shuffle([target.word, ...others.map(o => o.word)]), correct: target.word, solved: false };
  }
  const target = pick(SHAPES);
  const others = shuffle(SHAPES.filter(s => s !== target)).slice(0, 2);
  return { type, target, color: pick(DRESS_COLORS), choices: shuffle([target, ...others]), correct: target, solved: false };
}
function quizBoard(q) {
  if (!q) return `<text x="240" y="200" font-size="22" text-anchor="middle" fill="#fff">✏️ 點我上課！</text>`;
  if (q.type === 'count') return `<text x="240" y="150" font-size="18" text-anchor="middle" fill="#fff">數一數，有幾個？</text>${starsGrid(q.n, 240, 210)}`;
  if (q.type === 'math') return `<text x="240" y="150" font-size="18" text-anchor="middle" fill="#fff">數學小教室：${q.tierLabel}</text><text x="240" y="222" font-size="40" text-anchor="middle" fill="#fff" font-weight="bold">${q.a} ${q.op} ${q.b} = ?</text>`;
  if (q.type === 'english') return `<text x="240" y="140" font-size="18" text-anchor="middle" fill="#fff">英文小教室：這是什麼？</text><text x="240" y="228" font-size="66" text-anchor="middle">${q.emoji}</text>`;
  return `<text x="240" y="150" font-size="18" text-anchor="middle" fill="#fff">哪一個一樣？</text>${shapeIcon(q.target, 240, 208, 2.1, q.color)}`;
}
function quizChoices(q) {
  if (!q) return '';
  const xs = [95, 240, 385];
  return xs.map((cx, i) => {
    const val = q.choices[i];
    const inner = q.type === 'shape'
      ? shapeIcon(val, cx, 355, 1.3, q.color)
      : q.type === 'english'
      ? `<text x="${cx}" y="362" font-size="21" text-anchor="middle" fill="#5a4636" font-weight="bold">${val}</text>`
      : `<text x="${cx}" y="365" font-size="30" text-anchor="middle" fill="#5a4636" font-weight="bold">${val}</text>`;
    return `
    ${dropShadow(cx + 2, 392, 46, 10, .13)}
    <g data-act="quiz-answer" data-idx="${i}" style="cursor:pointer">
      <rect x="${cx - 46}" y="326" width="92" height="66" rx="16" fill="#fff" stroke="#ffb37f" stroke-width="3"/>
      ${inner}
    </g>`;
  }).join('');
}
function schoolSVG() {
  const q = town.quiz;
  return `
  <defs><linearGradient id="floorSchool" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff8e8"/><stop offset="1" stop-color="#f2dfae"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#fffbf0"/>
  <rect y="400" width="480" height="120" fill="url(#floorSchool)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#e0c078" stroke-width="3" opacity=".6"/>
  <rect x="90" y="20" width="300" height="46" rx="23" fill="#e0a85f"/>
  <text x="240" y="51" font-size="21" text-anchor="middle" fill="#fff">🏫 小小學校 🏫</text>
  <g transform="translate(360 300)">
    ${dropShadow(28, 90, 34, 9, .13)}
    <ellipse cx="0" cy="0" rx="30" ry="34" fill="#c9a876"/>
    <path d="M-24 -30 L-18 -44 L-12 -32 Z" fill="#a8875a"/>
    <path d="M24 -30 L18 -44 L12 -32 Z" fill="#a8875a"/>
    <circle cx="-12" cy="-16" r="10" fill="#fff"/><circle cx="12" cy="-16" r="10" fill="#fff"/>
    <circle cx="-12" cy="-16" r="6" fill="#463a44"/><circle cx="12" cy="-16" r="6" fill="#463a44"/>
    <circle cx="-12" cy="-16" r="9" fill="none" stroke="#5a4636" stroke-width="2"/>
    <circle cx="12" cy="-16" r="9" fill="none" stroke="#5a4636" stroke-width="2"/>
    <path d="M-3 -16 L3 -16" stroke="#5a4636" stroke-width="2"/>
    <path d="M-4 -8 L0 -2 L4 -8 Z" fill="#ffb347"/>
    <rect x="-22" y="20" width="44" height="8" rx="4" fill="#7fa8d8"/>
  </g>
  ${dropShadow(75, 412, 66, 12, .15)}
  <path d="M136 312 L146 302 L146 402 L136 412 Z" fill="#c99a4a"/>
  <rect x="14" y="312" width="122" height="16" rx="8" fill="#e0a85f"/>
  <rect x="20" y="326" width="110" height="86" rx="9" fill="#f2c97e"/>
  ${heart(75, 366, 2, '#ffffff')}
  ${dropShadow(410, 452, 30, 8, .12)}
  <rect x="384" y="404" width="52" height="34" rx="6" fill="#fff"/>
  <rect x="392" y="438" width="10" height="20" fill="#e0c078"/><rect x="418" y="438" width="10" height="20" fill="#e0c078"/>
  <path d="${Array.from({ length: 6 }, (_, i) => `M${390 + i * 8} 404 v34`).join(' ')}" stroke="#dcbf8a" stroke-width="1.5" opacity=".5"/>
  <g data-act="${q && !q.solved ? '' : 'quiz-start'}" style="cursor:pointer">
    ${dropShadow(240, 288, 128, 14, .16)}
    <rect x="112" y="96" width="256" height="176" rx="16" fill="#4a7a5e" stroke="#eadcc0" stroke-width="10"/>
    ${quizBoard(q)}
  </g>`;
}

/* ---------- 遊樂園 ---------- */
const HORSE_BASE = [
  { x: 78, y: 322, s: .82 },
  { x: 130, y: 336, s: 1 },
  { x: 182, y: 322, s: .82 }
];
const HORSE_COLORS = ['#ff9ec7', '#7fc4f2', '#ffd670'];
const BALLOON_SPOTS = [
  { x: 300, y: 140 }, { x: 350, y: 118 }, { x: 400, y: 140 }, { x: 445, y: 118 }
];
function ponyIcon(color) {
  const d = shade(color, .8);
  return `<g>
    <ellipse cx="0" cy="0" rx="16" ry="11" fill="${color}"/>
    <circle cx="16" cy="-6" r="7" fill="${color}"/>
    <path d="M10 -14 L14 -21 L18 -13 Z" fill="${d}"/>
    <path d="M-14 -8 Q-21 -3 -13 3" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <line x1="-8" y1="9" x2="-8" y2="21" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
    <line x1="8" y1="9" x2="8" y2="21" stroke="${d}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="19" cy="-7" r="1.5" fill="#463a44"/>
    <path d="M18 -2 L22 2 Z" stroke="#e0384f" stroke-width="1.5" stroke-linecap="round"/>
  </g>`;
}
function balloonIcon(cx, cy, color) {
  return `
  <line x1="${cx}" y1="${cy + 22}" x2="${cx - 6}" y2="${cy + 68}" stroke="#c9a0c0" stroke-width="2"/>
  <ellipse cx="${cx}" cy="${cy}" rx="17" ry="21" fill="${color}"/>
  <path d="M${cx - 4} ${cy + 19} L${cx} ${cy + 25} L${cx + 4} ${cy + 19} Z" fill="${color}"/>
  <ellipse cx="${cx - 6}" cy="${cy - 8}" rx="5" ry="7" fill="#fff" opacity=".4"/>`;
}
function carouselSVG() {
  const stripes = Array.from({ length: 6 }, (_, i) => {
    const x0 = 60 + i * 23.3;
    return `<path d="M${x0} 150 Q${x0 + 12} 108 ${x0 + 23} 150 Z" fill="${i % 2 ? '#ff9ec7' : '#fff'}"/>`;
  }).join('');
  const horses = HORSE_BASE.map((h, i) =>
    `<g id="horse${i}" transform="translate(${h.x} ${h.y}) scale(${h.s})">${ponyIcon(HORSE_COLORS[i])}</g>`
  ).join('');
  return `
  ${dropShadow(130, 380, 92, 20, .15)}
  <ellipse cx="130" cy="362" rx="88" ry="22" fill="#ffd3e6" stroke="#ff9ec7" stroke-width="4"/>
  <line x1="130" y1="150" x2="130" y2="345" stroke="#e8a0c0" stroke-width="6"/>
  ${stripes}
  <circle cx="130" cy="106" r="9" fill="#ffd23e"/>
  ${horses}
  ${dropShadow(130, 400, 42, 10, .13)}
  <g data-act="carousel-toggle" style="cursor:pointer">
    <rect x="90" y="372" width="80" height="28" rx="14" fill="#fff" stroke="#ff9ec7" stroke-width="3"/>
    <text x="130" y="391" font-size="14" text-anchor="middle" fill="#c2557f">${town.riding ? '停下來' : '轉圈圈！'}</text>
  </g>`;
}
function balloonCart() {
  return town.balloons.map((popped, i) => {
    if (popped) return '';
    if (!town.balloonColors[i]) town.balloonColors[i] = pick(DRESS_COLORS);
    const p = BALLOON_SPOTS[i];
    return `<g data-act="balloon" data-i="${i}" style="cursor:pointer">${balloonIcon(p.x, p.y, town.balloonColors[i])}</g>`;
  }).join('') + `
  ${dropShadow(370, 402, 34, 9, .13)}
  <rect x="344" y="374" width="52" height="28" rx="6" fill="#ff9ec7"/>
  <circle cx="356" cy="404" r="7" fill="#c2557f"/><circle cx="384" cy="404" r="7" fill="#c2557f"/>
  ${heart(370, 388, 1.3, '#ffffff')}`;
}
function parkSVG() {
  return `
  <defs><linearGradient id="floorPark" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff0f6"/><stop offset="1" stop-color="#f7cfe0"/>
  </linearGradient></defs>
  <rect width="480" height="400" fill="#fff7fb"/>
  <rect y="400" width="480" height="120" fill="url(#floorPark)"/>
  <path d="M0 445 h480 M0 490 h480" stroke="#e8a8c4" stroke-width="3" opacity=".6"/>
  <rect x="90" y="20" width="300" height="46" rx="23" fill="#ff6f91"/>
  <text x="240" y="51" font-size="21" text-anchor="middle" fill="#fff">🎡 小小遊樂園 🎡</text>
  ${carouselSVG()}
  ${balloonCart()}`;
}
function updateCarouselBob() {
  HORSE_BASE.forEach((h, i) => {
    const el = document.getElementById('horse' + i);
    if (!el) return;
    const bob = -6 * Math.sin(town.ridePhase + i * 2);
    el.setAttribute('transform', `translate(${h.x} ${h.y + bob}) scale(${h.s})`);
  });
}
let carouselSparkleTimer = null;
function startCarouselSparkles() {
  clearInterval(carouselSparkleTimer);
  carouselSparkleTimer = setInterval(() => {
    if (!town.riding || !townActive || town.loc !== 'park') { clearInterval(carouselSparkleTimer); return; }
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = pick(['✨', '🎠', '⭐']);
    s.style.left = (18 + Math.random() * 32) + '%';
    s.style.top = (28 + Math.random() * 25) + '%';
    $('#sparkles').appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }, 500);
}
function stopCarouselSparkles() { clearInterval(carouselSparkleTimer); }
function popBalloon(i) {
  if (town.balloons[i]) return;
  town.balloons[i] = true;
  state.coins = (state.coins || 0) + 1;
  saveState(); coinsUI(); ding(); burst(4);
  renderTown();
  completeTask('park');
  setTimeout(() => {
    town.balloons[i] = false;
    town.balloonColors[i] = pick(DRESS_COLORS);
    if (townActive && town.loc === 'park') renderTown();
  }, 1400 + Math.random() * 900);
}
let gachaTimer = null;
function playGacha() {
  if ((state.coins || 0) < GACHA_PRICE) {
    tone(300, 220, .18);
    showBubble(`還差 ${GACHA_PRICE - (state.coins || 0)} 個金幣，去街上找找 🪙`);
    return;
  }
  state.coins -= GACHA_PRICE;
  saveState(); coinsUI();
  showBubble('轉轉轉... 🎰');
  tone(700, 1000, .1); tone(600, 900, .1, .12);
  burst(4);
  clearTimeout(gachaTimer);
  gachaTimer = setTimeout(() => {
    const pool = ACCS.filter(a => a.gacha);
    const prize = pickWeighted(pool);
    const isNew = !(state.owned || []).includes(prize.id);
    if (isNew) {
      state.owned.push(prize.id);
      if (!state.accs.includes(prize.id)) state.accs.push(prize.id);
      saveState();
      chime(); burst(prize.rare ? 22 : 12);
      showBubble((prize.rare ? '✨稀有✨ ' : '') + prize.name + ' 到手了！💕');
    } else {
      const refund = 4;
      state.coins += refund;
      saveState(); coinsUI();
      pop(); burst(6);
      showBubble('扭到重複的「' + prize.name + '」，退你 ' + refund + ' 金幣 🪙');
    }
    coinsUI();
    if (townActive) renderTown();
  }, 700);
}

function renderTown() {
  const scene = $('#scene');
  let world;
  if (town.loc === 'street') world = streetSVG();
  else if (town.loc === 'home') world = homeSVG();
  else if (town.loc === 'restaurant') world = restaurantSVG();
  else if (town.loc === 'salon') world = salonSVG();
  else if (town.loc === 'school') world = schoolSVG();
  else if (town.loc === 'park') world = parkSVG();
  else if (town.loc === 'convenience') world = convenienceSVG();
  else if (town.loc === 'department') world = departmentSVG();
  else world = shopSVG();
  const dark = (town.loc === 'home' && town.lampOff)
    ? `<rect width="480" height="520" fill="#1a1240" opacity=".5" pointer-events="none"/>` : '';
  const far = town.loc === 'street' ? farSVG() : '';
  const overlay = (town.loc === 'school' && town.quiz && !town.quiz.solved) ? quizChoices(town.quiz) : '';
  scene.innerHTML = `<g id="far">${far}</g><g id="world">${world}</g>` +
    `<ellipse id="playerShadow" fill="#3a2a4a" opacity=".22"/>` +
    `<g id="player">${charSVG(town.napping ? 'sleep' : town.eating ? 'eat' : 'normal')}</g>${dark}` +
    `<g id="overlay">${overlay}</g>`;
  document.body.classList.toggle('inside', town.loc !== 'street');
  updateCam(); updatePlayer();
}
function updateCam() {
  if (town.loc !== 'street') { town.cam = 0; }
  else { town.cam = clamp(town.x - 240, 0, TOWN_W - 480); }
  const w = document.getElementById('world');
  if (w) w.setAttribute('transform', `translate(${-town.cam} 0)`);
  const f = document.getElementById('far');
  if (f) f.setAttribute('transform', `translate(${-town.cam * .4} 0)`);
}
function updatePlayer(bob = 0) {
  const g = document.getElementById('player');
  if (!g) return;
  const w = 360 * CHAR_S;
  const groundY = town.loc === 'street' ? 502 : 508;
  const px = town.x - w / 2 - town.cam;
  const py = groundY - 468 * CHAR_S + bob;
  g.setAttribute('transform', town.facing < 0
    ? `translate(${px + w} ${py}) scale(${-CHAR_S} ${CHAR_S})`
    : `translate(${px} ${py}) scale(${CHAR_S} ${CHAR_S})`);
  const sh = document.getElementById('playerShadow');
  if (sh) {
    const lift = Math.min(1, Math.abs(bob) / 6);
    sh.setAttribute('cx', town.x - town.cam);
    sh.setAttribute('cy', groundY + 4);
    sh.setAttribute('rx', 30 * CHAR_S * (1 - lift * .35));
    sh.setAttribute('ry', 9 * CHAR_S * (1 - lift * .35));
    sh.setAttribute('opacity', .22 - lift * .08);
  }
}
function townLoop() {
  if (!townActive) return;
  const dx = town.tx - town.x;
  if (Math.abs(dx) > 3 && !town.napping) {
    town.facing = dx > 0 ? 1 : -1;
    town.x += Math.sign(dx) * Math.min(3.6, Math.abs(dx));
    town.phase += 0.3;
    updateCam();
    updatePlayer(-Math.abs(Math.sin(town.phase)) * 5);
  } else if (town.entering) {
    const dest = town.entering;
    town.entering = null;
    doorSound();
    town.loc = dest;
    town.quiz = null;
    town.riding = false;
    stopCarouselSparkles();
    town.x = town.tx = 240;
    renderTown();
    if (dest === 'shop' || dest === 'salon') completeTask(dest);
  }
  if (town.loc === 'park' && town.riding) {
    town.ridePhase += 0.15;
    updateCarouselBob();
  }
}
function spawnCoins() {
  town.coinSpots = [];
  for (let i = 0; i < 3; i++) town.coinSpots.push(90 + Math.random() * (TOWN_W - 180));
}
function handleAct(d) {
  if (d.act === 'door') { town.tx = +d.x; town.entering = d.loc; }
  else if (d.act === 'soon') { town.tx = +d.x; doorSound(); showBubble('這裡快開幕了，敬請期待 🔨'); }
  else if (d.act === 'coin') {
    town.coinSpots.splice(+d.i, 1);
    state.coins = (state.coins || 0) + 2;
    saveState(); coinsUI(); ding(); burst(4);
    renderTown();
  }
  else if (d.act === 'wardrobe') { doorSound(); setTown(false); showBubble('歡迎回到衣櫥 💕'); }
  else if (d.act === 'bed') { town.napping = true; renderTown(); lullaby(); zzz(); completeTask('home'); }
  else if (d.act === 'lamp') { town.lampOff = !town.lampOff; tone(520, 520, .06); renderTown(); }
  else if (d.act === 'teddy') { showBubble('🧸 抱抱！'); pop(); burst(5); }
  else if (d.act === 'room') { pickRoom(d.id); }
  else if (d.act === 'buy') { buyItem(d.id); }
  else if (d.act === 'food') { eatFood(d.id); }
  else if (d.act === 'haircolor') {
    state.hairColor = d.color;
    saveState(); snip(); burst(5);
    renderTown();
  }
  else if (d.act === 'quiz-start') { clearTimeout(quizTimer); town.quiz = genQuiz(); renderTown(); pop(); }
  else if (d.act === 'quiz-answer') { answerQuiz(+d.idx); }
  else if (d.act === 'carousel-toggle') {
    town.riding = !town.riding;
    if (town.riding) { chime(); startCarouselSparkles(); completeTask('park'); }
    else { pop(); stopCarouselSparkles(); }
    renderTown();
  }
  else if (d.act === 'balloon') { popBalloon(+d.i); }
  else if (d.act === 'gacha') { playGacha(); }
}
function answerQuiz(idx) {
  const q = town.quiz;
  if (!q || q.solved) return;
  const val = q.choices[idx];
  if (val === q.correct) {
    q.solved = true;
    const reward = q.reward || 5;
    state.coins = (state.coins || 0) + reward;
    saveState(); coinsUI(); chaching(); burst(14);
    showBubble('答對了！+' + reward + ' 金幣 🎉');
    renderTown();
    completeTask('school');
    clearTimeout(quizTimer);
    quizTimer = setTimeout(() => { town.quiz = null; if (townActive) renderTown(); }, 1400);
  } else {
    tone(300, 220, .15);
    showBubble('再想想看，你可以的 💪');
  }
}
function pickRoom(id) {
  const room = ROOMS.find(r => r.id === id);
  if (!room) return;
  if (state.room === id) { showBubble('已經是這個房間囉 💕'); pop(); return; }
  if (state.ownedRooms.includes(id)) {
    state.room = id;
    saveState(); pop(); burst(6);
    renderTown();
    return;
  }
  if ((state.coins || 0) >= room.price) {
    state.coins -= room.price;
    state.ownedRooms.push(id);
    state.room = id;
    saveState(); coinsUI(); chaching(); burst(12);
    renderTown();
    showBubble(room.name + ' 佈置好了！💕');
  } else {
    tone(300, 220, .18);
    showBubble(`還差 ${room.price - state.coins} 個金幣，去街上找找 🪙`);
  }
}
function buyItem(id) {
  const item = [...DRESSES, ...ACCS, ...HAIRS, ...PETS].find(i => i.id === id);
  if (!item) return;
  if (!isLocked(item)) { showBubble('已經買過囉 ✔'); pop(); return; }
  if ((state.coins || 0) >= item.price) {
    state.coins -= item.price;
    state.owned.push(item.id);
    if (DRESSES.includes(item)) state.dress = item.id;
    else if (HAIRS.includes(item)) state.hair = item.id;
    else if (PETS.includes(item)) state.pet = item.id;
    else if (!state.accs.includes(item.id)) state.accs.push(item.id);
    saveState(); coinsUI(); chaching(); burst(12);
    renderTown();
    showBubble(item.name + ' 買到了，直接穿上囉 💕');
  } else {
    tone(300, 220, .18);
    showBubble(`還差 ${item.price - state.coins} 個金幣，去街上找找 🪙`);
  }
}
let eatTimer = null;
let quizTimer = null;
function chomp() {
  tone(240, 180, .08);
  setTimeout(() => tone(260, 200, .08), 140);
  setTimeout(() => tone(280, 220, .1), 280);
}
function snip() {
  tone(1200, 1600, .05);
  setTimeout(() => tone(1000, 1400, .05), 90);
}
function eatFood(id) {
  const food = FOODS.find(f => f.id === id);
  if (!food) return;
  if ((state.coins || 0) < food.price) {
    tone(300, 220, .18);
    showBubble(`還差 ${food.price - (state.coins || 0)} 個金幣，去街上找找 🪙`);
    return;
  }
  state.coins -= food.price;
  saveState(); coinsUI(); chaching();
  town.eating = true;
  renderTown();
  chomp(); burst(6);
  showBubble(food.name + ' 好好吃 😋');
  completeTask('restaurant');
  clearTimeout(eatTimer);
  eatTimer = setTimeout(() => {
    town.eating = false;
    if (townActive) renderTown();
  }, 900);
}
function zzz() {
  clearInterval(zzzTimer);
  zzzTimer = setInterval(() => {
    if (!town.napping || !townActive) { clearInterval(zzzTimer); return; }
    const s = document.createElement('span');
    s.className = 'spark';
    s.textContent = '💤';
    s.style.left = (62 + Math.random() * 10) + '%';
    s.style.top = (32 + Math.random() * 8) + '%';
    $('#sparkles').appendChild(s);
    setTimeout(() => s.remove(), 1300);
  }, 750);
}
function setTown(on) {
  townActive = on;
  document.body.classList.toggle('town', on);
  $('#btn-town').textContent = on ? '👗' : '🏘️';
  clearInterval(loopTimer);
  if (on) {
    $('#scene').setAttribute('viewBox', '0 0 480 520');
    if (town.loc === 'street' && town.coinSpots.length === 0) spawnCoins();
    renderTown();
    loopTimer = setInterval(townLoop, 16);
  } else {
    document.body.classList.remove('inside');
    $('#scene').setAttribute('viewBox', '0 0 360 520');
    renderScene(); renderPanel();
  }
}
$('#btn-town').addEventListener('click', () => setTown(!townActive));
$('#btn-tasks').addEventListener('click', () => {
  renderTaskPanel();
  $('#taskPanel').classList.add('open');
  pop();
});
$('#btn-task-close').addEventListener('click', () => $('#taskPanel').classList.remove('open'));
$('#taskPanel').addEventListener('click', e => {
  if (e.target.id === 'taskPanel') $('#taskPanel').classList.remove('open');
});
$('#btn-back').addEventListener('click', () => {
  const from = town.loc;
  town.napping = false;
  town.quiz = null;
  town.riding = false;
  stopCarouselSparkles();
  town.loc = 'street';
  town.x = town.tx = DOOR_X[from] || 200;
  spawnCoins();
  doorSound();
  renderTown();
});
$('#scene').addEventListener('click', e => {
  if (!townActive) return;
  if (town.napping) { town.napping = false; renderTown(); return; }
  const t = e.target.closest('[data-act]');
  if (t) { handleAct(t.dataset); return; }
  const r = $('#scene').getBoundingClientRect();
  const vx = (e.clientX - r.left) / r.width * 480;
  const wx = town.loc === 'street' ? vx + town.cam : vx;
  town.tx = clamp(wx, 50, town.loc === 'street' ? TOWN_W - 50 : 430);
});

/* ---------- 啟動 ---------- */
$('#btn-sound').textContent = muted ? '🔇' : '🔊';
coinsUI();
renderScene();
renderPanel();
renderTaskPanel();

// 本機開發不註冊，避免快取蓋掉修改；正式站（GitHub Pages）才啟用離線快取
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
