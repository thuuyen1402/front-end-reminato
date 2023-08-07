import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const signInValidation = toFormikValidationSchema(
  z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email"),
    password: z
      .string({ required_error: "password have at least 6 characters"} )
      .min(6, "password have at least 6 characters"),
  })
);
