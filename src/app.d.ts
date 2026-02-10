import { Capabilities, Health } from '$lib/server/health';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      health: Health;
      capabilities: Capabilities;
    }
    interface PageData {
      capabilities: Capabilities;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
