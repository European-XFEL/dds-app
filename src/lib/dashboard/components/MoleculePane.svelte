<script lang="ts">
</script>

<!-- Molecule Visualizations -->
<!-- {#if hasAll}
          {#if vizCollapseShow}
            <Collapsible.Root bind:open={vizOpen} class="w-full">
              <Collapsible.Trigger
                class="mb-2 w-full rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium hover:bg-secondary/20"
              >
                {#if vizOpen}
                  Hide Molecule Visualizations
                {:else}
                  Show Molecule Visualizations
                {/if}
              </Collapsible.Trigger>
              <Collapsible.Content class="w-full">
                <div class="mb-3 flex items-center gap-2 text-sm">
                  <span class="font-semibold">View:</span>
                  <button
                    class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                      vizMode === 'trajectory' ? 'bg-secondary/20' : ''
                    }`}
                    onclick={() => (vizMode = 'trajectory')}
                  >
                    Trajectory
                  </button>
                  <button
                    class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                      vizMode === 'individual' ? 'bg-secondary/20' : ''
                    }`}
                    onclick={() => (vizMode = 'individual')}
                  >
                    Individual
                  </button>
                </div>
                {#if vizMode === 'trajectory'}
                  <MoleculeTrajectoryViz
                    ground={simulation.sample.ground}
                    excited={simulation.sample.excited}
                  />
                {:else}
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-2">
                      <h3 class="text-sm font-semibold">Ground State</h3>
                      {#if simulation.sample.ground}
                        <MoleculeViz molecule={simulation.sample.ground} />
                      {/if}
                    </div>
                    <div class="flex flex-col gap-2">
                      <h3 class="text-sm font-semibold">Excited State</h3>
                      {#if simulation.sample.excited}
                        <MoleculeViz molecule={simulation.sample.excited} />
                      {/if}
                    </div>
                  </div>
                {/if}
              </Collapsible.Content>
            </Collapsible.Root>
          {:else if vizOpen}
            <div>
              <div class="mb-3 flex items-center gap-2 text-sm">
                <span class="font-semibold">View:</span>
                <button
                  class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                    vizMode === 'trajectory' ? 'bg-secondary/20' : ''
                  }`}
                  onclick={() => (vizMode = 'trajectory')}
                >
                  Trajectory
                </button>
                <button
                  class={`rounded-md border px-2 py-1 text-xs font-medium transition hover:bg-secondary/10 ${
                    vizMode === 'individual' ? 'bg-secondary/20' : ''
                  }`}
                  onclick={() => (vizMode = 'individual')}
                >
                  Individual
                </button>
              </div>
              {#if vizMode === 'trajectory'}
                <MoleculeTrajectoryViz
                  ground={sim.sample.ground}
                  excited={sim.sample.excited}
                />
              {:else}
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Ground State</h3>
                    {#if sim.sample.ground}
                      <MoleculeViz molecule={sim.sample.ground} />
                    {/if}
                  </div>
                  <div class="flex flex-col gap-2">
                    <h3 class="text-sm font-semibold">Excited State</h3>
                    {#if sim.sample.excited}
                      <MoleculeViz molecule={sim.sample.excited} />
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        {/if} -->
