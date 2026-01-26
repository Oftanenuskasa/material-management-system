import { z } from 'zod'

export const materialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
  unit: z.string().min(1, "Unit is required").max(20),
  unitPrice: z.number().min(0, "Price must be non-negative"),
  category: z.string().min(1, "Category is required").max(50),
  supplier: z.string().max(100).optional(),
})
