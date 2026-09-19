/* equipment.js —— 装备型号模块
 * 交互：舰种/年代/关键词三重筛选、空数据/失败三态、卡片悬停
 */
(function () {
  'use strict';
  const listEl = document.getElementById('eq-list');
  const countEl = document.getElementById('eq-count');
  const fType = document.getElementById('f-type');
  const fEra = document.getElementById('f-era');
  const fKw = document.getElementById('f-keyword');
  const btnReset = document.getElementById('btn-reset');
  let all = [];

  renderState(listEl, 'loading');

  loadNavyData('data/navy-data.json').then(function (r) {
    if (!r.ok) { renderState(listEl, 'error', r.msg); return; }
    all = r.data.equipment;
    /* 填充筛选下拉 */
    const types = Array.from(new Set(all.map(function (e) { return e.typeName; })));
    const eras = Array.from(new Set(all.map(function (e) { return e.era; }))).sort();
    types.forEach(function (t) { fType.innerHTML += '<option value="' + t + '">' + t + '</option>'; });
    eras.forEach(function (e) { fEra.innerHTML += '<option value="' + e + '">' + e + '</option>'; });
    applyFilter();
  });

  function shipSvg(kind) {
    const c = { carrier: '#e63946', destroyer: '#1f6f9e', frigate: '#2a9d8f', submarine: '#6c5ce7', amphibious: '#f4a261', support: '#7f8c8d' }[kind] || '#1f6f9e';
    if (kind === 'carrier') {
      return '<svg class="ship-svg" width="180" height="60" viewBox="0 0 180 60"><rect x="20" y="28" width="140" height="14" rx="3" fill="#0a2540"/><polygon points="20,28 10,42 170,42 160,28" fill="#0d3b66"/><rect x="70" y="12" width="50" height="16" fill="' + c + '"/><rect x="88" y="4" width="14" height="8" fill="#e63946"/></svg>';
    }
    if (kind === 'submarine') {
      return '<svg class="ship-svg" width="180" height="60" viewBox="0 0 180 60"><ellipse cx="90" cy="38" rx="70" ry="12" fill="#0d3b66"/><rect x="80" y="22" width="20" height="16" fill="' + c + '"/><line x1="90" y1="22" x2="90" y2="10" stroke="#0a2540" stroke-width="3"/></svg>';
    }
    return '<svg class="ship-svg" width="180" height="60" viewBox="0 0 180 60"><polygon points="30,30 150,30 165,42 15,42" fill="#0a2540"/><rect x="55" y="18" width="70" height="12" fill="#0d3b66"/><rect x="85" y="8" width="10" height="10" fill="' + c + '"/></svg>';
  }

  function render(list) {
    countEl.textContent = '共 ' + list.length + ' 艘';
    if (!list.length) { renderState(listEl, 'empty', '没有符合筛选条件的装备，请调整筛选条件'); return; }
    listEl.innerHTML = list.map(function (e) {
      return '<div class="eq-card ' + e.type + '">' +
        '<div class="eq-visual"><span class="eq-type">' + e.typeName + '</span>' + shipSvg(e.icon) + '</div>' +
        '<div class="eq-body">' +
        '<div class="eq-name">' + e.name + ' <small>(' + e.hullNo + ')</small></div>' +
        '<div class="eq-meta">' + e.year + '年服役 · ' + e.era + '年代</div>' +
        '<div class="eq-specs"><div><b>排水量</b>' + e.displacement + '</div><div><b>长度</b>' + e.length + '</div><div><b>动力</b>' + e.propulsion + '</div></div>' +
        '<div class="eq-specs" style="margin-top:8px;color:var(--muted);">' + e.feature + '</div>' +
        '</div></div>';
    }).join('');
  }

  function applyFilter() {
    const t = fType.value;
    const era = fEra.value;
    const kw = fKw.value.trim().toLowerCase();
    const filtered = all.filter(function (e) {
      const okType = !t || e.typeName === t;
      const okEra = !era || e.era === era;
      const okKw = !kw || e.name.toLowerCase().indexOf(kw) >= 0 || e.hullNo.toLowerCase().indexOf(kw) >= 0;
      return okType && okEra && okKw;
    });
    render(filtered);
  }

  fType.addEventListener('change', applyFilter);
  fEra.addEventListener('change', applyFilter);
  fKw.addEventListener('input', applyFilter);
  btnReset.addEventListener('click', function () {
    fType.value = ''; fEra.value = ''; fKw.value = '';
    applyFilter();
  });
})();
