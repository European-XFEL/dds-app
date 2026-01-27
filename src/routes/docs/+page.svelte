<script lang="ts">
  import katex from 'katex';

  import * as Card from '$shadcn/ui/card';

  import { Latex } from '$lib/ui';

  const eqDebye = String.raw`I(Q) = \sum_i \sum_j f_i(Q) f_j(Q) \frac{\sin(Q r_{ij})}{Q r_{ij}}`;

  const defsLeft = String.raw`
    \begin{aligned}
      f_i(Q) &\coloneqq \text{atomic form factor for atom } i \\
      r_{ij} &\coloneqq \text{interatomic distance} \left(\AA\right) \\
      Q = 4\pi \sin(\theta)/\lambda &\coloneqq \text{momentum transfer} \left(\AA^{-1}\right)
    \end{aligned}
  `;

  const defsRight = String.raw`
    \begin{aligned}
      S(Q) = \sum_{i<j} f_i f_j \frac{\sin(Qr)}{Qr} &\colon \text{pairs accumulated as} \\
      I = 2S + \sum_i f_i^2 &\colon \text{final intensity} \\
      \mathcal{O}(N^2 \times |Q|) &\colon \text{complexity for } N \text{ atoms}
    \end{aligned}
  `;

  const eqCromerMann = String.raw`f_0(Q) = \sum_k a_k \exp\left(-b_k \left(\frac{Q}{4\pi}\right)^2\right) + c`;

  const pipeline = [
    {
      title: 'Solute Difference',
      body: `
        <p>Load ground and excited state structures (XYZ), compute intensities:</p>
        ${katex.renderToString(
          String.raw`\Delta I(Q) = I_{\text{excited}}(Q) - I_{\text{ground}}(Q)`,
          { displayMode: true },
        )}
      `,
    },
    {
      title: 'Solvent Response',
      body: `
        <p>Load experimental ${katex.renderToString(
          String.raw`(\partial S/\partial T)`,
        )} data and interpolate onto the Q grid.</p>
        <br>
        <p>Accounts for solvent heating from optical pump energy deposition.</p>
      `,
    },
    {
      title: 'Combined Signal',
      body: `
        <p>The measured difference signal combines both contributions:</p>
        ${katex.renderToString(
          String.raw`\Delta S(Q,t) \approx \alpha \cdot \Delta S_{\text{solute}} + \Delta S_{\text{solvent}}`,
          { displayMode: true },
        )}
        where ${katex.renderToString(
          String.raw`\alpha`,
        )} is the excited state fraction.
      `,
    },
  ] as const;

  const imagePipeline = [
    {
      title: 'Undo integration',
      body: `
        <p>Simulated 1D difference signal is extended to cover the detector as much as possible.</p>
        <br>
        <p>The 1D line is copied to create a 2D image (axis of radius vs angle).</p>
      `,
    },
    {
      title: 'Transform from radial to pixel coordinates',
      body: `...`,
    },
    {
      title: 'Undo absorption',
      body: `...`,
    },
    {
      title: 'Undo solid angle corrections',
      body: `...`,
    },
    {
      title: 'Undo polarization corrections',
      body: `...`,
    },
    {
      title: 'Undo flat field',
      body: `...`,
    },
    {
      title: 'Undo dark subtraction',
      body: `...`,
    },
    {
      title: 'Add noise',
      body: `...`,
    },
    {
      title: 'Add geometry uncertainty',
      body: `...`,
    },
    {
      title: 'Perform azimuthal integration on image',
      body: `...`,
    },
  ] as const;

  const workflow = [
    {
      title: 'Load Structures',
      body: `
        <p>Upload XYZ or PDB files for ground and excited states. Structures are parsed via SimEx-Lite
        <code>SampleData</code> to extract atomic numbers and positions.</p>
      `,
    },
    {
      title: 'Configure Solvent',
      body: `
        <p>Select a solvent with ${katex.renderToString(
          String.raw`(\partial S/\partial T)`,
        )} differential
        data. Set concentration to scale the solute contribution relative to the solvent background.</p>
      `,
    },
    {
      title: 'Set Pump Parameters',
      body: `
        <p>Define photon energy (eV), excited-state energy, and excitation fraction
        (${katex.renderToString(
          String.raw`\alpha`,
        )}). These determine the solvent heating contribution
        via energy deposition.</p>
      `,
    },
    {
      title: 'Detector Geometry',
      body: `
        <p>Configure sample-detector distance and beam center. Supports European XFEL detectors with
        module layouts.</p>
      `,
    },
    {
      title: 'Compute & Analyze',
      body: `
        <p>View ${katex.renderToString(
          String.raw`\Delta S(Q)`,
        )} with separated contributions: total
        signal, scaled solute difference (${katex.renderToString(
          String.raw`\alpha \cdot \Delta S`,
        )}),
        and solvent thermal response. Identify optimal Q-ranges for your experiment.</p>
      `,
    },
    {
      title: 'Compare & Export',
      body: `
        <p>Compare multiple simulation configurations, save results for analysis, and use predictions
        to optimize beamtime parameters.</p>
      `,
    },
  ];
