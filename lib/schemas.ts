import { z } from 'zod'

export const CounsellingRequestSchema = z.object({
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  email: z.string().email('Please enter a valid email address'),
  studentClass: z.string().min(1, 'Please select a class'),
  timestamp: z.date().optional(),
  status: z.enum(['pending', 'contacted', 'completed']).default('pending'),
  notes: z.string().optional(),
})

export type CounsellingRequest = z.infer<typeof CounsellingRequestSchema>

export const JourneyResponseSchema = z.object({
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  timestamp: z.date().optional(),
  savedSchools: z.array(z.string()).optional(),
  completed: z.boolean().default(false),
})

export type JourneyResponse = z.infer<typeof JourneyResponseSchema>
