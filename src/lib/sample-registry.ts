type RegistrySnapshot = Map<string, string>;

type Listener = (snapshot: RegistrySnapshot) => void;

export type SampleRegistry = {
	subscribe(listener: Listener): () => void;
	setName(sampleId: string, name: string): void;
	remove(sampleId: string): void;
	getSnapshot(): RegistrySnapshot;
};

export function createSampleRegistry(): SampleRegistry {
	let names: RegistrySnapshot = new Map();
	const listeners = new Set<Listener>();

	function emit(next: RegistrySnapshot) {
		for (const listener of listeners) {
			listener(new Map(next));
		}
	}

	function update(fn: (current: RegistrySnapshot) => RegistrySnapshot) {
		names = fn(new Map(names));
		emit(names);
	}

	return {
		subscribe(listener) {
			listeners.add(listener);
			listener(new Map(names));
			return () => {
				listeners.delete(listener);
			};
		},
		setName(sampleId, name) {
			update((current) => {
				current.set(sampleId, name);
				return current;
			});
		},
		remove(sampleId) {
			update((current) => {
				current.delete(sampleId);
				return current;
			});
		},
		getSnapshot() {
			return new Map(names);
		},
	};
}

export const sampleRegistryKey = Symbol("sample-registry");
