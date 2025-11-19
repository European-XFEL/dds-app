<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Detector Setup</Card.Title>
			<Card.Description>Configure detector parameters</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="flex flex-col gap-2">
					<Label for="pixel-size">Pixel Size (mm)</Label>
					<Input id="pixel-size" type="number" placeholder="0.172" />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="detector-distance">Detector Distance (mm)</Label>
					<Input id="detector-distance" type="number" placeholder="200" />
				</div>
				<div class="flex flex-col gap-2">
					<Label for="wavelength">Wavelength (Å)</Label>
					<Input id="wavelength" type="number" placeholder="1.54" />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
