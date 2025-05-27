
  const { z } = Zod;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassowrd: z.string(),
  confirmNewPassword: z.string()
});

export const validatedChangePasswordSchema = changePasswordSchema.refine(
  (data) => data.newPassowrd === data.confirmNewPassword,
  {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  }
);