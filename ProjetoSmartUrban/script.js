class Ocorrencia {
  constructor(nome, categoria, localizacao, descricao, prioridade) {
    this.id          = Ocorrencia.gerarId();     
    this.nome        = nome.trim();
    this.categoria   = categoria;
    this.localizacao = localizacao.trim();
    this.descricao   = descricao.trim();
    this.prioridade  = prioridade;
    this.status      = 'Pendente';               
    this.dataCriacao = new Date().toISOString();  
  }
  resolver() {
    this.status = 'Resolvida';
    this.dataResolucao = new Date().toISOString();
  }
  estaResolvida() {
    return this.status === 'Resolvida';
  }
  getDataFormatada() {
    return new Date(this.dataCriacao).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
  toString() {
    return `[#${this.id}] ${this.categoria} em "${this.localizacao}" — ${this.status}`;
  }
  static gerarId() {
    Ocorrencia._contador = (Ocorrencia._contador || 0) + 1;
    return `OC-${String(Ocorrencia._contador).padStart(4, '0')}`;
  }
  static fromObject(dados) {
    const oc = new Ocorrencia(
      dados.nome,
      dados.categoria,
      dados.localizacao,
      dados.descricao,
      dados.prioridade
    );
    oc.id          = dados.id;
    oc.status      = dados.status;
    oc.dataCriacao = dados.dataCriacao;
    if (dados.dataResolucao) oc.dataResolucao = dados.dataResolucao;
    const numero = parseInt(dados.id.replace('OC-', ''), 10);
    if (numero >= (Ocorrencia._contador || 0)) {
      Ocorrencia._contador = numero;
    }
    return oc;
  }
}
let ocorrencias = [];   
document.addEventListener('DOMContentLoaded', () => {
  carregarDoStorage();   
  renderizarLista();     
  atualizarDashboard();  
  iniciarHeader();       
  iniciarFormulario();   
  iniciarFiltros();      
  iniciarExportacao();   
});
function iniciarHeader() {
  const header     = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const nav        = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
  menuToggle.addEventListener('click', () => {
    const aberto = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', aberto);
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
    });
  });
}
function iniciarFormulario() {
  const form    = document.getElementById('formOcorrencia');
  const btnLimpar = document.getElementById('btnLimpar');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    const nome        = document.getElementById('inputNome').value;
    const categoria   = document.getElementById('inputCategoria').value;
    const localizacao = document.getElementById('inputLocalizacao').value;
    const descricao   = document.getElementById('inputDescricao').value;
    const prioridade  = document.getElementById('inputPrioridade').value;
    const nova = new Ocorrencia(nome, categoria, localizacao, descricao, prioridade);
    ocorrencias.push(nova);
    salvarNoStorage();     
    renderizarLista();     
    atualizarDashboard();  
    form.reset();          
    limparErros();
    exibirNotificacao(`Ocorrência ${nova.id} registrada com sucesso!`, 'success');
    setTimeout(() => {
      document.getElementById('ocorrencias').scrollIntoView({ behavior: 'smooth' });
    }, 600);
  });
  btnLimpar.addEventListener('click', () => {
    form.reset();
    limparErros();
  });
}
function validarFormulario() {
  const campos = [
    { id: 'inputNome',        msg: 'Informe seu nome.' },
    { id: 'inputCategoria',   msg: 'Selecione uma categoria.' },
    { id: 'inputLocalizacao', msg: 'Informe a localização.' },
    { id: 'inputDescricao',   msg: 'Descreva o problema.' },
  ];
  let valido = true;
  limparErros();
  campos.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('error');
      valido = false;
    }
  });
  if (!valido) {
    exibirNotificacao('Preencha todos os campos obrigatórios.', 'error');
  }
  return valido;
}
function limparErros() {
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
    .forEach(el => el.classList.remove('error'));
}
function resolverOcorrencia(id) {
  const oc = ocorrencias.find(o => o.id === id);
  if (!oc) return;
  if (oc.estaResolvida()) {
    exibirNotificacao('Esta ocorrência já foi resolvida.', 'warning');
    return;
  }
  oc.resolver();  
  salvarNoStorage();
  renderizarLista();
  atualizarDashboard();
  exibirNotificacao(`Ocorrência ${id} marcada como resolvida! ✓`, 'success');
}
function removerOcorrencia(id) {
  const confirmar = confirm(`Deseja remover a ocorrência ${id}?\nEsta ação não pode ser desfeita.`);
  if (!confirmar) return;
  ocorrencias = ocorrencias.filter(o => o.id !== id);
  salvarNoStorage();
  renderizarLista();
  atualizarDashboard();
  exibirNotificacao(`Ocorrência ${id} removida.`, 'info');
}
function renderizarLista() {
  const lista      = document.getElementById('listaOcorrencias');
  const emptyState = document.getElementById('emptyState');
  const busca      = document.getElementById('inputBusca').value.toLowerCase().trim();
  const filtCat    = document.getElementById('filtroCategoria').value;
  const filtStat   = document.getElementById('filtroStatus').value;
  const filtradas = ocorrencias.filter(oc => {
    const matchBusca = !busca || (
      oc.nome.toLowerCase().includes(busca) ||
      oc.localizacao.toLowerCase().includes(busca) ||
      oc.categoria.toLowerCase().includes(busca) ||
      oc.descricao.toLowerCase().includes(busca)
    );
    const matchCat  = !filtCat  || oc.categoria === filtCat;
    const matchStat = !filtStat || oc.status === filtStat;
    return matchBusca && matchCat && matchStat;
  });
  const filterResult = document.getElementById('filterResult');
  if (busca || filtCat || filtStat) {
    filterResult.textContent = `${filtradas.length} ocorrência(s) encontrada(s) de ${ocorrencias.length} total`;
  } else {
    filterResult.textContent = ocorrencias.length > 0
      ? `${ocorrencias.length} ocorrência(s) registrada(s)`
      : '';
  }
  if (filtradas.length === 0) {
    lista.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    lista.innerHTML = filtradas
      .slice()                           
      .reverse()                         
      .map(oc => gerarCardHTML(oc))
      .join('');
  }
}
function gerarCardHTML(oc) {
  const classePrioridade = {
    'Baixa':   'badge-prio-baixa',
    'Média':   'badge-prio-media',
    'Alta':    'badge-prio-alta',
    'Urgente': 'badge-prio-urgente',
  }[oc.prioridade] || 'badge-prio-media';
  const classeStatus = oc.estaResolvida()
    ? 'badge-status-resolvida'
    : 'badge-status-pendente';
  const btnResolver = !oc.estaResolvida()
    ? `<button
          class="card-btn btn-resolve"
          onclick="resolverOcorrencia('${oc.id}')"
          title="Marcar como resolvida"
        >✓ Resolver</button>`
    : `<button class="card-btn btn-resolve" disabled title="Já resolvida" style="opacity:.45;cursor:default">✓ Resolvida</button>`;
  return `
    <article class="ocorrencia-card" id="card-${oc.id}" role="article">
      <div class="card-top">
        <span class="card-id">${oc.id} · ${oc.getDataFormatada()}</span>
        <div class="card-badges">
          <span class="badge ${classePrioridade}">${oc.prioridade}</span>
          <span class="badge ${classeStatus}">${oc.status}</span>
        </div>
      </div>
      <div class="card-body">
        <p class="card-categoria">${oc.categoria}</p>
        <p class="card-local">📍 ${oc.localizacao}</p>
        <p class="card-desc">${oc.descricao}</p>
      </div>
      <div class="card-meta">
        <span class="card-nome">👤 ${oc.nome}</span>
        <div class="card-actions">
          ${btnResolver}
          <button
            class="card-btn btn-danger"
            onclick="removerOcorrencia('${oc.id}')"
            title="Remover ocorrência"
          >✕ Remover</button>
        </div>
      </div>
    </article>
  `;
}
function atualizarDashboard() {
  const { total, resolvidas, pendentes } = ocorrencias.reduce((acc, oc) => {
    acc.total++;
    oc.estaResolvida() ? acc.resolvidas++ : acc.pendentes++;
    return acc;
  }, { total: 0, resolvidas: 0, pendentes: 0 });
  const cidadaos = new Set(ocorrencias.map(oc => oc.nome.toLowerCase())).size;
  animarContador('statTotal',     total);
  animarContador('statResolvidas',resolvidas);
  animarContador('statPendentes', pendentes);
  animarContador('statCidadaos',  cidadaos);
  animarContador('heroTotal',      total);
  animarContador('heroResolvidas', resolvidas);
  animarContador('heroCidadaos',   cidadaos);
  const pct = total > 0 ? Math.round((resolvidas / total) * 100) : 0;
  document.getElementById('trendTotal').textContent     = `${total} registros`;
  document.getElementById('trendResolvidas').textContent = `${pct}% do total`;
  document.getElementById('trendPendentes').textContent  = `${total - resolvidas} aguardando`;
  desenharGrafico(resolvidas, pendentes);
}
function desenharGrafico(resolvidas, pendentes) {
  const canvas = document.getElementById('graficoOcorrencias');
  const empty  = document.getElementById('chartEmpty');
  const ctx    = canvas.getContext('2d');
  const total = resolvidas + pendentes;
  if (total === 0) {
    canvas.style.display = 'none';
    empty.style.display  = 'block';
    return;
  }
  canvas.style.display = 'block';
  empty.style.display  = 'none';
  const dpr    = window.devicePixelRatio || 1;
  const rect   = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * dpr;
  canvas.height = 220         * dpr;
  ctx.scale(dpr, dpr);
  const W  = rect.width;
  const H  = 220;
  const PAD_X   = 48;
  const PAD_TOP = 30;
  const PAD_BOT = 40;
  const chartH  = H - PAD_TOP - PAD_BOT;
  ctx.clearRect(0, 0, W, H);
  const dados = [
    { label: 'Resolvidas', valor: resolvidas, cor: '#4CAF50', corClaro: '#C8E6C9' },
    { label: 'Pendentes',  valor: pendentes,  cor: '#F57C00', corClaro: '#FFE0B2' },
  ];
  const maxVal    = Math.max(resolvidas, pendentes, 1);
  const barWidth  = 80;
  const totalBars = dados.length;
  const spacing   = (W - PAD_X * 2 - barWidth * totalBars) / (totalBars + 1);
  const linhas = 5;
  ctx.strokeStyle = '#E0E7EF';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 4]);
  for (let i = 0; i <= linhas; i++) {
    const y = PAD_TOP + (chartH / linhas) * i;
    ctx.beginPath();
    ctx.moveTo(PAD_X, y);
    ctx.lineTo(W - PAD_X, y);
    ctx.stroke();
    const valY = Math.round(maxVal - (maxVal / linhas) * i);
    ctx.setLineDash([]);
    ctx.fillStyle = '#90A4AE';
    ctx.font      = `500 11px 'DM Sans', sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(valY, PAD_X - 8, y + 4);
    ctx.setLineDash([4, 4]);
  }
  ctx.setLineDash([]);
  dados.forEach((d, i) => {
    const barH = (d.valor / maxVal) * chartH;
    const x    = PAD_X + spacing * (i + 1) + barWidth * i;
    const y    = PAD_TOP + chartH - barH;
    ctx.shadowColor   = d.cor + '44';
    ctx.shadowBlur    = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = d.cor;
    const radius  = 8;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#263238';
    ctx.font      = `700 15px 'Syne', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(d.valor, x + barWidth / 2, y - 8);
    ctx.fillStyle = '#546E7A';
    ctx.font      = `500 12px 'DM Sans', sans-serif`;
    ctx.fillText(d.label, x + barWidth / 2, PAD_TOP + chartH + 22);
    if (total > 0 && barH > 30) {
      const pct = Math.round((d.valor / total) * 100);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font      = `600 11px 'DM Sans', sans-serif`;
      ctx.fillText(`${pct}%`, x + barWidth / 2, y + barH - 10);
    }
  });
  ctx.strokeStyle = '#CFD8DC';
  ctx.lineWidth   = 2;
  ctx.beginPath();
  ctx.moveTo(PAD_X, PAD_TOP + chartH);
  ctx.lineTo(W - PAD_X, PAD_TOP + chartH);
  ctx.stroke();
}
function iniciarFiltros() {
  let debounceTimer;
  document.getElementById('inputBusca').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderizarLista, 300);
  });
  document.getElementById('filtroCategoria').addEventListener('change', renderizarLista);
  document.getElementById('filtroStatus').addEventListener('change', renderizarLista);
}
function exibirNotificacao(mensagem, tipo = 'success') {
  const container = document.getElementById('notification-container');
  const icones = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };
  const notif = document.createElement('div');
  notif.className  = `notification ${tipo !== 'success' ? tipo : ''}`;
  notif.innerHTML  = `<span style="font-size:1rem;font-weight:700">${icones[tipo]}</span> ${mensagem}`;
  notif.setAttribute('role', 'alert');
  container.appendChild(notif);
  setTimeout(() => {
    notif.classList.add('hide');
    setTimeout(() => notif.remove(), 350);
  }, 3500);
}
function salvarNoStorage() {
  try {
    localStorage.setItem('smarturban_ocorrencias', JSON.stringify(ocorrencias));
  } catch (e) {
    console.warn('[SmartUrban] Falha ao salvar no LocalStorage:', e);
  }
}
function carregarDoStorage() {
  try {
    const raw = localStorage.getItem('smarturban_ocorrencias');
    if (!raw) return;
    const dados = JSON.parse(raw);
    ocorrencias = dados.map(d => Ocorrencia.fromObject(d));
  } catch (e) {
    console.warn('[SmartUrban] Falha ao carregar do LocalStorage:', e);
    ocorrencias = [];
  }
}
function iniciarExportacao() {
  document.getElementById('btnExportar').addEventListener('click', () => {
    if (ocorrencias.length === 0) {
      exibirNotificacao('Nenhuma ocorrência para exportar.', 'warning');
      return;
    }
    const exportData = {
      plataforma:   'SmartUrban',
      ods:          'ODS 11 — Cidades e Comunidades Sustentáveis',
      exportadoEm:  new Date().toISOString(),
      total:        ocorrencias.length,
      resolvidas:   ocorrencias.filter(o => o.estaResolvida()).length,
      pendentes:    ocorrencias.filter(o => !o.estaResolvida()).length,
      ocorrencias:  ocorrencias,
    };
    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `smarturban_ocorrencias_${Date.now()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    exibirNotificacao(`${ocorrencias.length} ocorrências exportadas com sucesso!`, 'success');
  });
}
function animarContador(elementId, alvo, duracao = 600) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const inicio   = parseInt(el.textContent, 10) || 0;
  const delta    = alvo - inicio;
  const startTs  = performance.now();
  if (delta === 0) return;
  function step(now) {
    const elapsed  = now - startTs;
    const progresso = Math.min(elapsed / duracao, 1);
    const ease     = 1 - Math.pow(1 - progresso, 3);
    el.textContent = Math.round(inicio + delta * ease);
    if (progresso < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const resolvidas = ocorrencias.filter(o => o.estaResolvida()).length;
    const pendentes  = ocorrencias.filter(o => !o.estaResolvida()).length;
    desenharGrafico(resolvidas, pendentes);
  }, 200);
});
