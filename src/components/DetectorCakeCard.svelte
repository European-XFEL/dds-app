<script lang="ts">
  import type { DetectorModule } from '$lib/math/crystallography_transforms';

  import DetectorCakeVisualization from '$components/ui/detector/cake-vis.svelte';

  const customModules: DetectorModule[] = [
    {
      id: 'module-1',
      x: 100,
      y: 80,
      width: 120,
      height: 100,
    },
    {
      id: 'module-2',
      x: 240,
      y: 80,
      width: 120,
      height: 100,
    },
    {
      id: 'module-3',
      x: 100,
      y: 200,
      width: 120,
      height: 100,
    },
    {
      id: 'module-4',
      x: 240,
      y: 200,
      width: 120,
      height: 100,
    },
  ];
</script>

<DetectorCakeVisualization initialModules={customModules} detectorDistance={300} />
