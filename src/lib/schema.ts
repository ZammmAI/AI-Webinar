import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  age: z.string().refine((val) => {
    const age = parseInt(val, 10);
    return !isNaN(age) && age >= 18;
  }, {
    message: "You must be at least 18 years old",
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone format"),
  role: z.enum(["developer", "designer", "entrepreneur", "student", "manager", "other"]),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
