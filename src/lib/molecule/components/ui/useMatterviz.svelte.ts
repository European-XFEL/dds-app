import { onMount } from 'svelte';

export function useMatterviz<T>(loader: () => Promise<T>) {
  let component = $state<T | null>(null);
  onMount(async () => {
    component = await loader();
  });
  return { get component() { return component; } };
}
