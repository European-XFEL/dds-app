<script lang="ts">
  import dagre from '@dagrejs/dagre';
  import {
    Background,
    BackgroundVariant,
    Controls,
    type Edge,
    MiniMap,
    type Node,
    type NodeTypes,
    Position,
    SvelteFlow,
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import { onMount } from 'svelte';

  import { browser } from '$app/environment';

  import * as components from './components/';

  const nodeTypes: NodeTypes = {
    SolventCard: components.CardNode,
    SampleCard: components.CardNode,
    ProbeSetupCard: components.CardNode,
    PumpSetupCard: components.CardNode,
  };

  const initialNodes = $state.raw<Node[]>([
    {
      id: 'solvent',
      type: 'SolventCard',
      data: { short: false },
      position: { x: 0, y: 0 },
    },
    {
      id: 'ground',
      type: 'SampleCard',
      data: { kind: 'ground', vizOpen: false, vizCollapseShow: true },
      position: { x: 0, y: 0 },
    },
    {
      id: 'excited',
      type: 'SampleCard',
      data: { kind: 'excited', vizOpen: false, vizCollapseShow: true },
      position: { x: 0, y: 0 },
    },
    {
      id: 'pump',
      type: 'PumpSetupCard',
      data: {},

      position: { x: 0, y: 0 },
    },
    {
      id: 'probe',
      type: 'ProbeSetupCard',
      data: {},
      position: { x: 0, y: 0 },
    },
  ]);

  const initialEdges = $state.raw<Edge[]>([
    { id: 'e1-2', source: 'solvent', target: 'ground' },
    { id: 'e1-3', source: 'solvent', target: 'excited' },
    { id: 'e4-3', source: 'pump', target: 'excited' },
    { id: 'e5-2', source: 'probe', target: 'ground' },
    { id: 'e5-3', source: 'probe', target: 'excited' },
  ]);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'LR') {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      let nodeWidth = node?.width ?? 650;
      let nodeHeight = node?.height ?? 150;
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      let nodeWidth = node?.width ?? 650;
      let nodeHeight = node?.height ?? 150;
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
  );

  let nodes = $state.raw<Node[]>(layoutedNodes);
  let edges = $state.raw<Edge[]>(layoutedEdges);

  function onLayout(direction: string) {
    const layoutedElements = getLayoutedElements(nodes, edges, direction);

    nodes = layoutedElements.nodes;
    edges = layoutedElements.edges;
  }

  onMount(() => {
    onLayout('LR');
  });
</script>

<div class="flow-dashboard">
  {#if browser}
    <!-- bind:edges -->
    <SvelteFlow
      bind:nodes
      bind:edges
      {nodeTypes}
      fitView
      nodesDraggable
      nodesConnectable={false}
      defaultEdgeOptions={{ animated: true }}
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={15} />
    </SvelteFlow>
  {:else}
    <div class="loading-placeholder">Loading dashboard...</div>
  {/if}
</div>

<style>
  .flow-dashboard {
    width: 100%;
    height: 100%;
  }
</style>
