<script lang="ts">
  import { SampleCard, SolventCard } from '$lib/sample';
</script>

<div class="grid gap-4 md:grid-rows-1">
  <div>
    <SolventCard />
  </div>
  <div class="flex flex-wrap gap-4">
    <SampleCard kind="ground" />
    <SampleCard kind="excited" />
    <SampleCard kind="excited" />
  </div>
</div>
