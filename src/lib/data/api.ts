import { PUBLIC_TARGET } from '$env/static/public';

import type {
  DebyeResult,
  FeedbackInput,
  FeedbackResult,
  MoleculeFileContent,
  MoleculeInfo,
  SimRequest,
  SolventIQ,
  SolventInfo,
  UploadMoleculeResult,
} from '$lib/server/data/types';

const STATIC = PUBLIC_TARGET === 'static';

export async function listMolecules(): Promise<MoleculeInfo[]> {
  const res = await fetch('/api/molecules');
  if (!res.ok) {
    throw new Error(
      `Failed to list molecules: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function getMoleculeFileContent(
  id: string,
): Promise<MoleculeFileContent> {
  const res = await fetch(`/api/molecules?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(
      `Failed to get molecule file content: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function uploadMolecule(input: {
  moleculeName: string;
  description: string;
  state: number;
  reference: string | null;
  atomCount: number;
  file: File;
}): Promise<UploadMoleculeResult> {
  if (STATIC) {
    return {
      success: false,
      result: null,
      error: 'Uploading molecules is not supported in the static build.',
    };
  }

  const formData = new FormData();
  formData.append('moleculeName', input.moleculeName);
  formData.append('description', input.description);
  formData.append('state', String(input.state));
  if (input.reference) {
    formData.append('reference', input.reference);
  }
  formData.append('atomCount', String(input.atomCount));
  formData.append('file', input.file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Failed to upload molecule: ${res.status} ${res.statusText} ${text}`,
    );
  }

  return res.json();
}

export async function listSolvents(): Promise<SolventInfo[]> {
  const res = await fetch('/api/solvents');
  if (!res.ok) {
    throw new Error(`Failed to list solvents: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getSolventIQ(id: string): Promise<SolventIQ> {
  const res = await fetch(`/api/solvents?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(
      `Failed to get solvent IQ: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function getDebyeResult(
  request: SimRequest,
): Promise<DebyeResult> {
  const res = await fetch('/api/simulation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get Debye result: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

export async function submitFeedback(
  data: FeedbackInput,
): Promise<FeedbackResult> {
  if (STATIC) {
    return {
      success: false,
      id: null,
    };
  }

  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Failed to submit feedback: ${res.status} ${res.statusText} ${text}`,
    );
  }

  return res.json();
}
