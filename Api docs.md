# API Documentation

## 1- Brand crud operations

### **Base URL**

```
https://l0f7sf06-5000.euw.devtunnels.ms
```

## **Authentication**

- some endpoints require **admin authentication** (token verification).

---

## **1. Add a New Brand**

### **Endpoint:**

```
POST /api/Brand
```

### **Description:**

Creates a new brand (Admin only).

### **Request Body (JSON):**

```json
{
  "name": "Chanel",
  "img": "https://example.com/image.jpg",
  "description": "Luxury perfume brand"
}
```

### **Validation Rules:**

```javascript
const BrandSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب" }),
  img: z.string().url({ message: "يجب أن تكون الصورة رابط URL صالحًا" }),
  description: z.string(),
});
```

### **Response:**

- **201 Created:**

```json
{
  "message": "تمت إضافة الشركة بنجاح",
  "data": {
    "_id": "123456",
    "name": "Chanel",
    "img": "https://example.com/image.jpg",
    "description": "Luxury perfume brand"
  }
}
```

- **400 Bad Request** (Invalid data)
- **500 Internal Server Error**

---

## **2. Get All Brands**

### **Endpoint:**

```
GET /api/Brand
```

### **Description:**

Retrieves all available brands.

### **Response:**

- **200 OK:**

```json
{
  "message": "تم جلب الشركات بنجاح",
  "brands": [
    {
      "_id": "123456",
      "name": "Chanel",
      "img": "https://example.com/image.jpg",
      "description": "Luxury perfume brand"
    }
  ]
}
```

- **500 Internal Server Error**

---

## **3. Get a Brand by ID**

### **Endpoint:**

```
GET /api/Brand/:id
```

### **Description:**

Fetches a specific brand by its ID.

### **Response:**

- **200 OK:**

```json
{
  "_id": "123456",
  "name": "Chanel",
  "img": "https://example.com/image.jpg",
  "description": "Luxury perfume brand"
}
```

- **404 Not Found** (Brand does not exist)
- **500 Internal Server Error**

---

## **4. Update a Brand by ID**

### **Endpoint:**

```
PUT /api/Brand/:id
```

### **Description:**

Updates brand information (Admin only).

### **Request Body (JSON):**

```json
{
  "name": "Updated Chanel",
  "img": "https://example.com/new-image.jpg",
  "description": "Updated description"
}
```

### **Validation Rules:**

Same as **Add a New Brand**

### **Response:**

- **200 OK:**

```json
{
  "message": "تم تحديث الشركة بنجاح",
  "data": {
    "_id": "123456",
    "name": "Updated Chanel",
    "img": "https://example.com/new-image.jpg",
    "description": "Updated description"
  }
}
```

- **404 Not Found** (Brand does not exist)
- **400 Bad Request** (Invalid data)
- **500 Internal Server Error**

---

## **5. Delete a Brand by ID**

### **Endpoint:**

```
DELETE /api/Brand/:id
```

### **Description:**

Deletes a brand and its associated perfumes (Admin only).

### **Response:**

- **200 OK:**

```json
{
  "message": "تم حذف الشركة بنجاح"
}
```

- **404 Not Found** (Brand does not exist)
- **500 Internal Server Error**

---

## **6. Delete All Brands**

### **Endpoint:**

```
DELETE /api/Brand/delete/all
```

### **Description:**

Deletes all brands and their products (Admin only).

### **Response:**

- **200 OK:**

```json
{
  "message": "تم حذف جميع الشركات ومنتجاتها بنجاح"
}
```

- **500 Internal Server Error**

---

# Perfume API Documentation

## Base URL

```
https://l0f7sf06-5000.euw.devtunnels.ms/api/Perfume
```

---

## **1. Add a New Perfume**

### **Endpoint:** `POST /`

### **Description:** Adds a new perfume

### **Access:** Private (Admin Only)

### **Request Body (JSON):**

```json
{
  "name": "Chanel No.5",
  "description": "A classic and luxurious fragrance.",
  "bottles": [
    { "size": 50, "price": 120 },
    { "size": 100, "price": 200 }
  ],
  "images": [
    "https://example.com/perfume1.jpg",
    "https://example.com/perfume2.jpg"
  ],
  "brandId": "65b1234567890abcdef12345"
}
```

### **Validation:**

- `name`: Min 3 characters
- `description`: Min 10 characters
- `bottles`: At least one bottle with `size` (positive integer) and `price` (positive number)
- `images`: Must be a valid URL array
- `brandId`: Must be a valid string