</script>

<section>
  <h1 class="font-semibold">Technical Documentation</h1>
  <p>
    Documentation of the physics, algorithms, and implementation details behind
    the SimEx-Debye Scattering Simulator.
  </p>

  <p>
    See the code repository at:
    <a
      href="https://git.xfel.eu/simulation/simex-debye/"
      target="_blank"
      rel="noopener noreferrer"
    >
      https://git.xfel.eu/simulation/simex-debye/
    </a>.
  </p>
</section>

<section>
  <h2 class="font-semibold">Simulation Details</h2>

  <h3>The Debye Scattering Equation</h3>
  <p>
    The simulator computes scattering intensity via the Debye scattering
    equation, which provides the orientational average for isotropic samples.
  </p>

  <div class="flex flex-wrap items-center">
    <div class="flex-2">
      <Latex math={eqDebye} displayMode />
    </div>

    <div class="flex-1 p-4 text-xs">
      <Latex math={defsLeft} displayMode />
    </div>
    <div class="flex-1 p-4 text-xs">
      <Latex math={defsRight} displayMode />
    </div>
  </div>
</section>

<section>
  <h3>Atomic Form Factors</h3>

  <div class="not-prose flex flex-wrap gap-6">
    <Card.Root class="flex-2 gap-2">
      <Card.Header>
        <Card.Title>Cromer-Mann (1968)</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>
          4-Gaussian + constant parameterization (coefficients stored locally
          for 98 elements).
        </p>
        <div class="mt-3 rounded-md bg-muted px-3 py-2">
          <Latex math={eqCromerMann} displayMode />
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root class="flex-2 gap-2">
      <Card.Header>
        <Card.Title>Waasmaier-Kirfel (1995)</Card.Title>
      </Card.Header>
      <Card.Content>
        Alternative parameterization via <code>periodictable</code> using
        <code>cromermann.fxrayatq()</code>.
        <br /><br />
        Computes <Latex math={String.raw`f_0(Q)`} /> only (no anomalous
        <Latex math={String.raw`f', f''`} /> corrections).
      </Card.Content>
    </Card.Root>

    <Card.Root class="flex-1 gap-0 border-amber-500/50 bg-amber-500/5">
      <Card.Header>
        <Card.Title class="text-sm text-amber-600"
          >Physics Simplifications</Card.Title
        >
      </Card.Header>
      <Card.Content class="text-sm">
        <p>... list of things</p>
      </Card.Content>
    </Card.Root>
  </div>
</section>

<section>
  <h3>Difference Scattering Pipeline</h3>

  <p>
    For pump-probe/time-resolved XSS experiments, the difference signal
    <Latex math={String.raw`\Delta S(Q,t)`} /> combines solute structural change with
    solvent thermal response.
  </p>

  <div class="not-prose grid gap-6 md:grid-cols-3">
    {#each pipeline as { title, body } (title)}
      <Card.Root class="gap-0">
        <Card.Header>
          <Card.Title>{title}</Card.Title>
        </Card.Header>
        <Card.Content>
          {@html body}
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
</section>

<section>
  <h3>Image Reconstruction Pipeline</h3>

  <p>
    The simulated difference signal can be used to reconstruct a more
    'realistic' detector image by, effectively, undoing each step required to
    perform 1D azimuthal integration.
  </p>

  <div class="not-prose grid gap-6 md:grid-cols-3">
    {#each imagePipeline as { title, body }, i (title)}
      <Card.Root class="gap-0">
        <Card.Header>
          <Card.Title>{i + 1}. {title}</Card.Title>
        </Card.Header>
        <Card.Content>
          {@html body}
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
</section>

<section>
  <h2 class="font-semibold">Usage</h2>

  <div class="not-prose grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
    {#each workflow as item, i (item.title)}
      <Card.Root class="h-full gap-0">
        <Card.Header class="relative flex-row items-center gap-3">
          <Card.Title>{i + 1}. {item.title}</Card.Title>
        </Card.Header>
        <Card.Content>
          {@html item.body}
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
</section>
