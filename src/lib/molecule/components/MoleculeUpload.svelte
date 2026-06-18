<script lang="ts">
  import { page } from '$app/state';

  import * as Button from '$shadcn/ui/button/index.js';
  import { buttonVariants } from '$shadcn/ui/button/index.js';
  import * as Dialog from '$shadcn/ui/dialog/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import Spinner from '$shadcn/ui/spinner/spinner.svelte';
  import * as Textarea from '$shadcn/ui/textarea/index.js';
  import * as Tooltip from '$shadcn/ui/tooltip/index.js';

  import { listMolecules, uploadMolecule } from '$lib/data/api';
  import type { Capability } from '$lib/types';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  interface Props {
    molecules?: Molecules;
    capability?: Capability;
  }

  let {
    molecules = $bindable(),
    capability = page.data.capabilities.upload,
  }: Props = $props();

  let disabled = $derived(!capability.available);
  let disabledMessage = $derived(
    !capability.available ? capability.reason : '',
  );

  let open = $state(false);
  let lastUploadedId = $state<string | null>(null);
  let fileError = $state<string | null>(null);
  let fileReadToken = 0;
  let file = $state<File | null>(null);

  // Form field states
  let moleculeNameValue = $state<string>('');
  let descriptionValue = $state<string>('');
  let stateValue = $state<number>(0);
  let atomCountValue = $state<number | null>(null);
  let referenceValue = $state<string>('');

  // Validation errors
  let moleculeNameError = $state<string | null>(null);
  let descriptionError = $state<string | null>(null);
  let stateError = $state<string | null>(null);
  let atomCountError = $state<string | null>(null);
  let referenceError = $state<string | null>(null);
  let submitError = $state<string | null>(null);

  let submitting = $state(false);

  let filenameStem = $derived.by<string>(() => {
    if (!file) return '';
    return file.name.replace(/\.[^/.]+$/, '');
  });

  let nameConflict = $derived.by(
    () =>
      !!moleculeNameValue &&
      !!molecules?.some((m) => m.moleculeName === moleculeNameValue),
  );

  let fileInvalid = $derived(!!fileError);
  let moleculeNameInvalid = $derived(nameConflict || !!moleculeNameError);
  let descriptionInvalid = $derived(!!descriptionError);
  let stateInvalid = $derived(!!stateError);
  let atomCountInvalid = $derived(!!atomCountError);
  let referenceInvalid = $derived(!!referenceError);

  function parseAtomCount(contents: string) {
    const firstLine = contents.split(/\r?\n/, 1)[0]?.trim();
    if (!firstLine) return null;
    const match = /^(\d+)/.exec(firstLine);
    if (!match) return null;
    const parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function validateForm(): boolean {
    let valid = true;
    moleculeNameError = null;
    descriptionError = null;
    stateError = null;
    atomCountError = null;
    referenceError = null;
    submitError = null;

    if (!moleculeNameValue.trim()) {
      moleculeNameError = 'Molecule name is required';
      valid = false;
    }
    if (!descriptionValue.trim()) {
      descriptionError = 'Description is required';
      valid = false;
    }
    if (!Number.isFinite(stateValue) || stateValue < 0) {
      stateError = 'State must be a non-negative integer';
      valid = false;
    }
    if (!atomCountValue || atomCountValue <= 0) {
      atomCountError = 'Atom count must be a positive integer';
      valid = false;
    }
    if (!file) {
      fileError = 'Please select a file';
      valid = false;
    }

    return valid;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!validateForm() || !file) return;

    submitting = true;
    submitError = null;

    try {
      const result = await uploadMolecule({
        moleculeName: moleculeNameValue.trim(),
        description: descriptionValue.trim(),
        state: stateValue,
        reference: referenceValue.trim() || null,
        atomCount: atomCountValue!,
        file,
      });

      if (result.success && result.result) {
        if (result.result.id !== lastUploadedId && molecules) {
          molecules.push(result.result);
        }
        lastUploadedId = result.result.id;
        open = false;
        resetForm();
      } else {
        submitError = result.error ?? 'Unable to upload molecule.';
      }
    } catch (err) {
      submitError = err instanceof Error ? err.message : 'Upload failed';
    } finally {
      submitting = false;
    }
  }

  function resetForm() {
    moleculeNameValue = '';
    descriptionValue = '';
    stateValue = 0;
    atomCountValue = null;
    referenceValue = '';
    file = null;
    fileError = null;
    moleculeNameError = null;
    descriptionError = null;
    stateError = null;
    atomCountError = null;
    referenceError = null;
    submitError = null;
  }

  function handleFileChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement | null;
    const selected = target?.files?.[0] ?? null;
    file = selected;
    fileError = null;

    if (!selected) return;

    if (!moleculeNameValue) {
      moleculeNameValue = filenameStem;
    }

    const token = ++fileReadToken;
    selected
      .text()
      .then((contents) => {
        if (token !== fileReadToken) return;
        const count = parseAtomCount(contents);
        if (count === null) {
          fileError = 'Unable to read the atom count from this file.';
          return;
        }
        atomCountValue = count;
      })
      .catch(() => {
        if (token !== fileReadToken) return;
        fileError = 'Unable to read the selected file.';
      });
  }
