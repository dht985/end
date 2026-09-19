# 加载性能研究：script 的 defer 与 async

日期：2026-09-19 ｜ 对象：navy-hub 五个页面 ｜ 结论截图：`screenshots/perf/perf-compare.png`

## 一、文档要点（来源：MDN `<script>` 元素）

| 加载方式 | 下载 | 执行时机 | 执行顺序 | 适用 |
|---|---|---|---|---|
| 无属性（默认） | 阻塞 HTML 解析 | 下载完立即执行（解析中途） | 文档顺序 | 极少（需尽早接管页面） |
| `async` | 并行、不阻塞解析 | 下载完立即执行 | **不保证** | 彼此独立、无依赖的脚本 |
| `defer` | 并行、不阻塞解析 | 文档解析完成后、`DOMContentLoaded` 之前 | **文档顺序** | 依赖 DOM / 依赖其他脚本的主体脚本 |

MDN 关键表述摘录：
- 「`defer`：向浏览器表明，该脚本要在文档被解析后、但在触发 DOMContentLoaded 事件之前执行」，且「按照它们出现在文档中的顺序执行」。
- 「`async`：普通脚本会被并行请求，并尽快解析和执行」「无法保证脚本的运行次序」。
- 「没有 async、defer 或 type=module 属性的脚本……会在浏览器继续解析页面之前立即获取并执行」（解析阻塞的根源）。
- 警告：内联脚本设置 `defer` **不生效**。

本项目选型推论：`echarts.min.js` → `stats.js`、`common.js` → 页面脚本存在全局依赖链，必须用 **defer（保序）** 而非 async；脚本均操作 DOM，也要求 defer。

## 二、优化前状态（Network 面板分析）

优化前五个页面全部在 body 末尾**同步**加载脚本。以 stats.html 为例，Network 瀑布（见截图第二节）显示：HTML 解析到末尾后被 4 个脚本依次"下载→执行"卡住，主文档解析完成时间被推迟，DCL=164ms。装备页 equipment.html 因同步脚本执行叠加，DCL 高达 106.9ms。

## 三、优化实施

1. index / history / equipment / stats：全部外链脚本加 `defer`（bootstrap → echarts → common → 页面脚本顺序不变，依赖链由 defer 保序保证）。
2. index.html 内联脚本：按 MDN 警告（内联 defer 无效），改为 `document.addEventListener('DOMContentLoaded', …)` 包裹——defer 脚本恰在 DCL 前执行完毕，时序正确。
3. three-d/showcase.html：A-Frame 实测 defer 后 DCL 由 171.8ms **劣化到 194.3ms**（场景初始化被推迟到解析完成后，而该页无正文可先渲染），故**回退为同步加载**，仅 common.js 保持 defer。defer 不是普适答案。

## 四、测量方法

- 工具：Playwright（headless Chromium），每次运行使用全新 context（等效禁用缓存）。
- 双服务器交错测量抵消环境漂移：`8011 = git worktree 检出的 HEAD 原版`，`8010 = 优化版`，按 前→后→前→后 顺序共 4 轮。
- 指标：FCP（首次内容绘制）、DCL（DOMContentLoaded）、LOAD（load），每页合并 n=17 取中位数（附 min~max）；showcase 最终版 n=7。
- Console 错误：34 次运行全部为 0，功能未受影响。

## 五、结果（中位数，ms）

| 页面 | FCP 前→后 | DCL 前→后 | LOAD 前→后 |
|---|---|---|---|
| index.html | 172→144 | 25.8→24.7 | 29.3→29.0 |
| history.html | 128→124 | 28.5→25.4 | 31.7→28.5 |
| **equipment.html** | **112→92** | **106.9→26.9（-75%）** | **114.2→81.3（-29%）** |
| stats.html | 112→112 | 164.1→164.2 | 164.4→164.7 |
| three-d/showcase.html | 40→40 | 171.8→136.7（A-Frame 回退同步后） | 172→137 |

## 六、结论

1. **装备页收益最大**（DCL -75%、LOAD -29%、FCP -20ms）：defer 消除了同步脚本对解析的阻塞，瀑布图上可见优化后 HTML 与数据请求不再被脚本执行卡住。
2. **stats 页持平**：瓶颈是 ECharts 约 1MB 的解析/执行本身；本地环境下载耗时趋近于零，defer 的下载并行收益显现不出来，真实弱网环境下收益会更大。
3. **A-Frame 场景页 defer 反而劣化 +22ms**，回退同步后 136.7ms 优于原版 171.8ms——加载策略需按页面类型实测选择。
4. 脚本依赖链（echarts→stats.js 等）必须用 defer 而非 async 保序；async 仅适合无依赖脚本。

## 七、复现方法

```bash
cd d:\navy-hub && python -m http.server 8010     # 优化版
git worktree add d:\perf-before-wt HEAD          # 原版快照
cd d:\perf-before-wt && python -m http.server 8011
# Playwright 采集 performance.getEntriesByType('navigation'|'resource'|'paint')
# 对比报告生成脚本见开发记录（measure.py / merge_report.py / make_report.py）
```
