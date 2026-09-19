/* common.js —— 海疆纵横 公共脚本
 * 功能：网络状态检测、导航高亮、统一 fetch 封装（含空数据/失败三态）
 */
(function () {
  'use strict';

  /* ---------- 断网检测 ---------- */
  function updateOnlineStatus() {
    const online = navigator.onLine;
    document.body.classList.toggle('is-offline', !online);
    document.querySelectorAll('[data-net]').forEach(function (el) {
      el.textContent = online ? '网络：在线' : '网络：离线（断网）';
    });
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  document.addEventListener('DOMContentLoaded', updateOnlineStatus);

  /* ---------- 导航高亮：依据 location.pathname ---------- */
  function highlightNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.top-nav .nav-link').forEach(function (a) {
      const href = a.getAttribute('href');
      if (href && href === path) a.classList.add('active');
    });
  }
  document.addEventListener('DOMContentLoaded', highlightNav);

  /* ---------- 统一数据加载：返回 Promise<{ok, data, msg}> ---------- */
  window.loadNavyData = function (url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) { return { ok: true, data: data, msg: '' }; })
      .catch(function (err) { return { ok: false, data: null, msg: err.message }; });
  };

  /* ---------- 渲染状态提示 ---------- */
  window.renderState = function (el, type, msg) {
    const map = {
      loading: { emoji: '⚓', text: msg || '数据加载中…' },
      empty:   { emoji: '🪶', text: msg || '暂无符合条件的数据' },
      error:   { emoji: '⚠️', text: msg || '数据加载失败，请检查网络或 data.json' }
    };
    const s = map[type] || map.empty;
    el.innerHTML = '<div class="state-tip"><span class="emoji">' + s.emoji + '</span>' + s.text + '</div>';
  };
})();
