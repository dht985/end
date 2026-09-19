# 页面结构说明

## 一、页面清单

| 页面 | 文件 | 角色 |
|---|---|---|
| 首页看板 | index.html | 聚合入口：统计概览 + 历程/装备预览 + 模块导航 |
| 建设历程 | history.html | 功能页：时间线 + 类别筛选 + 节点详情 |
| 装备型号 | equipment.html | 功能页：装备卡片 + 三重筛选 |
| 数据可视化 | stats.html | 功能页：ECharts 三图 |
| 三维舰船 | three-d/showcase.html | 进阶页：A-Frame 编队场景（独立沉浸式布局） |

## 二、导航关系

```
                ┌── index.html（首页，默认落地页）
                │        │
   顶部导航（五页共有，active 高亮当前页）
                │
   ┌────────┬──────────┬──────────┐
history    equipment   stats   three-d/showcase
   └────────┴──────────┴──────────┘
        各功能页 ⇄ 首页互相跳转（导航栏 + 首页卡片按钮"进入××模块 →" + 三维页"« 返回首页"）
```

- 五页共用同一 `<nav class="top-nav">`，当前页由 `js/common.js` 依据 `location.pathname` 自动加 `active` 类高亮；
- 首页"本看板导航"卡片与各模块底部按钮提供第二跳转路径；
- 三维页为沉浸式全屏布局，用左上角"« 返回首页"链接回归主结构；
- 移动端（<992px）导航折叠为 Bootstrap 汉堡菜单。

## 三、语义化结构

以 index.html 为例，全部页面遵循同一语义骨架：

```
<body>
  <div class="offline-banner">        断网提示条（display 由 body.is-offline 控制）
  <nav>          顶部导航（brand + 5 个 nav-link）
  <section class="page-hero">         页头：模块徽标 + 标题 + 副标题
  <main class="container py-4">       主体内容（看板网格 kanban-board / 卡片 card）
  <footer class="site-footer">        页脚：站点说明 + 数据来源声明
```

要点：
- 每页有且仅有一个 `<main>`；页头说明用 `<section>`；模块卡片内部用 `card-header / card-body / card-footer` 划分；
- 列表型内容使用 `list-group`、导航使用 `navbar-nav`，标签筛选按钮语义为 `<button>` 并带 `data-tag` 属性；
- 历程时间线节点带 `tabindex="0"`，支持键盘聚焦；文字与背景对比度按海军蓝主题保证可读；
- 标题层级：`h1`（页头主标题）→ `h4`（卡片内小标题），不跳级。

详见 [index.html](../index.html)、[stats.html](../stats.html) 等源文件。
