<script lang="ts">
  // Tree-shakeable ECharts imports - only include what you use
  import { LineChart, type LineSeriesOption } from 'echarts/charts';
  import {
    DataZoomComponent,
    type DataZoomComponentOption,
    GridComponent,
    type GridComponentOption,
    LegendComponent,
    type LegendComponentOption,
    TitleComponent,
    type TitleComponentOption,
    TooltipComponent,
    type TooltipComponentOption,
  } from 'echarts/components';
  import * as echarts from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';

  // Register only the components you need
  echarts.use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    CanvasRenderer,
  ]);

  // Compose type for type-safe options
  type ECOption = echarts.ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | DataZoomComponentOption
  >;

  type Props = {
    constant_options: Omit<ECOption, 'series' | 'xAxis'>;
    series: ECOption['series'];
    xAxis: ECOption['xAxis'];
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
      chart.setOption({ series: series, xAxis: xAxis }, { lazyUpdate: true });
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
