/// <reference lib="dom" />
import { onDestroy } from 'svelte';

import type { CartesianPoint } from '$lib/types';

export interface DragOptions {
  /** Function that returns the SVG element for coordinate calculation */
  getSvgElement: () => SVGSVGElement | null;
  /** Callback invoked during drag with new position */
  onDrag: (position: CartesianPoint) => void;
  /** Optional offset from the mouse position (for dragging by corner) */
  getOffset?: () => CartesianPoint;
}

export interface DragState {
  isDragging: boolean;
  handleMouseDown: (event: MouseEvent) => void;
}

/**
 * Creates a reusable drag behavior for SVG elements.
 * Handles mouse events and coordinate transformation from screen to SVG space.
 */
export function useDrag(options: DragOptions): DragState {
  const { getSvgElement, onDrag, getOffset } = options;

  let isDragging = $state(false);
  let dragOffset: CartesianPoint = $state({ x: 0, y: 0 });

  function handleMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const svgElement = getSvgElement();
    if (!svgElement) return;

    isDragging = true;

    // Calculate initial offset if provided
    if (getOffset) {
      const rect = svgElement.getBoundingClientRect();
      const offset = getOffset();
      dragOffset = {
        x: event.clientX - rect.left - offset.x,
        y: event.clientY - rect.top - offset.y,
      };
    }

    globalThis.addEventListener('mousemove', handleMouseMove);
    globalThis.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    const svgElement = getSvgElement();
    if (!isDragging || !svgElement) return;

    const rect = svgElement.getBoundingClientRect();
    const nextX = event.clientX - rect.left - dragOffset.x;
    const nextY = event.clientY - rect.top - dragOffset.y;
    onDrag({ x: nextX, y: nextY });
  }

  function handleMouseUp() {
    if (!isDragging) return;

    isDragging = false;
    removeGlobalListeners();
  }

  function removeGlobalListeners() {
    if (typeof globalThis === 'undefined') return;

    globalThis.removeEventListener('mousemove', handleMouseMove);
    globalThis.removeEventListener('mouseup', handleMouseUp);
  }

  onDestroy(() => {
    removeGlobalListeners();
  });

  return {
    get isDragging() {
      return isDragging;
    },
    handleMouseDown,
  };
}
