/* ═══════════════════════════════════════════════
   GLOBALS
═══════════════════════════════════════════════ */
let DATA = null;
let LANG = 'pt';
let ACTIVE_MEMBER_ID = 'handy'; // current perspective
let PV_PER_MEMBER = 10000;      // simulated monthly PV per person

// Network state: array of member objects
let NETWORK = [];
let nextId = 100;

const COLORS = ['#7c3aed','#ec4899','#06b6d4','#10b981','#f59e0b','#6366f1','#ef4444','#8b5cf6','#0ea5e9','#14b8a6'];

/* ═══════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════ */
const TR = {
  pt: {
    simLabel: 'Simulador Dinâmico',
    simTitle: 'Simulador de <span>Rede & Ganhos</span>',
    simDesc: 'Adicione ou remova membros e veja em tempo real quanto cada pessoa da rede vai ganhar. Clique em qualquer pessoa para ver sua perspectiva.',
    viewAs: 'Visualizando como',
    viewAsSub: 'Clique em um membro para mudar a perspectiva',
    perspLabel: 'Ver ganhos de:',
    pvLabel: 'PV médio por membro/mês',
    addTitle: 'Adicionar membro à rede',
    btnAdd: 'Adicionar Membro',
    btnReset: 'Resetar Rede',
    legYou: 'Você (Handy)',
    legActive: 'Ativo',
    legFuture: 'Potencial',
    sponsor: 'Patrocinador',
    leg: 'Perna',
    legLeft: '← Esq.',
    legRight: 'Dir. →',
    weekly: 'Comissão Semanal Est.',
    monthly: 'Comissão Mensal Est.',
    annual: 'Projeção Anual',
    leftLeg: '← Perna Esq.',
    rightLeg: 'Perna Dir. →',
    membersLT: 'Membros na rede',
    directDown: 'Downlines diretos',
    totalPV: 'PV total da rede',
    weakLeg: 'Perna fraca (base comissão)',
    currentLevel: 'Nível atual',
    netMembers: 'Membros na rede:',
    membersListTitle: 'Todos os membros da rede',
    removedMsg: 'Membro removido da rede.',
    addedMsg: 'Membro adicionado com sucesso!',
    errName: 'Digite um nome.',
    errSponsor: 'Selecione um patrocinador.',
    errLegFull: 'Essa perna já está ocupada. Escolha outra.',
    youLabel: 'Você',
    pvUnit: 'PV',
    countryPH: 'País (ex: Brasil)',
  },
  fr: {
    simLabel: 'Simulateur Dynamique',
    simTitle: 'Simulateur de <span>Réseau & Gains</span>',
    simDesc: 'Ajoutez ou supprimez des membres et voyez en temps réel combien chaque personne du réseau gagnera. Cliquez sur n\'importe qui pour changer de perspective.',
    viewAs: 'Visualisation en tant que',
    viewAsSub: 'Cliquez sur un membre pour changer de perspective',
    perspLabel: 'Voir les gains de:',
    pvLabel: 'PV moyen par membre/mois',
    addTitle: 'Ajouter un membre au réseau',
    btnAdd: 'Ajouter un Membre',
    btnReset: 'Réinitialiser',
    legYou: 'Vous (Handy)',
    legActive: 'Actif',
    legFuture: 'Potentiel',
    sponsor: 'Parrain',
    leg: 'Branche',
    legLeft: '← Gauche',
    legRight: 'Droite →',
    weekly: 'Commission Hebdomadaire Est.',
    monthly: 'Commission Mensuelle Est.',
    annual: 'Projection Annuelle',
    leftLeg: '← Branche G.',
    rightLeg: 'Branche D. →',
    membersLT: 'Membres dans le réseau',
    directDown: 'Downlines directs',
    totalPV: 'PV total du réseau',
    weakLeg: 'Branche faible (base commission)',
    currentLevel: 'Niveau actuel',
    netMembers: 'Membres dans le réseau:',
    membersListTitle: 'Tous les membres du réseau',
    removedMsg: 'Membre retiré du réseau.',
    addedMsg: 'Membre ajouté avec succès!',
    errName: 'Entrez un nom.',
    errSponsor: 'Sélectionnez un parrain.',
    errLegFull: 'Cette branche est déjà occupée. Choisissez une autre.',
    youLabel: 'Vous',
    pvUnit: 'PV',
    countryPH: 'Pays (ex: France)',
  },
  en: {
    simLabel: 'Dynamic Simulator',
    simTitle: 'Network & <span>Earnings Simulator</span>',
    simDesc: 'Add or remove members and see in real time how much each person in the network will earn. Click on anyone to see their perspective.',
    viewAs: 'Viewing as',
    viewAsSub: 'Click a member to change perspective',
    perspLabel: 'View earnings of:',
    pvLabel: 'Average PV per member/month',
    addTitle: 'Add member to network',
    btnAdd: 'Add Member',
    btnReset: 'Reset Network',
    legYou: 'You (Handy)',
    legActive: 'Active',
    legFuture: 'Potential',
    sponsor: 'Sponsor',
    leg: 'Leg',
    legLeft: '← Left',
    legRight: 'Right →',
    weekly: 'Est. Weekly Commission',
    monthly: 'Est. Monthly Commission',
    annual: 'Annual Projection',
    leftLeg: '← Left Leg',
    rightLeg: 'Right Leg →',
    membersLT: 'Members in network',
    directDown: 'Direct downlines',
    totalPV: 'Total network PV',
    weakLeg: 'Weak leg (commission base)',
    currentLevel: 'Current level',
    netMembers: 'Network members:',
    membersListTitle: 'All network members',
    removedMsg: 'Member removed from network.',
    addedMsg: 'Member added successfully!',
    errName: 'Enter a name.',
    errSponsor: 'Select a sponsor.',
    errLegFull: 'That leg is already occupied. Choose another.',
    youLabel: 'You',
    pvUnit: 'PV',
    countryPH: 'Country (e.g. USA)',
  }
};

