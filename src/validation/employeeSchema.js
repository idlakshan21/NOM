  const { z } = Zod;

export const employeeSchema = z.object({
  employeeName: z.string()
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  
  employeeContact: z.string()
    .regex(/^(070|071|074|075|076|077|078|072)[-]?[0-9]{7}$/, "Invalid contact number"),

  userAddress: z.string()
    .regex(/^[A-Za-z0-9][A-Za-z0-9\s,./-]*$/, "Invalid address"),

  userPassword: z.string()
    .min(3, "Password too short")
    .max(12, "Password too long"),

  userConfrimPassword: z.string(),

  userRoleOne: z.string().nonempty("Role is required"),
});


export const validatedEmployeeSchema = employeeSchema.refine(
  (data) => data.userPassword === data.userConfrimPassword,
  {
    message: "Passwords do not match",
    path: ["userConfrimPassword"],
  }
);
