<script lang="ts">
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';

  type Props = {
    constant_options: Omit<EChartsOption, 'series' | 'xAxis'>;
    series: EChartsOption['series'];
    xAxis: EChartsOption['xAxis'];
  };

  let { constant_options, series, xAxis }: Props = $props();
</script>

<div
  class="chart"
  {@attach (node) => {
    const chart = echarts.init(node);

    chart.setOption(constant_options);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(node);

    $effect(() => {
      chart.setOption({ series: series }, { lazyUpdate: true });
    });

    $effect(() => {
      chart.setOption({ xAxis: xAxis }, { lazyUpdate: true });
    });

    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }}
></div>

<style>
  .chart {
    width: 100%;
    height: 400px;
  }
</style>
