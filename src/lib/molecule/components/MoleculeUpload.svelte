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

  import { listMolecules, uploadMolecule } from '$remote';

  import { uploadSchema } from '$lib/remote/schema';
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

  const uploadForm = uploadMolecule.preflight(uploadSchema);

  let filenameStem = $derived.by<string>(() => {
    if (!file) return '';
    return file.name.replace(/\.[^/.]+$/, '');
  });

  let moleculeNameValue = $derived.by<string>(
    () => uploadForm.fields.moleculeName.value() ?? '',
  );

  let nameConflict = $derived.by(
    () =>
      !!moleculeNameValue &&
      !!molecules?.some((m) => m.moleculeName === moleculeNameValue),
  );

  let fileIssues = $derived(uploadForm.fields.file?.issues() ?? []);
  let moleculeNameIssues = $derived(
    uploadForm.fields.moleculeName?.issues() ?? [],
  );
  let descriptionIssues = $derived(
    uploadForm.fields.description?.issues() ?? [],
  );
  let stateIssues = $derived(uploadForm.fields.state?.issues() ?? []);
  let atomCountIssues = $derived(uploadForm.fields.atomCount?.issues() ?? []);
  let referenceIssues = $derived(uploadForm.fields.reference?.issues() ?? []);

  let fileInvalid = $derived.by(() => !!fileError || fileIssues.length > 0);
  let moleculeNameInvalid = $derived.by(
    () => nameConflict || moleculeNameIssues.length > 0,
  );
  let descriptionInvalid = $derived.by(() => descriptionIssues.length > 0);
  let stateInvalid = $derived.by(() => stateIssues.length > 0);
  let atomCountInvalid = $derived.by(() => atomCountIssues.length > 0);
  let referenceInvalid = $derived.by(() => referenceIssues.length > 0);

  function parseAtomCount(contents: string) {
    const firstLine = contents.split(/\r?\n/, 1)[0]?.trim();
    if (!firstLine) return null;
    const match = /^(\d+)/.exec(firstLine);
    if (!match) return null;
    const parsed = Number.parseInt(match[1], 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function _parseComment(contents: string) {
    return contents.split(/\r?\n/, 2)[1]?.trim();
  }

  if (uploadForm.fields.state.value() === undefined) {
    uploadForm.fields.state.set(0);
  }

  const uploadEnhance = uploadForm.enhance(async ({ form, submit }) => {
    await submit();
    const result = uploadForm.result;

    if (result?.success && result.result) {
      if (result.result.id !== lastUploadedId && molecules) {
        molecules.push(result.result);
      }
      lastUploadedId = result.result.id;
      open = false;
      form.reset();
      file = null;
    }
  });

  function handleFileChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement | null;
    const selected = target?.files?.[0] ?? null;
    file = selected;
    fileError = null;

    if (!selected) return;

    if (!uploadForm.fields.moleculeName.value()) {
      const stem = selected.name.replace(/\.[^/.]+$/, '');
      uploadForm.fields.moleculeName.set(stem);
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
        uploadForm.fields.atomCount.set(count);
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

    <form {...uploadEnhance} enctype="multipart/form-data" class="grid gap-6">
      <Field.Set>
        <Field.Legend>File</Field.Legend>
        <Field.Field data-invalid={fileInvalid ? true : undefined}>
          <Field.Label>Select File</Field.Label>
          <Field.Content>
            <Input
              accept=".xyz"
              onchange={handleFileChange}
              {...uploadForm.fields.file.as('file')}
            />
          </Field.Content>
          {#if fileError}
            <Field.Error>{fileError}</Field.Error>
          {/if}
          {#each fileIssues as issue (issue.message)}
            <Field.Error>{issue.message}</Field.Error>
          {/each}
        </Field.Field>
      </Field.Set>

      <Field.Set>
        <Field.Legend>Metadata</Field.Legend>
        <Field.Group class="grid gap-4">
          <Field.Field data-invalid={moleculeNameInvalid ? true : undefined}>
            <Field.FieldLabel>Molecule Name</Field.FieldLabel>
            <Field.Content>
              <Input
                placeholder={filenameStem || 'Molecule name'}
                {...uploadForm.fields.moleculeName.as('text')}
              />
            </Field.Content>
            {#if nameConflict}
              <Field.Error
                >A molecule with this name already exists.</Field.Error
              >
            {/if}
            {#each moleculeNameIssues as issue (issue.message)}
              <Field.Error>{issue.message}</Field.Error>
            {/each}
          </Field.Field>

          <Field.Field data-invalid={descriptionInvalid ? true : undefined}>
            <Field.FieldLabel>Description</Field.FieldLabel>
            <Field.Content>
              <Textarea.Root
                rows={3}
                placeholder="Describe the molecule"
                {...uploadForm.fields.description.as('text')}
              />
            </Field.Content>
            {#each descriptionIssues as issue (issue.message)}
              <Field.Error>{issue.message}</Field.Error>
            {/each}
          </Field.Field>

          <Field.Field data-invalid={stateInvalid ? true : undefined}>
            <Field.FieldLabel>State</Field.FieldLabel>
            <Field.Content>
              <Input
                min="0"
                step="1"
                {...uploadForm.fields.state.as('number')}
              />
            </Field.Content>
            <Field.Description
              >Use 0 for ground and 1 for excited.</Field.Description
            >
            {#each stateIssues as issue (issue.message)}
              <Field.Error>{issue.message}</Field.Error>
            {/each}
          </Field.Field>

          <Field.Field data-invalid={atomCountInvalid ? true : undefined}>
            <Field.FieldLabel>Atom Count</Field.FieldLabel>
            <Field.Content>
              <Input
                min="1"
                step="1"
                {...uploadForm.fields.atomCount.as('number')}
              />
            </Field.Content>
            <Field.Description>Prefilled from the .xyz file.</Field.Description>
            {#each atomCountIssues as issue (issue.message)}
              <Field.Error>{issue.message}</Field.Error>
            {/each}
          </Field.Field>

          <Field.Field data-invalid={referenceInvalid ? true : undefined}>
            <Field.FieldLabel>Reference</Field.FieldLabel>
            <Field.Content>
              <Input
                placeholder="DOI or citation (optional)"
                {...uploadForm.fields.reference.as('text')}
              />
            </Field.Content>
            {#each referenceIssues as issue (issue.message)}
              <Field.Error>{issue.message}</Field.Error>
            {/each}
          </Field.Field>
        </Field.Group>
      </Field.Set>

      <Dialog.Footer>
        <Dialog.Close class={buttonVariants({ variant: 'outline' })}>
          Cancel
        </Dialog.Close>
        <Button.Root
          type="submit"
          disabled={!!uploadForm.pending || nameConflict}
        >
          {#if uploadForm.pending}
            <Spinner class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Upload
        </Button.Root>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