const tr = () => TR[LANG];

/* ═══════════════════════════════════════════════
   DATA LOAD
═══════════════════════════════════════════════ */
async function loadData() {
  const res = await fetch('data.json');
  DATA = await res.json();
}
const tl = (obj) => obj && obj[LANG] ? obj[LANG] : obj && obj['pt'] ? obj['pt'] : '';

/* ═══════════════════════════════════════════════
   INITIAL NETWORK — Família do Handy
═══════════════════════════════════════════════ */
function buildInitialNetwork() {
  return [
    { id:'irma',     name:'Soeur',    country:'🇺🇸 EUA',    pv:30000, sponsorId:null,   leg:null,    color:'#8b5cf6', isYou:false, isPermanent:true },
    { id:'mae',      name:'Maman',     country:'🇺🇸 EUA',    pv:15000, sponsorId:'irma',  leg:'left',  color:'#ec4899', isYou:false, isPermanent:true },
    { id:'irmao',    name:'Frère',   country:'🇭🇹 Haiti',  pv:15000, sponsorId:'irma',  leg:'right', color:'#0ea5e9', isYou:false, isPermanent:true },
    { id:'handy',    name:'Handy',   country:'🇧🇷 Brasil', pv:20000, sponsorId:'irmao', leg:'left',  color:'#10b981', isYou:true,  isPermanent:true },
    { id:'primo_br', name:'Cousin BR',country:'🇧🇷 Brasil', pv:10000, sponsorId:'handy', leg:'left',  color:'#f59e0b', isYou:false, isPermanent:false },
    { id:'primo_eua',name:'Cousin EUA',country:'🇺🇸 EUA',  pv:10000, sponsorId:'handy', leg:'right', color:'#f59e0b', isYou:false, isPermanent:false },
  ];
}

/* ═══════════════════════════════════════════════
   NETWORK CALCULATIONS
═══════════════════════════════════════════════ */

// Get all descendants of a node
function getDescendants(memberId, network) {
  const desc = [];
  const queue = network.filter(m => m.sponsorId === memberId);
  while (queue.length) {
    const m = queue.shift();
    desc.push(m);
    network.filter(n => n.sponsorId === m.id).forEach(c => queue.push(c));
  }
  return desc;
}

// Get the two direct children (left/right)
function getDirectChildren(memberId, network) {
  const children = network.filter(m => m.sponsorId === memberId);
  const left  = children.find(m => m.leg === 'left')  || null;
  const right = children.find(m => m.leg === 'right') || null;
  return { left, right };
}

// Sum PV of a subtree (node + all descendants)
function subtreePV(memberId, network, pvPerMember) {
  const node = network.find(m => m.id === memberId);
  if (!node) return 0;
  const desc = getDescendants(memberId, network);
  return pvPerMember + desc.reduce((s) => s + pvPerMember, 0);
}

// Calculate legs PV for a given member
function calcLegs(memberId, network, pvPerMember) {
  const { left, right } = getDirectChildren(memberId, network);
  const leftPV  = left  ? subtreePV(left.id,  network, pvPerMember) : 0;
  const rightPV = right ? subtreePV(right.id, network, pvPerMember) : 0;
  return { leftPV, rightPV, weakPV: Math.min(leftPV, rightPV) };
}

