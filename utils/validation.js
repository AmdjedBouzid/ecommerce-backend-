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
  phonenumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Your phone number must be 10 digits" }),
});

const categorySchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  img: z.string().url({ message: "Image must be a valid URL" }),
  description: z.string(),
});

const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  price: z.number().min(1, "Price must be a non-negative number"),
  description: z.string().min(10, "Description is required"),
  sizes: z.array(
    z.object({
      size: z.enum(["L", "XL", "M"], "Invalid size"),
      numbreDePiece: z.number().min(0, "Number of pieces must be >= 0"),
    })
  ),
  images: z.array(z.string().url("Invalid image URL")),
  category: z.string().min(3, "category  is required"),
});

module.exports = { registerSchema, categorySchema, productSchema };
