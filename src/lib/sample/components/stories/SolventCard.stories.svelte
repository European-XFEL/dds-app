<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import SolventCard from '$lib/sample/components/SolventCard.svelte';
  import { createSimulationSeed } from '$lib/state.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: SolventCard,
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
