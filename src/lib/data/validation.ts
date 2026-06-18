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

export type UploadInput = z.infer<typeof uploadSchema>;

export const feedbackCategories = [
  'Content',
  'Interface',
  'Bug',
  'Suggestion',
] as const;

export const feedbackSchema = z.object({
  url: z.string().url(),
  comment: z.string().trim().max(2000).optional(),
  categories: z
    .array(z.enum(feedbackCategories))
    .optional()
    .transform((value) => value ?? []),
  region: z.string().optional(),
  regionImage: z.string().optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const simulationSchema = z.object({
  fileId: z.string(),
  qRange: z.object({
    min: z.number(),
    max: z.number(),
    step: z.number(),
  }),
});

export type SimulationInput = z.infer<typeof simulationSchema>;
