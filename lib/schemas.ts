import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  linkedinOrPortfolio: z.string().url("Enter a valid URL."),
  coverNote: z.string().min(20, "Tell us a little more (at least 20 characters)."),
  resume: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "Resume is required.")
    .refine(
      (files) => files?.[0] && ["application/pdf"].includes(files[0].type),
      "Please upload a PDF file."
    ),
  consent: z.literal(true, {
    message: "You must consent to be considered for this role.",
  }),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  reason: z.enum(["General Inquiry", "Partnership", "Careers", "Media"]),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
