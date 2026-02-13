const { z } = require("zod");

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  travelDates: z.string().optional().nullable(),
  interests: z.string().optional().nullable(),
  message: z.string().min(10),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

const bookingSchema = z.object({
  type: z.enum(["stay", "experience"]),
  refId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  travelDates: z.string().optional().nullable(),
  guests: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin"]).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

const chatSchema = z.object({
  message: z.string().min(1),
});

module.exports = {
  contactSchema,
  newsletterSchema,
  bookingSchema,
  loginSchema,
  registerSchema,
  refreshSchema,
  chatSchema,
};
