import { z } from 'zod';

export const createGatheringSchema = z
  .object({
    name: z.string().min(1, 'form.errors.nameRequired'),
    location: z.enum(['건대입구', '을지로3가', '신림', '홍대입구'], {
      required_error: 'form.errors.locationRequired',
    }),
    type: z.enum(['OFFICE_STRETCHING', 'MINDFULNESS', 'WORKATION'], {
      required_error: 'form.errors.typeRequired',
    }),
    dateTime: z.date({
      required_error: 'form.errors.dateTimeRequired',
    }),
    registrationEnd: z.date({
      required_error: 'form.errors.registrationEndRequired',
    }),
    capacity: z.coerce.number().min(5, 'form.errors.capacityMin'),
    image: z
      .instanceof(File)
      .refine(
        (file) => {
          if (!file) return true; // optional이므로 빈 값 허용
          return file.type.startsWith('image/');
        },
        {
          message: 'form.errors.imageType',
        },
      )
      .optional(),
  })
  .refine(
    (data) => !data.registrationEnd || (data.dateTime && data.registrationEnd < data.dateTime),
    {
      message: 'form.errors.registrationEndInvalid',
      path: ['registrationEnd'],
    },
  )
  .refine((data) => data.dateTime && data.dateTime > new Date(), {
    message: 'form.errors.dateTimePast',
    path: ['dateTime'],
  });

export type CreateGatheringPayload = z.infer<typeof createGatheringSchema>;
