<script lang="ts">
  import { SampleCardExcited, SampleCardGround, SampleCardParameters } from '$components/sample';
</script>

<div class="grid gap-4 md:grid-rows-1">
  <div>
    <SampleCardParameters />
  </div>
  <div class="flex flex-wrap gap-4">
    <SampleCardGround />
    <SampleCardExcited />
  </div>
</div>