// Get personal cumulative PV
function personalPV(memberId, network, pvPerMember) {
  const node = network.find(m => m.id === memberId);
  return node ? pvPerMember : 0;
}

// Determine level based on personal PV
function getLevel(pvPersonal) {
  if (pvPersonal < 10000)   return { name: { pt:'Inativo', fr:'Inactif', en:'Inactive' }, color:'#6b7280', emoji:'⚪' };
  if (pvPersonal < 300000)  return { name: { pt:'Representante', fr:'Représentant', en:'Sales Rep.' }, color:'#6b7280', emoji:'🌱' };
  if (pvPersonal < 700000)  return { name: { pt:'Agente', fr:'Agent', en:'Agent' }, color:'#3b82f6', emoji:'📈' };
  if (pvPersonal < 1500000) return { name: { pt:'Agente Especial', fr:'Agent Spécial', en:'Special Agent' }, color:'#8b5cf6', emoji:'⭐' };
  if (pvPersonal < 2400000) return { name: { pt:'Distribuidor', fr:'Distributeur', en:'Distributor' }, color:'#f59e0b', emoji:'💫' };
  return                     { name: { pt:'Dist. Exclusivo', fr:'Dist. Exclusif', en:'Excl. Dist.' }, color:'#ef4444', emoji:'🔥' };
}

// Main earnings calc for a member
function calcEarnings(memberId, network, pvPerMember) {
  const { leftPV, rightPV, weakPV } = calcLegs(memberId, network, pvPerMember);
  const desc = getDescendants(memberId, network);
  const totalNetworkPV = desc.reduce((s) => s + pvPerMember, 0);

  // 44% of total PV goes to commissions, distributed among all qualified nodes
  // Simplified model: member earns 5.5% of their weak leg PV per week (reflects Atomy's binary model)
  const weeklyCommission = weakPV * 0.055;
  const monthlyCommission = weeklyCommission * 4;
  const annualCommission = monthlyCommission * 12;

  const personalPVval = pvPerMember; // simplified: 1 month
  const level = getLevel(personalPVval * 12); // project 12 months

  return {
    leftPV, rightPV, weakPV,
    weeklyCommission, monthlyCommission, annualCommission,
    totalNetworkPV, networkCount: desc.length,
    directCount: network.filter(m => m.sponsorId === memberId).length,
    level
  };
}

/* ═══════════════════════════════════════════════
   SVG TREE RENDERER
═══════════════════════════════════════════════ */
const NODE_W = 130, NODE_H = 70, H_GAP = 20, V_GAP = 90;

function buildTreeLayout(rootId, network) {
  // BFS layout
  const nodes = [];
  const edges = [];
  const posMap = {};

  function layoutNode(id, depth, xOffset) {
    const member = network.find(m => m.id === id);
    if (!member) return 0;
    const { left, right } = getDirectChildren(id, network);
    const children = [left, right].filter(Boolean);

    if (children.length === 0) {
      posMap[id] = { x: xOffset, y: depth };
      nodes.push({ member, x: xOffset, y: depth });
      return NODE_W + H_GAP;
    }

    let totalW = 0;
    let childXStart = xOffset;
    const childPositions = [];

    for (const child of children) {
      const w = layoutNode(child.id, depth + 1, childXStart);
      childPositions.push({ id: child.id, x: childXStart, w });
      childXStart += w;
      totalW += w;
    }

    // Center parent over children
    const firstChildX = posMap[childPositions[0].id]?.x ?? xOffset;
    const lastChildX  = posMap[childPositions[childPositions.length-1].id]?.x ?? xOffset;
    const parentX = (firstChildX + lastChildX) / 2;
    posMap[id] = { x: parentX, y: depth };
    nodes.push({ member, x: parentX, y: depth });

    // Add edges
    for (const child of children) {
      const cp = posMap[child.id];
      if (cp) edges.push({ from: id, to: child.id, leg: child.leg });
    }

    return Math.max(totalW, NODE_W + H_GAP);
  }

  layoutNode(rootId, 0, 0);
  return { nodes, edges, posMap };
}

