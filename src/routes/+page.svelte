<script lang="ts">
  import JSONTree from 'svelte-json-tree';

  import * as Card from '$shadcn/ui/card';
  import * as Resizable from '$shadcn/ui/resizable/index.js';
  import { ScrollArea } from '$shadcn/ui/scroll-area/index.js';

  import { appState } from '$lib/state.svelte';

  import DetectorCard from '$components/detector/detector-card.svelte';
  import { SampleCardExcited, SampleCardGround, SampleCardParameters } from '$components/sample';

  let sample = $state(appState);

  let sample_dump = $derived({
    sample: {
      ground: sample.sample.ground.name,
      excited: sample.sample.excited.name,
      solvent: sample.sample.solvent.name,
      concentration: sample.sample.concentration,
    },
    q_vals: sample.q_vals,
    detector: sample.detector,
  });
</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-full gap-4 rounded-lg">
  <Resizable.Pane defaultSize={70}>
    <h1 class="text-lg font-semibold">Current Sample Configuration</h1>
    <br />
    <JSONTree value={sample_dump} shouldShowPreview={false} defaultExpandedLevel={4} />
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30} class="min-w-110">
    <ScrollArea class="@container h-11/12">
      <div class="grid gap-4 md:grid-rows-1">
        <SampleCardParameters short={true} />
        <!-- <SampleCardGround /> -->
        <!-- <SampleCardExcited /> -->
        <DetectorCard short={true} />
      </div>
    </ScrollArea>
  </Resizable.Pane>
</Resizable.PaneGroup>