### **Response:**

#### **Success (201 - Created)**

```json
{
  "message": "تمت إضافة العطر بنجاح",
  "Perfume": {
    "_id": "65b67890abcdef1234567890",
    "name": "Chanel No.5",
    "description": "A classic and luxurious fragrance.",
    "bottles": [
      { "size": 50, "price": 120 },
      { "size": 100, "price": 200 }
    ],
    "images": [
      "https://example.com/perfume1.jpg",
      "https://example.com/perfume2.jpg"
    ],
    "brandId": "65b1234567890abcdef12345"
  }
}
```

#### **Error (400 - Validation Error)**

```json
{
  "message": "اسم المنتج مطلوب"
}
```

#### **Error (409 - Conflict)**

```json
{
  "message": "العطر موجود في مخزنك من قبل"
}
```

---

## **2. Get All Perfumes**

### **Endpoint:** `GET /?page=1&limit=6`

### **Description:** Fetch all perfumes with pagination

### **Access:** Private (Admin Only)

### **Response:**

#### **Success (200 - OK)**

```json
[
  {
    "_id": "65b67890abcdef1234567890",
    "name": "Chanel No.5",
    "description": "A classic and luxurious fragrance.",
    "bottles": [{ "size": 50, "price": 120 }],
    "images": ["https://example.com/perfume1.jpg"],
    "brandId": "65b1234567890abcdef12345"
  }
]
```

#### **Error (500 - Server Error)**

```json
{
  "message": "خطأ أثناء جلب العطور",
  "error": "Database connection failed"
}
```

---

## **3. Get Perfume by ID**

### **Endpoint:** `GET /:id`

### **Description:** Fetch a perfume by its ID

### **Access:** Private (Admin Only)

### **Response:**

#### **Success (200 - OK)**

```json
{
  "message": "تم العثور على العطر بنجاح",
  "PerfumeFounded": {
    "_id": "65b67890abcdef1234567890",
    "name": "Chanel No.5",
    "description": "A classic and luxurious fragrance.",
    "bottles": [{ "size": 50, "price": 120 }],
    "images": ["https://example.com/perfume1.jpg"],
    "brandId": "65b1234567890abcdef12345"
  }
}
```

#### **Error (404 - Not Found)**

```json
{
  "message": "لم يتم العثور على المنتج"
}
```

---

## **4. Delete Perfume by ID**

### **Endpoint:** `DELETE /:id`

### **Description:** Delete a perfume by its ID

### **Access:** Private (Admin Only)

### **Response:**

#### **Success (200 - OK)**

```json
{
  "message": "تم حذف العطر بنجاح"
}
```

#### **Error (404 - Not Found)**

```json
{
  "message": "العطر غير موجود"
}
```

---

## **5. Update Perfume**

### **Endpoint:** `PUT /:id`

### **Description:** Update perfume details

### **Access:** Private (Admin Only)

### **Request Body (JSON):** _(Same as Create Perfume)_

### **Response:**

#### **Success (200 - OK)**

```json
{
  "message": "تم تحديث العطر بنجاح",
  "Perfume": {
    "_id": "65b67890abcdef1234567890",
    "name": "Chanel No.5",
    "description": "Updated description",
    "bottles": [{ "size": 50, "price": 150 }],
    "images": ["https://example.com/new-image.jpg"],
    "brandId": "65b1234567890abcdef12345"
  }
}
```

#### **Error (404 - Not Found)**

```json
{
  "message": "العطر غير موجود"
}
```

#### **Error (409 - Conflict)**

```json
{
  "message": "يوجد بالفعل عطر بنفس الاسم في هذه الشركة"
}
```

---

## **6. Generate Random Perfumes**

### **Endpoint:** `POST /generate`

### **Description:** Generate random perfume data

### **Access:** Private (Admin Only)

### **Response:**

#### **Success (200 - OK)**

```json
{
  "message": "تم إنشاء العطور بنجاح"
}
```

#### **Error (400 - No Brands)**

```json
{
  "message": "لا توجد شركات في قاعدة البيانات"
}
```

#### **Error (500 - Server Error)**

```json
{
  "message": "فشل إنشاء العطور",
  "error": "Database error"
}
```

---

### **Notes:**

- All errors include descriptive messages.
- Every endpoint validates input using `zod` schemas.
- Responses are structured consistently for easy integration.

### **Notes:**

- Admin authentication is required for **POST, PUT, and DELETE** requests.
- API follows RESTful principles.
- Ensure proper request body validation before sending requests.

---