function renderTree() {
  const svg = document.getElementById('network-tree');
  const wrap = document.getElementById('tree-svg-wrap');

  // Find root (the person with no sponsor = irma)
  const root = NETWORK.find(m => !m.sponsorId);
  if (!root) { svg.innerHTML = ''; return; }

  const { nodes, edges, posMap } = buildTreeLayout(root.id, NETWORK);

  if (nodes.length === 0) return;

  const xs = nodes.map(n => n.x);
  const ys = nodes.map(n => n.y);
  const minX = Math.min(...xs) - NODE_W/2 - 10;
  const maxX = Math.max(...xs) + NODE_W/2 + 10;
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const svgW = maxX - minX + 20;
  const svgH = (maxY - minY + 1) * (NODE_H + V_GAP) + 40;

  svg.setAttribute('width', Math.max(svgW, 400));
  svg.setAttribute('height', svgH);
  svg.setAttribute('viewBox', `${minX} -20 ${svgW} ${svgH}`);

  let html = '';

  // Draw edges first
  for (const edge of edges) {
    const fp = posMap[edge.from];
    const tp = posMap[edge.to];
    if (!fp || !tp) continue;
    const x1 = fp.x;
    const y1 = fp.y * (NODE_H + V_GAP) + NODE_H;
    const x2 = tp.x;
    const y2 = tp.y * (NODE_H + V_GAP);
    const midY = (y1 + y2) / 2;
    const isActive = ACTIVE_MEMBER_ID === edge.from || ACTIVE_MEMBER_ID === edge.to;
    html += `<path class="tree-edge${isActive ? ' highlight' : ''}" d="M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}"/>`;

    // Leg label
    const lx = (x1+x2)/2, ly = (y1+y2)/2;
    const legTxt = edge.leg === 'left' ? '←' : '→';
    html += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="9" fill="rgba(124,58,237,.6)" font-family="Syne,sans-serif">${legTxt}</text>`;
  }

  // Draw nodes
  for (const { member, x, y } of nodes) {
    const px = x;
    const py = y * (NODE_H + V_GAP);
    const isActive = member.id === ACTIVE_MEMBER_ID;
    const isYou = member.isYou;
    const isFuture = member.isPermanent === false && member.pv < 10000;
    const initials = member.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    const ringColor = isYou ? 'var(--green)' : isActive ? 'var(--accent2)' : member.color;
    const ringW = isActive || isYou ? 2.5 : 1.5;
    const dashArr = isFuture ? '4 3' : 'none';

    html += `
      <g class="tree-node" data-id="${member.id}" onclick="setPerspective('${member.id}')">
        <rect class="node-bg${isActive ? ' active-node' : ''}" x="${px-NODE_W/2}" y="${py}" width="${NODE_W}" height="${NODE_H}" rx="10"
          fill="${isActive ? 'rgba(124,58,237,.15)' : 'var(--bg3)'}" stroke="${ringColor}" stroke-width="${ringW}" stroke-dasharray="${dashArr}"/>
        <!-- Avatar circle -->
        <circle cx="${px-40}" cy="${py+NODE_H/2}" r="18" fill="${member.color}22"/>
        <text x="${px-40}" y="${py+NODE_H/2+4}" text-anchor="middle" class="node-label" fill="${member.color}">${initials}</text>
        <!-- Info -->
        <text x="${px-16}" y="${py+20}" class="node-label" text-anchor="start">${member.name.length > 10 ? member.name.slice(0,9)+'…' : member.name}</text>
        <text x="${px-16}" y="${py+33}" class="node-sub" text-anchor="start">${member.country.slice(0,12)}</text>
        <text x="${px-16}" y="${py+47}" class="node-pv" text-anchor="start">${(member.pv/1000).toFixed(0)}k PV</text>
        ${isYou ? `<text x="${px+NODE_W/2-6}" y="${py+14}" text-anchor="end" font-size="8" fill="var(--green)" font-family="Syne,sans-serif">★YOU</text>` : ''}
        ${isActive && !isYou ? `<circle cx="${px+NODE_W/2-8}" cy="${py+12}" r="5" fill="var(--accent2)"/>` : ''}
      </g>`;
  }

  svg.innerHTML = html;
}

/* ═══════════════════════════════════════════════
   EARNINGS PANEL RENDER
═══════════════════════════════════════════════ */
function renderEarnings() {
  const member = NETWORK.find(m => m.id === ACTIVE_MEMBER_ID);
  if (!member) return;
  const T = tr();
  const e = calcEarnings(ACTIVE_MEMBER_ID, NETWORK, PV_PER_MEMBER);
  const fmtBRL = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const fmtPV  = v => v.toLocaleString('pt-BR') + ' PV';
  const levelName = tl(e.level.name);

  document.getElementById('earnings-panel').innerHTML = `
    <div class="earnings-who">
      <div class="earnings-avatar" style="background:${member.color}22;color:${member.color}">${member.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
      <div>
        <div class="earnings-name">${member.name} ${member.isYou ? `<span style="font-size:.7rem;color:var(--green)">(${T.youLabel})</span>` : ''}</div>
        <div class="earnings-role">${member.country}</div>
      </div>
    </div>

    <div class="legs-info">
      <div class="leg-card">
        <div class="leg-label">${T.leftLeg}</div>
        <div class="leg-val">${fmtPV(e.leftPV)}</div>
        <div class="leg-count">${NETWORK.filter(m=>m.sponsorId===member.id&&m.leg==='left').length + getDescendants(NETWORK.find(m=>m.sponsorId===member.id&&m.leg==='left')?.id||'__', NETWORK).length} membros</div>
      </div>
      <div class="leg-card">
        <div class="leg-label">${T.rightLeg}</div>
        <div class="leg-val">${fmtPV(e.rightPV)}</div>
        <div class="leg-count">${NETWORK.filter(m=>m.sponsorId===member.id&&m.leg==='right').length + getDescendants(NETWORK.find(m=>m.sponsorId===member.id&&m.leg==='right')?.id||'__', NETWORK).length} membros</div>
      </div>
    </div>

    <div class="earnings-grid">
      <div class="earn-card weekly">
        <div class="earn-label">${T.weekly}</div>
        <div class="earn-value up">${fmtBRL(e.weeklyCommission)}</div>
        <div class="earn-sub">${T.weakLeg}: ${fmtPV(e.weakPV)}</div>
      </div>
      <div class="earn-card monthly">
        <div class="earn-label">${T.monthly}</div>
        <div class="earn-value up">${fmtBRL(e.monthlyCommission)}</div>
        <div class="earn-sub">× 4 semanas</div>
      </div>
      <div class="earn-card total">
        <div class="earn-label">${T.annual}</div>
        <div class="earn-value up" style="font-size:1.7rem">${fmtBRL(e.annualCommission)}</div>
        <div class="earn-sub">${T.netMembers} ${e.networkCount} | ${T.directDown}: ${e.directCount}</div>
      </div>
    </div>

    <div class="level-badge" style="border-color:${e.level.color}44;color:${e.level.color};margin-bottom:12px;">
      ${e.level.emoji} ${T.currentLevel}: <strong>${levelName}</strong>
    </div>

    <div class="net-summary">
      <strong>${T.totalPV}:</strong> ${fmtPV(e.totalNetworkPV + PV_PER_MEMBER)}<br>
      <strong>${T.directDown}:</strong> ${e.directCount} | 
      <strong>${T.membersLT}:</strong> ${e.networkCount}
    </div>
  `;
}

/* ═══════════════════════════════════════════════
   PERSPECTIVE
═══════════════════════════════════════════════ */
function setPerspective(id) {
  ACTIVE_MEMBER_ID = id;
  document.getElementById('persp-select').value = id;
  renderTree();
  renderEarnings();
  renderMembersList();
}

/* ═══════════════════════════════════════════════
   MEMBERS LIST
═══════════════════════════════════════════════ */
function renderMembersList() {
  const T = tr();
  const el = document.getElementById('members-list');
  el.innerHTML = NETWORK.map(m => {
    const desc = getDescendants(m.id, NETWORK);
    const isActive = m.id === ACTIVE_MEMBER_ID;
    const canDelete = !m.isPermanent;
    return `
      <div class="member-row${isActive ? ' active-member' : ''}">
        <div class="mrow-avatar" style="background:${m.color}22;color:${m.color}">${m.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
        <div class="mrow-info">
          <div class="mrow-name">${m.name} ${m.isYou ? '⭐' : ''}</div>
          <div class="mrow-meta">${m.country} · ${desc.length} downlines</div>
        </div>
        <div class="mrow-pv">${(m.pv/1000).toFixed(0)}k PV</div>
        <div class="mrow-view" onclick="setPerspective('${m.id}')" title="Ver perspectiva">👁</div>
        ${canDelete ? `<div class="mrow-del" onclick="removeMember('${m.id}')" title="Remover">✕</div>` : '<div style="width:28px"></div>'}
      </div>`;
  }).join('');
}

/* ═══════════════════════════════════════════════
   ADD MEMBER
═══════════════════════════════════════════════ */
function buildSponsorSelect() {
  const T = tr();
  const sel = document.getElementById('inp-sponsor');
  sel.innerHTML = `<option value="">${T.sponsor}...</option>` +
    NETWORK.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
}

function buildPerspSelect() {
  const T = tr();
  const sel = document.getElementById('persp-select');
  const cur = sel.value;
  sel.innerHTML = NETWORK.map(m =>
    `<option value="${m.id}"${m.id === ACTIVE_MEMBER_ID ? ' selected' : ''}>${m.name}${m.isYou ? ' ★' : ''}</option>`
  ).join('');
  if (NETWORK.find(m => m.id === cur)) sel.value = cur;
}

function addMember() {
  const T = tr();
  const name    = document.getElementById('inp-name').value.trim();
  const country = document.getElementById('inp-country').value.trim() || '🌍';
  const pvRaw   = parseInt(document.getElementById('inp-pv').value) || 10000;
  const sponsor = document.getElementById('inp-sponsor').value;
  const leg     = document.getElementById('inp-leg').value;

  if (!name)    { showToast(T.errName, 'error'); return; }
  if (!sponsor) { showToast(T.errSponsor, 'error'); return; }

  // Check if that leg is already taken
  const legTaken = NETWORK.find(m => m.sponsorId === sponsor && m.leg === leg);
  if (legTaken) { showToast(T.errLegFull, 'error'); return; }

  const color = COLORS[nextId % COLORS.length];
  const newM = {
    id: 'member_' + (nextId++),
    name, country, pv: pvRaw, sponsorId: sponsor, leg,
    color, isYou: false, isPermanent: false
  };
  NETWORK.push(newM);

  document.getElementById('inp-name').value = '';
  document.getElementById('inp-pv').value = '10000';

  buildSponsorSelect();
  buildPerspSelect();
  renderTree();
  renderEarnings();
  renderMembersList();
  showToast(T.addedMsg, 'success');
}

/* ═══════════════════════════════════════════════
   REMOVE MEMBER
═══════════════════════════════════════════════ */
function removeMember(id) {
  const T = tr();
  const member = NETWORK.find(m => m.id === id);
  if (!member || member.isPermanent) return;

  // Also remove all descendants
  const desc = getDescendants(id, NETWORK);
  const toRemove = new Set([id, ...desc.map(m => m.id)]);
  NETWORK = NETWORK.filter(m => !toRemove.has(m.id));

  if (ACTIVE_MEMBER_ID === id || toRemove.has(ACTIVE_MEMBER_ID)) {
    ACTIVE_MEMBER_ID = 'handy';
  }

  buildSponsorSelect();
  buildPerspSelect();
  renderTree();
  renderEarnings();
  renderMembersList();
  showToast(T.removedMsg, 'success');
}

/* ═══════════════════════════════════════════════
   RESET
═══════════════════════════════════════════════ */
function resetNetwork() {
  NETWORK = buildInitialNetwork();
  ACTIVE_MEMBER_ID = 'handy';
  nextId = 100;
  buildSponsorSelect();
  buildPerspSelect();
  renderTree();
  renderEarnings();
  renderMembersList();
}

/* ═══════════════════════════════════════════════
   PV SLIDER
═══════════════════════════════════════════════ */
function initSlider() {
  const slider = document.getElementById('pv-slider');
  const display = document.getElementById('pv-display');
  slider.addEventListener('input', () => {
    PV_PER_MEMBER = parseInt(slider.value);
    display.textContent = PV_PER_MEMBER.toLocaleString('pt-BR') + ' PV';
    // Update all member PVs proportionally
    NETWORK.forEach(m => m.pv = PV_PER_MEMBER);
    renderTree();
    renderEarnings();
    renderMembersList();
  });
  // gradient fill
  slider.addEventListener('input', updateSliderFill);
  updateSliderFill();
}

function updateSliderFill() {
  const slider = document.getElementById('pv-slider');
  const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--bg5) ${pct}%)`;
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, type='success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ═══════════════════════════════════════════════
   STATIC RENDER (all sections except simulator)
═══════════════════════════════════════════════ */
function renderStatic() {
  const ui = DATA.ui[LANG];
  const c  = DATA.content;
  const T  = tr();

  // Header
  document.getElementById('hdr-badge').textContent    = ui.header.badge;
  document.getElementById('hdr-title').innerHTML      = ui.header.title;
  document.getElementById('hdr-subtitle').textContent = ui.header.subtitle;
  document.getElementById('header-stats').innerHTML   = ui.stats.map(s =>
    `<div class="stat-pill"><strong>${s.value}</strong>&nbsp;${s.label}</div>`).join('');

  // Section headers
  ['empresa','diferenciais','passos','pontos','niveis','maestrias','comissoes','produtos'].forEach(id => {
    const sec = ui.sections[id];
    const l = document.getElementById('lbl-'+id);
    const t2 = document.getElementById('ttl-'+id);
    const d = document.getElementById('desc-'+id);
    if(l) l.textContent = sec.label;
    if(t2) t2.innerHTML  = sec.title;
    if(d) d.textContent = sec.desc||'';
  });

  // Simulator section
  document.getElementById('lbl-simulador').textContent = T.simLabel;
  document.getElementById('ttl-simulador').innerHTML   = T.simTitle;
  document.getElementById('desc-simulador').textContent = T.simDesc;
  document.getElementById('sim-view-as-label').textContent = T.viewAs;
  document.getElementById('sim-view-as-sub').textContent   = T.viewAsSub;
  document.getElementById('sim-persp-label').textContent   = T.perspLabel;
  document.getElementById('sim-pv-label').textContent      = T.pvLabel;
  document.getElementById('sim-add-title').textContent     = T.addTitle;
  document.getElementById('btn-add-label').textContent     = T.btnAdd;
  document.getElementById('btn-reset-label').textContent   = T.btnReset;
  document.getElementById('leg-you').textContent   = T.legYou;
  document.getElementById('leg-active').textContent = T.legActive;
  document.getElementById('leg-future').textContent = T.legFuture;
  document.getElementById('members-list-title').textContent = T.membersListTitle;
  document.getElementById('opt-left').textContent  = T.legLeft;
  document.getElementById('opt-right').textContent = T.legRight;
  document.getElementById('inp-country').placeholder = T.countryPH;

  // Footer
  document.getElementById('footer-text').innerHTML = ui.footer;

  // EMPRESA
  document.getElementById('empresa-grid').innerHTML = `
    <div class="empresa-card">
      <div class="empresa-logo">Atomy</div>
      <div class="empresa-slogan">"${tl(c.empresa.slogan)}"</div>
      <p class="empresa-desc">${tl(c.empresa.descricao)}</p>
    </div>
    <div class="empresa-card">
      <ul class="info-list">${ui.empresaInfo.map(r=>`<li><span class="label">${r.label}</span><span class="value">${r.value}</span></li>`).join('')}</ul>
    </div>`;

  // DIFERENCIAIS
  document.getElementById('diff-grid').innerHTML = c.diferenciais.map(d =>
    `<div class="diff-card"><div class="diff-icon">${d.icone}</div><div class="diff-title">${tl(d.titulo)}</div><p class="diff-desc">${tl(d.descricao)}</p></div>`
  ).join('');

  // PASSOS
  document.getElementById('steps-container').innerHTML = c.passoAPasso.map(p =>
    `<div class="step"><div class="step-left"><div class="step-num">${p.numero}</div><div class="step-line"></div></div>
    <div class="step-content"><div class="step-title">${tl(p.titulo)}</div><p class="step-desc">${tl(p.descricao)}</p><div class="step-dica">${tl(p.dica)}</div></div></div>`
  ).join('');

  // PONTOS
  document.getElementById('desc-pontos').textContent = tl(c.sistemaPontos.descricao);
  document.getElementById('pontos-grid').innerHTML = c.sistemaPontos.tipos.map((tp,i) =>
    `<div class="ponto-card ${i===0?'pessoal':'grupal'}"><div class="ponto-name">${tl(tp.nome)}</div><p class="ponto-desc">${tl(tp.descricao)}</p></div>`
  ).join('');

  // NÍVEIS
  document.getElementById('niveis-list').innerHTML = c.niveis.map(n =>
    `<div class="nivel-item"><div class="nivel-emoji">${n.emoji}</div><div>
    <div class="nivel-name" style="color:${n.cor}">${tl(n.titulo)}</div>
    <div class="nivel-desc">${tl(n.descricao)}</div></div>
    <div class="nivel-pv">${n.pvMinimo}${n.pvMaximo!=='∞'?' → '+n.pvMaximo:'+'}</div></div>`
  ).join('');

  // MAESTRIAS
  document.getElementById('maestrias-grid').innerHTML = c.maestrias.map(m =>
    `<div class="maestria-card" style="border-top:4px solid ${m.cor};border-top-color:${m.cor};border-color:${m.cor}22">
    <div class="maestria-titulo" style="color:${m.cor}">${m.titulo}</div>
    <div class="maestria-bonus">${ui.bonusLabel}: ${tl(m.bonus)}</div>
    <div class="maestria-ganho">${m.ganhoEstimado}</div>
    <div class="maestria-req"><strong>${ui.reqLabel}</strong>${tl(m.requisito)}</div>
    <div class="beneficios-list">${tl(m.beneficios).map(b=>`<div class="beneficio-item">${b}</div>`).join('')}</div>
    </div>`
  ).join('');

  // COMISSÕES
  const cg=c.comissoes.geral, cm=c.comissoes.maestria;
  document.getElementById('comissoes-grid').innerHTML = `
    <div class="comissao-card">
      <div class="comissao-tag tag-purple">${ui.comissaoTagGeral}</div>
      <div class="comissao-nome">${tl(cg.nome)}</div>
      <div class="comissao-pct">${tl(cg.percentual)}</div>
      <div class="comissao-info">
        <div class="comissao-row"><span class="ck">${ui.freqLabel}</span><span class="cv">${tl(cg.frequencia)}</span></div>
        <div class="comissao-row"><span class="ck">${ui.howLabel}</span><span class="cv">${tl(cg.como)}</span></div>
      </div>
      <div class="comissao-ex"><strong>${ui.exLabel}</strong>${tl(cg.exemplo)}</div>
    </div>
    <div class="comissao-card">
      <div class="comissao-tag tag-gold">${ui.comissaoTagMaestria}</div>
      <div class="comissao-nome">${tl(cm.nome)}</div>
      <div class="comissao-pct">${tl(cm.percentual)}</div>
      <div class="comissao-info">
        <div class="comissao-row"><span class="ck">${ui.freqLabel}</span><span class="cv">${tl(cm.frequencia)}</span></div>
        <div class="comissao-row"><span class="ck">${ui.howLabel}</span><span class="cv">${tl(cm.como)}</span></div>
      </div>
      <div class="comissao-ex"><strong>${ui.exLabel}</strong>${tl(cm.exemplo)}</div>
    </div>`;

  // PRODUTOS
  document.getElementById('produtos-grid').innerHTML = c.produtos.map(p =>
    `<div class="produto-card"><div class="produto-emoji">${p.emoji}</div><div class="produto-cat">${tl(p.categoria)}</div><div class="produto-ex">${tl(p.exemplos)}</div></div>`
  ).join('');
}

/* ═══════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════ */
function buildNav() {
  const nav = document.getElementById('nav-inner');
  nav.innerHTML = '';
  const T = tr();
  const items = [
    ...DATA.ui[LANG].navItems.filter(i => i.id !== 'familia'),
    { id:'simulador', label: LANG==='pt'?'🔮 Simulador':LANG==='fr'?'🔮 Simulateur':'🔮 Simulator' }
  ];
  items.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'nav-btn' + (i === 0 ? ' active' : '');
    btn.textContent = item.label;
    btn.dataset.target = item.id;
    btn.addEventListener('click', () => {
      document.getElementById(item.id)?.scrollIntoView({ behavior:'smooth', block:'start' });
    });
    nav.appendChild(btn);
  });
}

function updateActiveNav() {
  const secs = document.querySelectorAll('section, header');
  const btns = document.querySelectorAll('.nav-btn');
  let cur = 'top';
  secs.forEach(s => { if(window.scrollY+130 >= s.offsetTop) cur = s.id; });
  btns.forEach(b => b.classList.toggle('active', b.dataset.target === cur));
}

/* ═══════════════════════════════════════════════
   LANG
═══════════════════════════════════════════════ */
function setLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang===lang));
  buildNav();
  renderStatic();
  buildSponsorSelect();
  buildPerspSelect();
  renderEarnings();
  renderMembersList();
  document.querySelectorAll('section').forEach(s => s.classList.add('visible'));
}

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER
═══════════════════════════════════════════════ */
function observeSections() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.06 });
  document.querySelectorAll('section').forEach(s => io.observe(s));
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
async function init() {
  try { await loadData(); }
  catch(e) { console.error(e); document.getElementById('loader').classList.add('hidden'); return; }

  NETWORK = buildInitialNetwork();

  buildNav();
  renderStatic();
  buildSponsorSelect();
  buildPerspSelect();
  renderTree();
  renderEarnings();
  renderMembersList();
  initSlider();
  observeSections();

  // Events
  window.addEventListener('scroll', updateActiveNav, { passive:true });
  document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  document.getElementById('btn-add-member').addEventListener('click', addMember);
  document.getElementById('btn-reset').addEventListener('click', resetNetwork);
  document.getElementById('persp-select').addEventListener('change', e => setPerspective(e.target.value));
  document.getElementById('inp-name').addEventListener('keydown', e => { if(e.key==='Enter') addMember(); });

  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 500);
}

init();
