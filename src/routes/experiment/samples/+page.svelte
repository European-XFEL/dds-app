<script lang="ts">
  import { SampleExcitedCard, SampleGroundCard, SampleParametersCard } from '$lib/sample';
</script>

<div class="grid gap-4 md:grid-rows-1">
  <div>
    <SampleParametersCard />
  </div>
  <div class="flex flex-wrap gap-4">
    <SampleGroundCard />
    <SampleExcitedCard />
  </div>
</div>
