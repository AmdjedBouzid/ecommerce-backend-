const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم غير صالح" }).max(100),
  email: z
    .string()
    .min(6, { message: "البريد الإلكتروني غير صالح" })
    .max(100)
    .email({ message: "يجب أن يكون بريدًا إلكترونيًا صالحًا" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور غير صالحة" })
    .regex(/[a-zA-Z]/, { message: "يجب أن تحتوي على أحرف" })
    .regex(/[0-9]/, { message: "يجب أن تحتوي على أرقام" }),
  phonenumber: z.string().regex(/^\d{10}$/, {
    message: "يجب أن يكون رقم الهاتف مكونًا من 10 أرقام",
  }),
});

const BrandSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب" }),
  img: z.string().url({ message: "يجب أن تكون الصورة رابط URL صالحًا" }),
  description: z.string(),
});

const PerfumeSchema = z.object({
  name: z.string().min(3, { message: "اسم المنتج مطلوب" }),
  description: z.string().min(10, { message: "الوصف مطلوب" }),
  images: z.array(z.string().url({ message: "رابط الصورة غير صالح" })),
  brandId: z.string().min(3, { message: "الفئة مطلوبة" }),
  bottles: z
    .array(
      z.object({
        size: z
          .number()
          .int()
          .positive({ message: "يجب أن يكون الحجم عددًا صحيحًا موجبًا" }),
        price: z
          .number()
          .positive({ message: "يجب أن يكون السعر رقمًا موجبًا" }),
      })
    )
    .nonempty({ message: "يجب إدخال حجم زجاجة واحد على الأقل" }),
});
const OrderSchemaValidation = z.object({
  customerName: z
    .string()
    .min(3, "يجب أن يحتوي الاسم على 3 أحرف على الأقل")
    .trim(),
  customerEmail: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .trim()
    .toLowerCase(),
  phoneNumber: z
    .array(z.string().min(8, "رقم الهاتف غير صالح"))
    .min(1, "يجب إدخال رقم هاتف واحد على الأقل"),
  delivery: z.string().min(1, "يجب تحديد خيار التوصيل"),
  perfumeInOrder: z.array(z.string().min(1, "يجب إضافة منتج واحد على الأقل")),
  State: z.enum(["waiting", "accepted", "rejected"]).default("waiting"),
  totalPrice: z.number().min(0, "السعر الإجمالي يجب أن يكون رقمًا موجبًا"),
});
module.exports = {
  registerSchema,
  BrandSchema,
  PerfumeSchema,
  OrderSchemaValidation,
};
