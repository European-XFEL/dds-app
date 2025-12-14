<script lang="ts">
  import { Handle, type NodeProps, NodeResizeControl, Position } from '@xyflow/svelte';

  import { ProbeSetupCard } from '$lib/probe';
  import { PumpSetupCard } from '$lib/pump/';
  import { SampleCard, SolventCard } from '$lib/sample';

  type CardType = 'SampleCard' | 'SolventCard' | 'PumpSetupCard' | 'ProbeSetupCard';

  const cardByType = {
    SampleCard,
    SolventCard,
    PumpSetupCard,
    ProbeSetupCard,
  } satisfies Record<CardType, any>;

  let { data, type }: NodeProps = $props();

  const cardType = $derived(typeof type === 'string' ? (type as CardType) : undefined);
  const Card = $derived<any>(cardType ? cardByType[cardType] : undefined);
</script>

<div class="node">
  <Handle type="target" position={Position.Left} />
  {#if Card}
    {#if data}
      {@debug Card, data}
      <Card {...data as any} />
    {:else}
      {@debug Card, data}
      <Card />
    {/if}
  {:else}
    <div class="unknown-node">
      Unknown node type: {String(type)}
    </div>
  {/if}

  <div class="resize-corner">
    <div class="resize-corner-inner">
      <NodeResizeControl minWidth={420} minHeight={30} color="rgb(255, 64, 0)" />
    </div>
  </div>
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .node {
    position: relative;
  }

  .resize-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .resize-corner-inner {
    pointer-events: auto;
  }

  .unknown-node {
    font-size: 12px;
  }
</style>
