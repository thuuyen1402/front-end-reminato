import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const fakeSchema = toFormikValidationSchema(
    z.object({
        field1: z.string().min(1),
        field2: z.number().min(1),
        field3: z.boolean()
    })
);
