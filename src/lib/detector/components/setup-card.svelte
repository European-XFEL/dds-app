<script lang="ts">
  import * as Card from '$shadcn/ui/card/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import { Toggle } from '$shadcn/ui/toggle';

  import type { Detector, QRange } from '$lib/types';

  import SetupDetector from './setup-detector.svelte';
  import SetupQRange from './setup-q-range.svelte';

  let {
    detector = $bindable(),
    q_range = $bindable(),
    short = false,
  }: {
    detector: Detector;
    q_range: QRange;
    short?: boolean;
  } = $props();

  let configure_via_q: boolean = $state(true);
</script>

<Card.Root class="h-min w-min min-w-full @sm:gap-2">
  <Card.Header>
    <Card.Title>
      <div class="flex items-center justify-between">Detector Setup</div>
    </Card.Title>
  </Card.Header>

  <Card.Content>
    <SetupDetector bind:detector {short} />
  </Card.Content>

  <hr class="my-4" />

  <Card.Header hidden={short}>
    <Card.Title hidden={short}>
      <div class="flex items-center justify-between">
        Momentum Transfer Range
        <Card.Action>
          <Toggle variant="outline" bind:pressed={configure_via_q}>
            <Label class="text-xs">Configure via Q parameters</Label>
          </Toggle>
        </Card.Action>
      </div>
    </Card.Title>
  </Card.Header>

  <Card.Content class="flex flex-wrap gap-4">
    <SetupQRange bind:detector bind:q_range />
  </Card.Content>
</Card.Root>
