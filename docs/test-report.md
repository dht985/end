# 测试记录

测试环境：Windows 11 · Chrome/Chromium（Playwright headless 与手工验证结合）· 本地静态服务器 `python -m http.server 8010`
测试日期：2026-09-19 ~ 09-20。覆盖正常流程 7 项、异常流程 5 项，共 12 个用例。

| # | 模块 | 类型 | 步骤 | 预期结果 | 实际结果 | 证据 |
|---|---|---|---|---|---|---|
| T1 | 首页 | 正常 | 打开 index.html | 四张统计卡显示 1949 / 12 / 14 / 6，历程与装备预览渲染 | ✅ 与 JSON 一致 | wide-1280.png |
| T2 | 导航 | 正常 | 依次点击五个导航项 | 均正确跳转，当前项红色高亮 | ✅ 五页全通过 | 各页截图 |
| T3 | 历程 | 正常 | 点击「航母」标签 | 时间线仅剩 3 条航母节点，计数为 3 | ✅ | history-1280.png |
| T4 | 历程 | 正常 | 点击任一时间线节点 | 右侧详情面板显示该节点年份/标题/描述 | ✅ | history-1280.png |
| T5 | 装备 | 正常 | 舰种选「航空母舰」 | 仅 3 张航母卡片，计数「共 3 艘」 | ✅ | equipment-1280.png |
| T6 | 装备 | 正常 | 关键词输入「16」 | 命中辽宁舰（舷号16）；「重置」后恢复 12 张 | ✅ 舷号匹配生效 | 手工验证 |
| T7 | 可视化 | 正常 | 打开 stats.html，hover 柱/饼/条 | tooltip 分别显示数值、数值+占比、千分位吨数 | ✅ | stats-charts.png |
| T8 | 三维 | 正常 | 打开 showcase.html，拖拽 + W/A/S/D | 视角环视、相机平移，无报错 | ✅ | threed-showcase.png |
| T9 | 全站 | 异常 | DevTools 断网后刷新 | 顶部黄条提示，页面主体照常可浏览 | ✅ | offline-notice.png |
| T10 | 装备 | 异常 | 筛选无结果组合（如关键词「不存在」） | 空态提示「没有符合筛选条件的装备，请调整筛选条件」，计数「共 0 艘」 | ✅ | empty-data.png |
| T11 | 装备 | 异常 | 关键词输入非法串「！@＃¥%…&×`<script>`」 | 不崩溃、不注入，按普通文本匹配，落入空态提示 | ✅ | invalid-input.png |
| T12 | 装备 | 异常 | 拦截 navy-data.json 请求（模拟服务器故障/断链） | 内容区显示「⚠️ Failed to fetch」，页面其余部分正常 | ✅ | network-error.png |

补充基线检查：五页 Console 无红色错误（A-Frame/THREE 版本 info 与 WebGL 性能 warning 除外），详见 [console-check.txt](../screenshots/console-check.txt)；三档宽度（1280/884/375）均无横向滚动条，见 screenshots 目录三张对应截图。

结论：12/12 用例通过，异常流程均有友好兜底，未出现未捕获异常。
