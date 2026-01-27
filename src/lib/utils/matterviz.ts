let promise: Promise<unknown> | null = null;

export function preloadMatterviz() {
  if (!promise) {
    promise = import('matterviz');
  }
  return promise;
}
