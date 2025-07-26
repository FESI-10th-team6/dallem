import { z } from 'zod';

export const updateUserSchema = z.object({
  companyName: z.string({ required_error: 'form.errors.companyNameRequired' }),
  image: z.string({ required_error: 'form.errors.imageRequired' }).refine(
    (value) => {
      if (!value) return false; // required
      return value.startsWith('data:image/');
    },
    {
      message: 'form.errors.imageType',
    },
  ),
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;
