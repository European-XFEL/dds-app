<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import SolventInfoCard from '$lib/sample/components/SolventInfoCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: SolventInfoCard,
    args: {
      solvent: defaultState.sample.solvent,
      concentrationSoluteMolar: defaultState.sample.concentrationSoluteMolar,
      qRange: defaultState.qRange,
      short: false,
    },
  });
</script>

<Story name="Default" />

<Story name="Short" args={{ short: true }} />
