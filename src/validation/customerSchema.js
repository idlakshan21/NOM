const { z } = Zod;


export const validatedCustomerSchema = z.object({
  customerName: z.string()
    .min(1, "Customer name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
  
  customerContact: z.string()
    .min(1, "Customer contact is required")
    .regex(/^(070|071|074|075|076|077|078|072)[-]?[0-9]{7}$/, "Invalid contact number"),

  customerCreditStatus: z.string()
    .min(1, "Credit status is required")
});