<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { createSimulationSeed } from '$lib/state.svelte';

  import SampleCard from '$lib/sample/components/MoleculeCard.svelte';

  const defaultState = createSimulationSeed();

  const { Story } = defineMeta({
    component: SampleCard,
    args: {
      kind: 'ground',
      molecule: defaultState.sample.ground,
      vizOpen: true,
    },
  });
</script>

<Story name="Ground State" />

<Story name="Excited State" args={{ kind: 'excited', molecule: undefined }} />

<Story name="With Viz Collapsed" args={{ vizOpen: false, vizCollapseShow: true }} />
