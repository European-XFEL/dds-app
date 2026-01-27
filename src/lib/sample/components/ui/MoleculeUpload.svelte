<script lang="ts">
  import { Button, buttonVariants } from '$shadcn/ui/button/index.js';
  import * as Dialog from '$shadcn/ui/dialog/index.js';
  import { Input } from '$shadcn/ui/input/index.js';
  import { Label } from '$shadcn/ui/label/index.js';
  import Spinner from '$shadcn/ui/spinner/spinner.svelte';

  import { listMolecules, uploadMolecule } from '$lib/data.remote';

  type Molecules = Awaited<ReturnType<typeof listMolecules>>;

  interface Props {
    molecules?: Molecules;
  }

  let { molecules = $bindable() }: Props = $props();

  let name: string | null = $state(null);
  let error: string | null = $state(null);
  let files: FileList | null = $state(null);
  let uploading: boolean = $state(false);
  let open = $state(false);

  let file = $derived.by<File | null>(() => files?.[0] ?? null);
  let name_placeholder = $derived.by<string>(() => {
    if (!file) return '';
    return file.name.replace(/\.[^/.]+$/, '');
  });

  $effect(() => {
    let current_name = name ?? name_placeholder;
    if (molecules && molecules.find((m) => m.name === current_name)) {
      error = 'A molecule with this name already exists.';
      if (!name) {
        name = name_placeholder;
      }
    } else {
      error = null;
    }
  });

  async function upload() {
    error = null;
    if (!file) {
      error = 'Please select a file to upload.';
      return;
    }

    uploading = true;

    const contents = await file.text();

    uploadMolecule({
      name: name ?? name_placeholder,
      filename: file.name,
      contents,
    })
      .then(async (response) => {
        if (response?.error) {
          error = response.error;
          return;
        }
        if (molecules && response.result) {
          molecules.push(response.result);
        }
        open = false;
      })
      .catch((e) => {
        error = e.message || 'An error occurred during upload.';
      })
      .finally(() => {
        uploading = false;
      });
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
    Upload
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Upload Molecule File</Dialog.Title>
      <Dialog.Description>
        Choose a .xyz file and provide a name (optional).
      </Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-4">
      <div class="grid gap-3">
        <Label for="file">Select File</Label>
        <input
          id="file"
          name="file"
          accept=".xyz"
          class="file-input"
          type="file"
          max="1"
          bind:files
        />
      </div>
      <div class="grid gap-3">
        <Label for="name-1">Name</Label>
        <Input
          id="name-1"
          name="name"
          placeholder={name_placeholder}
          bind:value={name}
        />
      </div>
      {#if error}
        <div class="text-sm text-destructive">{error}</div>
      {/if}
    </div>

    <Dialog.Footer>
      <Dialog.Close class={buttonVariants({ variant: 'outline' })}>
        Cancel
      </Dialog.Close>
      <Button type="submit" onclick={upload} disabled={uploading || !!error}>
        Upload
        {#if uploading}
          <Spinner class="mr-2 h-4 w-4 animate-spin" />
        {/if}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
