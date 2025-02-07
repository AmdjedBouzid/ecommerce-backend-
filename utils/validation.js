const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, { message: "Your name is invalid" }).max(100),
  email: z
    .string()
    .min(6, { message: "Your email is invalid" })
    .max(100)
    .email(),
  password: z
    .string()
    .min(6, { message: "Your password is invalid" })
    .regex(/[a-zA-Z]/, { message: "Must contain letters" })
    .regex(/[0-9]/, { message: "Must contain numbers" }),
  phoneumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Your phone number must be 10 digits" }),
});

const BrandSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  img: z.string().url({ message: "Image must be a valid URL" }),
  description: z.string(),
});

const PerfumeSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description is required"),
  images: z.array(z.string().url("Invalid image URL")),
  Brand: z.string().min(3, "Category is required"),
  bottles: z
    .array(
      z.object({
        size: z.number().int().positive("Size must be a positive integer"),
        price: z.number().positive("Price must be a positive number"),
      })
    )
    .nonempty("At least one bottle size is required"),
});

module.exports = { registerSchema, BrandSchema, PerfumeSchema };