</script>

<Dialog.Root bind:open>
  {#if disabled}
    <Tooltip.Root>
      <Tooltip.Trigger>
        <span class="inline-flex">
          <Dialog.Trigger
            class={buttonVariants({ variant: 'outline' })}
            disabled
          >
            Upload
          </Dialog.Trigger>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top" align="center">
        {disabledMessage}
      </Tooltip.Content>
    </Tooltip.Root>
  {:else}
    <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
      Upload
    </Dialog.Trigger>
  {/if}
  <Dialog.Content class="sm:max-w-130">
    <Dialog.Header>
      <Dialog.Title>Upload Molecule File</Dialog.Title>
      <Dialog.Description>
        Upload an XYZ file containing molecular structure data.
      </Dialog.Description>
    </Dialog.Header>

    <form
      onsubmit={handleSubmit}
      enctype="multipart/form-data"
      class="grid gap-6"
    >
      <Field.Set>
        <Field.Legend>File</Field.Legend>
        <Field.Field data-invalid={fileInvalid ? true : undefined}>
          <Field.Label>Select File</Field.Label>
          <Field.Content>
            <Input type="file" accept=".xyz" onchange={handleFileChange} />
          </Field.Content>
          {#if fileError}
            <Field.Error>{fileError}</Field.Error>
          {/if}
        </Field.Field>
      </Field.Set>

      <Field.Set>
        <Field.Legend>Metadata</Field.Legend>
        <Field.Group class="grid gap-4">
          <Field.Field data-invalid={moleculeNameInvalid ? true : undefined}>
            <Field.FieldLabel>Molecule Name</Field.FieldLabel>
            <Field.Content>
              <Input
                type="text"
                placeholder={filenameStem || 'Molecule name'}
                bind:value={moleculeNameValue}
              />
            </Field.Content>
            {#if nameConflict}
              <Field.Error
                >A molecule with this name already exists.</Field.Error
              >
            {/if}
            {#if moleculeNameError}
              <Field.Error>{moleculeNameError}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field data-invalid={descriptionInvalid ? true : undefined}>
            <Field.FieldLabel>Description</Field.FieldLabel>
            <Field.Content>
              <Textarea.Root
                rows={3}
                placeholder="Describe the molecule"
                bind:value={descriptionValue}
              />
            </Field.Content>
            {#if descriptionError}
              <Field.Error>{descriptionError}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field data-invalid={stateInvalid ? true : undefined}>
            <Field.FieldLabel>State</Field.FieldLabel>
            <Field.Content>
              <Input type="number" min="0" step="1" bind:value={stateValue} />
            </Field.Content>
            <Field.Description
              >Use 0 for ground and 1 for excited.</Field.Description
            >
            {#if stateError}
              <Field.Error>{stateError}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field data-invalid={atomCountInvalid ? true : undefined}>
            <Field.FieldLabel>Atom Count</Field.FieldLabel>
            <Field.Content>
              <Input
                type="number"
                min="1"
                step="1"
                bind:value={atomCountValue}
              />
            </Field.Content>
            <Field.Description>Prefilled from the .xyz file.</Field.Description>
            {#if atomCountError}
              <Field.Error>{atomCountError}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field data-invalid={referenceInvalid ? true : undefined}>
            <Field.FieldLabel>Reference</Field.FieldLabel>
            <Field.Content>
              <Input
                type="text"
                placeholder="DOI or citation (optional)"
                bind:value={referenceValue}
              />
            </Field.Content>
            {#if referenceError}
              <Field.Error>{referenceError}</Field.Error>
            {/if}
          </Field.Field>
        </Field.Group>
      </Field.Set>

      {#if submitError}
        <div class="text-sm text-destructive">{submitError}</div>
      {/if}

      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: 'outline' })}>
          Cancel
        </Dialog.Close>
        <Button.Root type="submit" disabled={submitting || nameConflict}>
          {#if submitting}
            <Spinner class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Upload
        </Button.Root>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
