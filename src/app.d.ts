import { Capabilities, Health } from '$lib/health.svelte.ts';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      health: Health;
      capabilities: Capabilities;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
