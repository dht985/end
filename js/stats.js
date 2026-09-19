/* stats.js —— 数据可视化模块
 * 三图：年代数量柱状、舰种构成饼图、排水量横向柱状
 * 含加载/空数据/失败三态，空数据时显示提示而非报错
 */
(function () {
  'use strict';
  const cEras = echarts.init(document.getElementById('chart-era'));
  const cPie = echarts.init(document.getElementById('chart-pie'));
  const cDisp = echarts.init(document.getElementById('chart-disp'));

  const navy = ['#0d3b66', '#1f6f9e', '#e63946', '#f4a261', '#2a9d8f', '#6c5ce7'];

  function showEmpty(chart, title) {
    chart.setOption({
      title: { text: title, left: 'center', top: 'center', textStyle: { color: '#9aa', fontSize: 14 } },
      graphic: { type: 'text', left: 'center', top: '38%', style: { text: '🪶', fontSize: 40 } }
    });
  }

  loadNavyData('data/navy-data.json').then(function (r) {
    if (!r.ok) {
      [cEras, cPie, cDisp].forEach(function (c) { showEmpty(c, '数据加载失败'); });
      return;
    }
    const s = r.data.stats;

    /* 1. 年代数量 */
    if (s.shipCountByEra && s.shipCountByEra.length) {
      cEras.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 50, right: 20, top: 30, bottom: 40 },
        xAxis: { type: 'category', data: s.shipCountByEra.map(function (x) { return x.era; }), axisLabel: { color: '#555' } },
        yAxis: { type: 'value', name: '艘', axisLabel: { color: '#555' }, splitLine: { lineStyle: { color: '#eef' } } },
        series: [{
          type: 'bar', data: s.shipCountByEra.map(function (x) { return x.count; }),
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#e63946' }, { offset: 1, color: '#0d3b66' }
          ]), borderRadius: [6, 6, 0, 0] },
          label: { show: true, position: 'top', color: '#0d3b66', fontWeight: 700 }
        }]
      });
    } else { showEmpty(cEras, '暂无年代数据'); }

    /* 2. 舰种构成饼图 */
    if (s.typeComposition && s.typeComposition.length) {
      cPie.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} 艘 ({d}%)' },
        legend: { bottom: 0, textStyle: { color: '#555' } },
        series: [{
          type: 'pie', radius: ['38%', '68%'], center: ['50%', '45%'],
          data: s.typeComposition.map(function (x, i) {
            return { name: x.type, value: x.value, itemStyle: { color: navy[i % navy.length] } };
          }),
          label: { color: '#444', formatter: '{b}\n{c}艘' }
        }]
      });
    } else { showEmpty(cPie, '暂无构成数据'); }

    /* 3. 排水量横向柱状 */
    if (s.displacementByType && s.displacementByType.length) {
      const sorted = s.displacementByType.slice().sort(function (a, b) { return a.value - b.value; });
      cDisp.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (p) { return p[0].name + '：' + p[0].value.toLocaleString() + ' 吨'; } },
        grid: { left: 110, right: 40, top: 20, bottom: 40 },
        xAxis: { type: 'value', name: '吨', axisLabel: { color: '#555' } },
        yAxis: { type: 'category', data: sorted.map(function (x) { return x.type; }), axisLabel: { color: '#555' } },
        series: [{
          type: 'bar', data: sorted.map(function (x) { return x.value; }),
          itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1f6f9e' }, { offset: 1, color: '#2a9d8f' }
          ]), borderRadius: [0, 6, 6, 0] },
          label: { show: true, position: 'right', color: '#0d3b66', formatter: function (p) { return p.value.toLocaleString(); } }
        }]
      });
    } else { showEmpty(cDisp, '暂无排水量数据'); }

    window.addEventListener('resize', function () {
      cEras.resize(); cPie.resize(); cDisp.resize();
    });
  });
})();
