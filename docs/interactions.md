# JavaScript 交互功能清单与数据处理说明

## 一、交互功能清单

| # | 交互 | 所在页面 | 实现要点 |
|---|---|---|---|
| 1 | 导航高亮 | 五页 | `common.js` 按 `location.pathname` 给当前 `nav-link` 加 `active` |
| 2 | 移动端汉堡菜单 | 五页 | Bootstrap `navbar-toggler` 折叠展开 |
| 3 | 断网状态提示 | 五页 | `online/offline` 事件 → `body.is-offline` 类 → 黄条显隐 + 徽标文案切换 |
| 4 | 数据加载三态 | 五页 | `renderState(el,'loading/empty/error')` 统一渲染 ⚓/🪶/⚠️ 提示 |
| 5 | 首页统计数字动态化 | index | 从 JSON `summary` 与数组 `length` 读取并写入 `stat-num` |
| 6 | 历程类别标签筛选 | history | `data-tag` 事件委托式绑定，选中态样式切换 + 重渲染时间线 |
| 7 | 历程节点点击看详情 | history | 时间线项 `click` → 右侧详情面板渲染年份/标题/描述/标签 |
| 8 | 装备三重筛选 | equipment | 舰种 `change` + 年代 `change` + 关键词 `input` → `applyFilter()` 组合过滤 |
| 9 | 装备筛选重置 | equipment | 「重置」按钮清空三控件后重新渲染全量 |
| 10 | 图表 tooltip 与图例 | stats | ECharts `tooltip`（柱状 axis / 饼图 item）+ legend 点击显隐系列 |
| 11 | 图表响应式 resize | stats | `window.resize` → 三图 `resize()` |
| 12 | 三维环视与漫游 | three-d | A-Frame `look-controls`（鼠标拖拽）+ `wasd-controls`（W/A/S/D 移动） |
| 13 | 三档响应式布局 | 五页 | Bootstrap 栅格 + 自定义断点，1280/884/375 无横向滚动 |

## 二、数据处理说明（组织 → 加载 → 解析 → 展示）

**1. 组织**：单一数据源 `data/navy-data.json`，四段结构，全站五页共享：

```json
{
  "meta":     { "title", "source", "updated" },
  "summary":  { "foundedYear": 1949, "shipTypes": 6, ... },
  "history":  [ { "year", "title", "desc", "tag", "major" }, ... ],
  "equipment":[ { "name", "hullNo", "type", "typeName", "year", "era",
                  "displacement", "length", "propulsion", "feature", "icon" }, ... ],
  "stats":    { "shipCountByEra": [...], "typeComposition": [...], "displacementByType": [...] }
}
```

**2. 加载**：`js/common.js` 提供 `window.loadNavyData(url)`，基于 `fetch` 的 Promise 封装，成功/失败归一为 `{ok, data, msg}`，调用方无需自行 try/catch（代码见 [key-code.md](key-code.md)）。

**3. 解析**：`r.data.history / equipment / stats` 直接得到结构化数组；筛选类数据按需 `Set` 去重生成下拉选项（装备页的舰种、年代选项，历程页的标签按钮，均由数据动态生成——**新增数据无需改界面代码**）。

**4. 展示**：两条渲染管线——
- DOM 管线：`list.map(...).join('')` 拼接 HTML 后一次性赋 `innerHTML`，单次重排（首页时间线预览、装备卡片、时间线）；
- 图表管线：`stats.js` 将 `stats` 段映射为 ECharts option（`map` 取轴/值序列、`sort` 排序、渐变色 `LinearGradient`），`setOption` 渲染。

**5. 容错**：任一页加载失败仅影响本页内容区（显示 error 三态），其余区域与导航不受影响；空数组走 empty 三态而非静默空白。
