<script lang="ts">
  import { Crop, MessageSquare, X } from '@lucide/svelte';
  import { toCanvas } from 'html-to-image';

  import { tick } from 'svelte';

  import { browser } from '$app/environment';
  import { page } from '$app/state';

  import * as Button from '$shadcn/ui/button/index.js';
  import * as Checkbox from '$shadcn/ui/checkbox/index.js';
  import * as Dialog from '$shadcn/ui/dialog/index.js';
  import * as Field from '$shadcn/ui/field/index.js';
  import * as Sidebar from '$shadcn/ui/sidebar/index.js';
  import * as Textarea from '$shadcn/ui/textarea/index.js';

  import { submitFeedback } from '$remote';

  type DragState = {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  };

  type RegionRect = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  const categoryOptions = [
    { label: 'Content', value: 'Content' },
    { label: 'Interface', value: 'Interface' },
    { label: 'Bug', value: 'Bug' },
    { label: 'Suggestion', value: 'Suggestion' },
  ] as const;

  let open = $state(false);
  let selecting = $state(false);
  let drag = $state<DragState | null>(null);
  let region = $state<RegionRect | null>(null);
  let regionImage = $state<string | null>(null);
  let selectionError = $state<string | null>(null);

  const pageUrl = $derived(page.url.href);
  const regionJson = $derived(region ? JSON.stringify(region) : '');
  const regionImageValue = $derived(regionImage ?? '');

  const selectionRect = $derived.by(() => {
    if (!drag) return null;
    const x = Math.min(drag.startX, drag.currentX);
    const y = Math.min(drag.startY, drag.currentY);
    const width = Math.abs(drag.currentX - drag.startX);
    const height = Math.abs(drag.currentY - drag.startY);
    return { x, y, width, height };
  });

  const selectionRectDisplay = $derived.by(() => {
    if (!selectionRect || !browser) return selectionRect;
    return {
      ...selectionRect,
      x: selectionRect.x - window.scrollX,
      y: selectionRect.y - window.scrollY,
    };
  });

  function resetSelection() {
    selecting = false;
    drag = null;
    region = null;
    regionImage = null;
    selectionError = null;
  }

  function startSelection() {
    if (!browser) return;
    open = false;
    selecting = true;
    drag = null;
    selectionError = null;
  }

  function onPointerDown(event: PointerEvent) {
    if (!selecting) return;
    selectionError = null;
    drag = {
      startX: event.pageX,
      startY: event.pageY,
      currentX: event.pageX,
      currentY: event.pageY,
    };
  }

  function onPointerMove(event: PointerEvent) {
    if (!drag) return;
    drag = {
      ...drag,
      currentX: event.pageX,
      currentY: event.pageY,
    };
  }

  async function onPointerUp(event: PointerEvent) {
    if (!drag) return;
    const finalDrag = {
      ...drag,
      currentX: event.pageX,
      currentY: event.pageY,
    };
    const rect = {
      x: Math.min(finalDrag.startX, finalDrag.currentX),
      y: Math.min(finalDrag.startY, finalDrag.currentY),
      width: Math.abs(finalDrag.currentX - finalDrag.startX),
      height: Math.abs(finalDrag.currentY - finalDrag.startY),
    };

    drag = null;
    selecting = false;

    if (rect.width < 12 || rect.height < 12) {
      selectionError = 'Selection is too small. Try a larger region.';
      return;
    }

    await tick();
    const image = await captureRegion(rect);
    open = true;
    if (!image) {
      selectionError = 'Unable to capture the selected region.';
      return;
    }

    region = rect;
    regionImage = image;
  }

  async function captureRegion(rect: RegionRect) {
    if (!browser) return null;
    const target = document.documentElement;
    if (!target) return null;

    try {
      const canvas = await toCanvas(target, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        width: target.scrollWidth,
        height: target.scrollHeight,
        skipFonts: true,
      });

      const cropped = document.createElement('canvas');
      cropped.width = Math.max(1, Math.floor(rect.width));
      cropped.height = Math.max(1, Math.floor(rect.height));

      const ctx = cropped.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(
        canvas,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height,
      );

      return cropped.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to capture feedback region', error);
      return null;
    }
  }

  function handleCancel() {
    open = false;
    resetSelection();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && selecting) {
      resetSelection();
    }
  }

  function checkboxFieldProps(value: string) {
    const { type: _type, ...rest } = submitFeedback.fields.categories.as(
      'checkbox',
      value,
    );
    return rest;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<Sidebar.MenuItem>
  <Sidebar.MenuButton
    tooltipContent="Feedback"
    onclick={() => {
      open = true;
    }}
  >
    <MessageSquare />
    <span>Feedback</span>
  </Sidebar.MenuButton>
</Sidebar.MenuItem>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-140">
    <Dialog.Header>
      <Dialog.Title>Share feedback</Dialog.Title>
    </Dialog.Header>

    <form {...submitFeedback} class="mt-4 space-y-6">
      <input
        {...submitFeedback.fields.url.as('text')}
        type="hidden"
        value={pageUrl}
      />
      <input
        {...submitFeedback.fields.region.as('text')}
        type="hidden"
        value={regionJson}
      />
      <input
        {...submitFeedback.fields.regionImage.as('text')}
        type="hidden"
        value={regionImageValue}
      />

      <Field.Set>
        <Field.Legend>Categories</Field.Legend>
        <Field.Description>Select any that apply.</Field.Description>
        <Field.Group data-slot="checkbox-group" class="grid grid-cols-2 gap-3">
          {#each categoryOptions as option (option.value)}
            <Field.Field orientation="horizontal">
              <Checkbox.Root {...checkboxFieldProps(option.value)} />
              <Field.Label>{option.label}</Field.Label>
            </Field.Field>
          {/each}
        </Field.Group>
      </Field.Set>

      <Field.Set>
        <Field.Legend>Region</Field.Legend>
        <Field.Description>
          Optionally capture screenshot of a relevant region.
        </Field.Description>
        <Field.Field>
          <Field.Content class="flex flex-col gap-3">
            <div class="flex grow items-center gap-3">
              <Button.Root
                type="button"
                variant="outline"
                onclick={startSelection}
                class="grow"
              >
                <Crop class="size-4" />
                Select region
              </Button.Root>

              {#if regionImage}
                <Button.Root
                  type="button"
                  variant="destructive"
                  onclick={resetSelection}
                  class="grow"
                >
                  <X class="size-4" />
                  Clear selection
                </Button.Root>
              {/if}
            </div>

            {#if selectionError}
              <div class="text-xs text-destructive">{selectionError}</div>
            {/if}

            {#if regionImage}
              <img
                src={regionImage}
                alt="Selected region preview"
                class="max-h-md max-w-md rounded-md border"
              />
            {/if}
          </Field.Content>
        </Field.Field>
      </Field.Set>

      <Field.Set>
        <Field.Legend>Comment</Field.Legend>
        <Field.Field>
          <Field.Content>
            <Textarea.Root
              rows={5}
              placeholder="..."
              {...submitFeedback.fields.comment.as('text')}
              required
            />
          </Field.Content>
          {#each submitFeedback.fields.comment.issues() as issue (issue.message)}
            <Field.Error>{issue.message}</Field.Error>
          {/each}
        </Field.Field>
      </Field.Set>

      <Dialog.Footer class="gap-2">
        <Button.Root type="button" variant="ghost" onclick={handleCancel}>
          Cancel
        </Button.Root>
        <Button.Root type="submit">Submit</Button.Root>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

{#if selecting}
  <div
    class="fixed inset-0 z-50 cursor-crosshair bg-black/20"
    role="presentation"
    aria-hidden="true"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
  >
    <div
      class="absolute top-4 left-4 rounded-md bg-background/90 px-3 py-2 text-xs shadow"
    >
      Drag to select a region. Press Escape to cancel.
    </div>
    {#if selectionRectDisplay}
      <div
        class="absolute border-2 border-primary bg-primary/15"
        style={`left: ${selectionRectDisplay.x}px; top: ${selectionRectDisplay.y}px; width: ${selectionRectDisplay.width}px; height: ${selectionRectDisplay.height}px;`}
      ></div>
    {/if}
  </div>
{/if}
