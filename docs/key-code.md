# 关键代码说明（2 个核心功能）

## 核心功能一：统一数据加载与三态封装（js/common.js）

```js
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
```

**实现思路**：

1. **错误归一化**：fetch 只有网络层失败才会 reject，HTTP 404/500 属于正常响应，必须手动检查 `res.ok` 并抛错，否则坏状态码会被当成功处理；把两种失败统一进 `catch` 后，调用方拿到的是形状固定的 `{ok, data, msg}`，不再需要各自 try/catch；
2. **不中断页面**：返回"带结果的对象"而非直接 reject，调用方用 `if (!r.ok)` 分流，页面其余部分（导航、页脚、其他卡片）不受影响；
3. **三态复用**：loading/empty/error 三种提示由一个 `renderState` 输出，五个页面、七处内容区共用同一视觉语言，新增模块零成本获得一致提示；
4. 调用端示例（equipment.js）：`loadNavyData('data/navy-data.json').then(r => { if (!r.ok) { renderState(listEl,'error', r.msg); return; } ... })`。

## 核心功能二：装备三重筛选（js/equipment.js）

```js
function applyFilter() {
  const t = fType.value;                      // 舰种下拉
  const era = fEra.value;                     // 年代下拉
  const kw = fKw.value.trim().toLowerCase();  // 关键词
  const filtered = all.filter(function (e) {
    const okType = !t   || e.typeName === t;
    const okEra  = !era || e.era === era;
    const okKw   = !kw  || e.name.toLowerCase().indexOf(kw) >= 0
                         || e.hullNo.toLowerCase().indexOf(kw) >= 0;
    return okType && okEra && okKw;
  });
  render(filtered);
}
fType.addEventListener('change', applyFilter);
fEra.addEventListener('change', applyFilter);
fKw.addEventListener('input',  applyFilter);
btnReset.addEventListener('click', function () {
  fType.value = ''; fEra.value = ''; fKw.value = '';
  applyFilter();
});
```

**实现思路**：

1. **单一过滤函数**：三个控件的事件（change/change/input）全部指向同一个 `applyFilter`，任何时候都从"当前全量数据 + 三个控件值"重新计算，避免增量过滤带来的顺序依赖与状态残留；
2. **"空值即放行"技巧**：`!t || e.typeName === t` —— 下拉未选（值为空串）时该维度恒真，三重条件天然支持任意组合，不需要为每种组合写分支；
3. **大小写与空白容错**：关键词 `trim().toLowerCase()` 后与舰名、舷号两个字段比对，输入「辽宁」「16」都能命中；
4. **重置 = 清空控件 + 复用同一函数**，不存在第二套"全量渲染"逻辑；
5. **衍生联动**：`render()` 里同步更新「共 N 艘」计数，空结果时调用 `renderState(listEl,'empty', …)`，与筛选形成闭环反馈。
