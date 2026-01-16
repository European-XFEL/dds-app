<script lang="ts">
  import {
    ArrowRight,
    Atom,
    BarChart3,
    Beaker,
    BookOpen,
    FlaskConical,
    Fullscreen,
    Microscope,
    Radiation,
  } from '@lucide/svelte';

  import { Button } from '$shadcn/ui/button';
  import * as Card from '$shadcn/ui/card';

  import { Latex } from '$lib/ui';
</script>

<div class="flex grow justify-center-safe">
  <div class="flex w-full max-w-5xl flex-col gap-20 py-12">
    <!-- Hero Section -->
    <section class="flex flex-col items-center gap-8 text-center lg:mt-12">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold tracking-tight text-balance md:text-5xl">
          X-Ray Solution Scattering Simulator
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-pretty text-muted-foreground">
          Proof of concept web interface for X-ray solution scattering simulation
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <Button href="/dashboard" class="gap-2">
          Open Dashboard
          <ArrowRight class="h-4 w-4" />
        </Button>
        <Button href="/docs" variant="outline" class="gap-2">
          <BookOpen class="h-4 w-4" />
          Documentation
        </Button>
      </div>
    </section>

    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-2 text-center">
        <h2 class="text-2xl font-semibold">Simulation Pipeline</h2>
        <p class="text-muted-foreground">
          Combine solute structural changes with solvent thermal response
        </p>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <Card.Root>
          <Card.Header>
            <Card.Action
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10"
            >
              <Atom class="h-6 w-6 text-blue-500" />
            </Card.Action>
            <Card.Title>Solute Difference</Card.Title>
            <Card.Description>
              Compute intensity difference between excited and ground state molecular structures
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="rounded px-3 py-2 text-center">
              <Latex
                math={String.raw`\Delta I = I_{\text{exc}} - I_{\text{gnd}}`}
                displayMode={true}
              />
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Action
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10"
            >
              <FlaskConical class="h-6 w-6 text-amber-500" />
            </Card.Action>
            <Card.Title>Solvent Response</Card.Title>
            <Card.Description>
              Account for thermal expansion from pump laser energy deposition
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="rounded px-3 py-2 text-center">
              <Latex
                math={String.raw`\frac{\partial S}{\partial T} \cdot \Delta T`}
                displayMode={true}
              />
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Action
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10"
            >
              <BarChart3 class="h-6 w-6 text-green-500" />
            </Card.Action>
            <Card.Title>Combined Signal</Card.Title>
            <Card.Description>
              Predict the total difference scattering as measured at the detector
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="rounded px-3 py-2 text-center">
              <Latex
                math={String.raw`\Delta S \approx \alpha \Delta S_{\text{sol}} + \Delta S_{\text{slv}}`}
                displayMode={true}
              />
            </div>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Action
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10"
            >
              <Fullscreen class="h-6 w-6 text-red-500" />
            </Card.Action>
            <Card.Title>Image Recreation</Card.Title>
            <Card.Description>
              Simulate detector images based on detector information (geometry, masks, etc...) and
              combined scattering signal
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="rounded px-3 py-2 text-center">...</div>
          </Card.Content>
        </Card.Root>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-2 text-center">
        <h2 class="text-2xl font-semibold">Configure Your Experiment</h2>
        <p class="text-muted-foreground">
          Set up all parameters needed for accurate scattering predictions
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Molecular Structures</Card.Title>
            <Card.Action>
              <Atom class="h-5 w-5 text-primary" />
            </Card.Action>
            <Card.Description class="text-sm text-muted-foreground">
              Upload XYZ for ground and excited states. Supports arbitrary molecular geometries.
              <!-- TODO: Limit upload file by no. of atoms -->
            </Card.Description>
          </Card.Header>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Solvent Library</Card.Title>
            <Card.Action>
              <Beaker class="h-5 w-5 text-primary" />
            </Card.Action>
            <Card.Description class="text-sm text-muted-foreground">
              Pre-loaded <Latex math={String.raw`\partial S/\partial T`} /> data for common solvents with
              temperature-dependent response curves.
            </Card.Description>
          </Card.Header>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Pump Parameters</Card.Title>
            <Card.Action>
              <Radiation class="h-5 w-5 text-primary" />
            </Card.Action>
            <Card.Description class="text-sm text-muted-foreground">
              Configure photon energy, excited state energy, and excitation fraction (<Latex
                math={String.raw`\alpha`}
              />) for your optical pump.
            </Card.Description>
          </Card.Header>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Detector Geometry</Card.Title>
            <Card.Action>
              <Microscope class="h-5 w-5 text-primary" />
            </Card.Action>
            <Card.Description class="text-sm text-muted-foreground">
              Support for European XFEL detectors with configurable sample-detector distance.
            </Card.Description>
          </Card.Header>
        </Card.Root>
      </div>
    </section>
  </div>
</div>
