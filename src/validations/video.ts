import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const videoSharingValidation = toFormikValidationSchema(
  z.object({
    url: z
      .string({
        required_error: "Url video is required",
      }).url()
  })
);
