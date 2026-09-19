/* history.js —— 建设历程模块
 * 交互：标签筛选、点击节点显示详情、空数据/失败三态
 */
(function () {
  'use strict';
  const tlEl = document.getElementById('timeline');
  const detailEl = document.getElementById('tl-detail');
  const countEl = document.getElementById('tl-count');
  const tagBar = document.getElementById('tagBar');
  let allHistory = [];
  let activeTag = '全部';

  renderState(tlEl, 'loading');

  loadNavyData('data/navy-data.json').then(function (r) {
    if (!r.ok) { renderState(tlEl, 'error', r.msg); return; }
    allHistory = r.data.history;
    buildTagButtons(r.data.history);
    renderTimeline(allHistory);
  });

  function buildTagButtons(list) {
    const tags = ['全部'].concat(Array.from(new Set(list.map(function (h) { return h.tag; }))));
    tagBar.innerHTML = '<label>类别筛选：</label>' + tags.map(function (t) {
      const active = t === activeTag ? 'active' : '';
      return '<button class="tag-btn ' + active + '" data-tag="' + t + '" style="border:none;border-radius:999px;padding:5px 14px;font-size:.84rem;background:' + (t === activeTag ? 'var(--navy-700)' : 'var(--sea-200)') + ';color:' + (t === activeTag ? '#fff' : 'var(--navy-700)') + ';cursor:pointer;">' + t + '</button>';
    }).join('');
    tagBar.querySelectorAll('.tag-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTag = btn.dataset.tag;
        tagBar.querySelectorAll('.tag-btn').forEach(function (b) {
          b.style.background = 'var(--sea-200)'; b.style.color = 'var(--navy-700)';
        });
        btn.style.background = 'var(--navy-700)'; btn.style.color = '#fff';
        const filtered = activeTag === '全部' ? allHistory : allHistory.filter(function (h) { return h.tag === activeTag; });
        renderTimeline(filtered);
      });
    });
  }

  function renderTimeline(list) {
    countEl.textContent = list.length;
    if (!list.length) { renderState(tlEl, 'empty', '该类别下暂无历程记录'); return; }
    tlEl.innerHTML = list.map(function (h, i) {
      return '<div class="tl-item ' + (h.major ? 'major' : '') + '" data-idx="' + i + '" tabindex="0" style="cursor:pointer;">' +
        '<div class="tl-year">' + h.year + '</div>' +
        '<div class="tl-title">' + h.title + '</div>' +
        '<div class="tl-desc">' + h.desc + '</div>' +
        '<span class="tl-tag">' + h.tag + '</span></div>';
    }).join('');
    tlEl.querySelectorAll('.tl-item').forEach(function (el) {
      el.addEventListener('click', function () {
        const h = list[+el.dataset.idx];
        showDetail(h);
        tlEl.querySelectorAll('.tl-item').forEach(function (x) { x.style.background = ''; });
        el.style.background = 'var(--sea-100)';
      });
    });
  }

  function showDetail(h) {
    detailEl.innerHTML =
      '<div style="border-left:4px solid var(--signal);padding-left:14px;">' +
      '<div style="font-size:1.6rem;font-weight:800;color:var(--navy-800);">' + h.year + '</div>' +
      '<h4 style="margin:6px 0 10px;color:var(--navy-700);">' + h.title + '</h4>' +
      '<p style="color:var(--text);line-height:1.7;">' + h.desc + '</p>' +
      '<span class="tl-tag" style="background:var(--signal);color:#fff;">' + h.tag + '</span>' +
      (h.major ? '<span class="tl-tag" style="background:var(--gold);color:#fff;">重大节点</span>' : '') +
      '</div>';
  }
})();
