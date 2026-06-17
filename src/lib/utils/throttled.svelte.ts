/**
 * Creates a throttled reactive value that updates at most once per interval.
 * Unlike debouncing (which waits until input stops), throttling updates
 * at regular intervals while the input is changing.
 *
 * @param getValue - A function that returns the current value to throttle
 * @param interval - The minimum time between updates in milliseconds (default: 150ms)
 * @returns An object with a reactive `current` property
 *
 * @example
 * ```svelte
 * <script>
 *   import { throttled } from '$lib/utils/throttled.svelte';
 *
 *   let count = $state(0);
 *   const throttledCount = throttled(() => count, 200);
 *
 *   // If count changes rapidly (e.g., 0→100 over 1s),
 *   // throttledCount.current updates every 200ms with intermediate values
 * </script>
 * ```
 */
export function throttled<T>(
  getValue: () => T,
  interval = 150,
): { readonly current: T } {
  let value = $state<T>(getValue());
  let lastUpdateTime = 0;
  let pendingTimeoutId: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    const newValue = getValue();
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime;

    // Clear any pending trailing update
    if (pendingTimeoutId !== undefined) {
      clearTimeout(pendingTimeoutId);
      pendingTimeoutId = undefined;
    }

    if (timeSinceLastUpdate >= interval) {
      // Enough time has passed, update immediately
      value = newValue;
      lastUpdateTime = now;
    } else {
      // Schedule an update for when the interval completes
      const remainingTime = interval - timeSinceLastUpdate;
      pendingTimeoutId = setTimeout(() => {
        value = getValue();
        lastUpdateTime = Date.now();
        pendingTimeoutId = undefined;
      }, remainingTime);
    }

    // Cleanup on effect re-run or destroy
    return () => {
      if (pendingTimeoutId !== undefined) {
        clearTimeout(pendingTimeoutId);
        pendingTimeoutId = undefined;
      }
    };
  });

  return {
    get current() {
      return value;
    },
  };
}
