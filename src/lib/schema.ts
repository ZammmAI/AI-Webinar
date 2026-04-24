import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 1 && age <= 120;
  }, {
    message: "Please enter a valid age",
  }),
  phone: z.string()
    .min(9, "Too short (min 9 digits)")
    .max(10, "Too long (max 10 digits)")
    .regex(/^[0-9]+$/, "Numeric digits only"),
  role: z.enum(["developer", "designer", "entrepreneur", "student", "manager", "other"]),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const courseRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 1 && age <= 120;
  }, {
    message: "Please enter a valid age",
  }),
  phone: z.string()
    .min(9, "Too short (min 9 digits)")
    .max(12, "Too long")
    .regex(/^[0-9]+$/, "Numeric digits only"),
  nic: z.string().min(10, "Invalid NIC").max(12, "Invalid NIC"),
  gender: z.enum(["male", "female", "other"]),
  receipt: z.any().refine((files) => files?.length === 1, "Payment receipt is required"),
});

export type CourseRegistrationData = z.infer<typeof courseRegistrationSchema>;
