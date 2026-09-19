# 海疆纵横 · 中国海军建设历程与代表性装备

> 期末大作业原型 · 看板风格个人技术整合练习

以「中国海军建设历程及其代表性装备型号」为主题，整合**页面、样式、交互、数据可视化、三维**五个模块，形成统一入口、统一数据、统一导航的看板式展示中心。

---

## 🚀 运行说明

本项目为纯静态站点，**无需构建、无需联网**（所有依赖已本地化）。

### 方式零：在另一台电脑上从克隆到运行（完整步骤）

```bash
# 1. 安装 Git（git-scm.com）与 Python 3（python.org，勾选 Add to PATH），二者任装其一即可满足运行
# 2. 克隆仓库
git clone https://github.com/dht985/end.git navy-hub
# 3. 进入目录
cd navy-hub
# 4. 启动本地静态服务器（推荐）
python -m http.server 8010
# 5. 浏览器（Edge/Chrome 均可）打开
#    http://localhost:8010/
```

> 若第 4 步无 Python，也可用 Node：`npx serve .`；或直接双击 `index.html` 浏览（部分浏览器本地 fetch 受限时请改用服务器方式）。

### 方式一：本地服务器（推荐）

```bash
# 进入项目目录
cd navy-hub

# 启动静态服务器（任选其一）
python -m http.server 8010
# 或
npx serve .
```

浏览器打开 `http://localhost:8010/` 即可。

### 方式二：直接打开

双击 `index.html` 即可浏览。部分浏览器对本地 `fetch` 有限制，若数据未加载请改用方式一。

> 注意：`three-d/showcase.html` 使用 A-Frame，建议通过本地服务器访问以获得最佳体验。

---

## 📁 项目结构

```
navy-hub/
├── index.html              # 首页看板（统一入口）
├── history.html            # 模块一：建设历程（时间线交互）
├── equipment.html          # 模块二：装备型号（卡片+筛选）
├── stats.html              # 模块三：数据可视化（ECharts）
├── three-d/
│   └── showcase.html       # 模块四（进阶）：三维舰船（A-Frame）
├── data/
│   └── navy-data.json      # 统一数据源（历程/装备/统计）
├── css/
│   └── style.css           # 看板风格统一样式（海军蓝主题）
├── js/
│   ├── common.js           # 公共：断网检测/导航高亮/数据加载
│   ├── history.js          # 历程模块交互
│   ├── equipment.js        # 装备模块交互
│   └── stats.js            # 可视化模块逻辑
├── lib/                    # 本地化第三方库
│   ├── bootstrap/          # Bootstrap 5.3.3
│   └── echarts/            # ECharts 5.x
├── screenshots/            # 质量自查证据截图
├── docs/                   # 自查/审查/协调记录
└── README.md
```

---

## 🧩 模块说明

| 模块 | 页面 | 技术要点 | 主题衔接 |
|---|---|---|---|
| 首页看板 | index.html | Bootstrap 导航 + 看板网格 + 统计概览 | 统一入口，串联其余四模块 |
| 建设历程 | history.html | 时间线 + 标签筛选 + 详情面板 | 按年代串联装备发展脉络 |
| 装备型号 | equipment.html | 卡片网格 + 舰种/年代/关键词三重筛选 | 对应历程中的重大装备入列 |
| 数据可视化 | stats.html | ECharts 柱状图/饼图/横向柱状图 | 从数据维度印证历程与装备 |
| 三维舰船 | three-d/showcase.html | A-Frame 三维场景 + W/A/S/D 漫游 | 三维视角再现代表装备 |

所有模块共享 `data/navy-data.json`，确保数据一致、主题衔接。

---

## 🛠️ 技术栈与资源来源

| 资源 | 版本 | 来源 | 用途 |
|---|---|---|---|
| Bootstrap | 5.3.3 | [getbootstrap.com](https://getbootstrap.com) 本地引入 | 响应式栅格与导航 |
| ECharts | 5.x | [echarts.apache.org](https://echarts.apache.org) 本地引入 | 数据可视化图表 |
| A-Frame | 1.8.0 | [aframe.io](https://aframe.io) 本地引入 | 三维舰船场景 |
| 海军数据 | — | 公开资料整理（中国海军官方发布、中国军网、Wikipedia 公开条目） | 历程/装备/统计数据 |

> 所有第三方库均下载至本地 `lib/` 与 `three-d/libs/`，**无任何 CDN 外链**，支持完全离线运行。

---

## ✅ 质量自查

详见 [`docs/self-check.md`](docs/self-check.md)，自查项覆盖：

- 三档宽度（1280 / 884 / 375）无横向滚动
- 断网提示与离线可用
- 空数据状态友好提示
- Console 无红色错误

证据截图见 [`screenshots/`](screenshots/)。

---

## 📝 过程文档

**需求与任务管理**
- [需求分析（问题/对象/模块/设计思路图）](docs/requirements.md)
- [任务分解、进度与风险](docs/plan.md)

**结构与可用性**
- [页面结构说明（清单/导航关系/语义化）](docs/structure.md)
- [可用性设计说明（一致性/操作提示/错误提示）](docs/usability.md)

**交互、数据与可视化**
- [交互功能清单与数据处理流程](docs/interactions.md)
- [关键代码说明（2 个核心功能）](docs/key-code.md)
- [图表清单、数据核验与选型说明](docs/charts.md)
- [三维展示与主题关联](docs/threed.md)

**质量与反思**
- [测试记录（12 个用例）](docs/test-report.md)
- [个人反思与改进计划](docs/reflection.md)
- [加载性能研究](docs/performance.md)
- [同伴审查记录](docs/peer-review.md)
- [轮值协调记录](docs/coordination.md)
