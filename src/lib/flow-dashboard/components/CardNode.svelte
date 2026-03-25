<script lang="ts">
  import {
    Handle,
    type NodeProps,
    NodeResizeControl,
    Position,
  } from '@xyflow/svelte';

  import { MoleculeCard } from '$lib/molecule';
  import { ProbeSetupCard } from '$lib/probe';
  import { PumpSetupCard } from '$lib/pump/';
  import { SolventCard, SolventInfoCard } from '$lib/sample';

  type CardType =
    | 'MoleculeCard'
    | 'ProbeSetupCard'
    | 'PumpSetupCard'
    | 'SolventCard'
    | 'SolventInfoCard';

  const cardByType = {
    MoleculeCard,
    ProbeSetupCard,
    PumpSetupCard,
    SolventCard,
    SolventInfoCard,
  } satisfies Record<CardType, object>;

  let { data, type }: NodeProps = $props();

  const cardType = $derived(
    typeof type === 'string' ? (type as CardType) : undefined,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Card = $derived<any>(cardType ? cardByType[cardType] : undefined);
</script>

<div class="node">
  <Handle type="target" position={Position.Left} />
  {#if Card}
    {#if data}
      <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
      <Card {...data as any} />
    {:else}
      <Card />
    {/if}
  {:else}
    <div class="unknown-node">
      Unknown node type: {String(type)}
    </div>
  {/if}

  <div class="resize-corner">
    <div class="resize-corner-inner">
      <NodeResizeControl
        minWidth={420}
        minHeight={30}
        color="rgb(255, 64, 0)"
      />
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
