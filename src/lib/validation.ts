// Zod schemas shared by client and server.
//
// Use these in:
//   - API route handlers for runtime validation
//   - React form components for client-side validation
//
// All schemas produce both a runtime validator and a TS type via `z.infer`.

import { z } from "zod";

// --- Auth ---

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  name: z.string().min(1, "Name is required").max(80).optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;

// --- Public forms ---

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Invalid email address").max(255),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export const newsletterSubscribeSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

// --- Admin content ---

const contentOrder = z.number().int().min(0).max(9999).default(0);

export const galleryItemCreateSchema = z.object({
  src: z.string().url("Must be a valid URL").max(2000),
  alt: z.string().min(1, "Alt text is required").max(200),
  caption: z.string().max(200).optional().nullable(),
  order: contentOrder.optional(),
});

export const galleryItemUpdateSchema = galleryItemCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  role: z.string().min(1, "Role is required").max(120),
  text: z.string().min(10, "Quote must be at least 10 characters").max(2000),
  order: contentOrder.optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

export type GalleryItemCreateInput = z.infer<typeof galleryItemCreateSchema>;
export type GalleryItemUpdateInput = z.infer<typeof galleryItemUpdateSchema>;
export type TestimonialCreateInput = z.infer<typeof testimonialCreateSchema>;
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>;
