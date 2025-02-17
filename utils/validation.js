const { z } = require("zod");
const mongoose = require("mongoose");
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
  brandId: z.string().min(3, { message: "الفئة مطلوبة" }),
  images: z
    .array(z.string().url({ message: "رابط الصورة غير صالح" }))
    .nonempty({ message: "يجب إدخال صورة على الأقل" }),
  quality: z.number().int({ message: "يجب أن تكون الجودة عددًا صحيحًا" }),
  sex: z.enum(["Male", "Female"], {
    message: "يجب أن يكون الجنس 'ذكر' أو 'أنثى'",
  }),
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
const orderSchema = z.object({
  customerName: z.string().min(1, "اسم الزبون مطلوب"),
  customerFamilyName: z.string().min(1, "اللقب مطلوب"),
  customerEmail: z.string().email("البريد الإلكتروني غير صالح"),
  phonenumber: z
    .array(
      z
        .string()
        .regex(/^\d{9,15}$/, "رقم الهاتف غير صالح، يجب أن يحتوي على 9-15 رقمًا")
    )
    .min(1, "يجب إدخال رقم هاتف واحد على الأقل"),

  delivery: z.object({
    willaya: z.string().min(1, "الولاية مطلوبة"),
    price: z.number().min(0, "سعر التوصيل يجب أن يكون رقمًا موجبًا"),
  }),

  perfumeInOrder: z
    .array(
      z.object({
        Perfume: z
          .string()
          .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "معرف العطر غير صالح",
          }),
        bottles: z
          .array(
            z.object({
              size: z.number().positive("حجم الزجاجة يجب أن يكون رقمًا موجبًا"),
              price: z.number().positive("السعر يجب أن يكون رقمًا موجبًا"),
              quantity: z
                .number()
                .int()
                .positive("الكمية يجب أن تكون عددًا صحيحًا موجبًا")
                .default(1),
            })
          )
          .min(1, "يجب إدخال زجاجة واحدة على الأقل"),
      })
    )
    .min(1, "يجب إدخال عطر واحد على الأقل"),

  totalPrice: z.number().optional(),
});
module.exports = {
  registerSchema,
  BrandSchema,
  PerfumeSchema,
  orderSchema,
};
