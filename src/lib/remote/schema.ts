import z from 'zod';

export const uploadSchema = z.object({
  moleculeName: z.string().trim().min(1),
  description: z.string().trim().min(1),
  state: z.number().int().min(0),
  reference: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length ? value : null)),
  atomCount: z.number().int().positive(),
  file: z
    .instanceof(File)
    .refine((value) => value.name.length > 0, 'Please select a file.'),
});
