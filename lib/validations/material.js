import { z } from 'zod'

// Helper to transform null to undefined
const nullToUndefined = z.any().transform(val => val === null ? undefined : val)

export const materialSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50),
  name: z.string().min(1, "Name is required").max(100),
  description: nullToUndefined.pipe(z.string().max(500).optional()),
  quantity: nullToUndefined.pipe(z.number().int().min(0, "Quantity must be non-negative").default(0)),
  unit: nullToUndefined.pipe(z.string().min(1, "Unit is required").max(20).default("pieces")),
  unitPrice: nullToUndefined.pipe(z.number().min(0, "Price must be non-negative").default(0)),
  category: nullToUndefined.pipe(z.string().max(50).optional()),
  supplier: nullToUndefined.pipe(z.string().max(100).optional()),
  location: nullToUndefined.pipe(z.string().max(100).optional()),
  minStockLevel: nullToUndefined.pipe(z.number().int().min(0, "Min stock level must be non-negative").default(10)),
  status: nullToUndefined.pipe(z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'))
})

export const materialUpdateSchema = materialSchema.partial()
