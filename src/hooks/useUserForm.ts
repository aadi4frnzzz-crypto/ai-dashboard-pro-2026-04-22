/**
 * useUserForm.ts - React Hook Form + Zod Validation
 * 
 * This is the TOP 1% pattern for forms:
 * - React Hook Form: Zero re-renders, native validation
 * - Zod: Type-safe schema validation shared with backend
 * - @hookform/resolvers: Bridge between RHF and Zod
 * 
 * Used by Vercel, Linear, Lemon Squeezy, etc.
 */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Zod schema - single source of truth for validation
const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  bio: z
    .string()
    .max(200, 'Bio must be less than 200 characters')
    .optional(),
  notifications: z.boolean().default(true),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
})

// TypeScript type auto-inferred from Zod schema
export type UserFormData = z.infer<typeof userSchema>

// Mock API call
const createUser = async (data: UserFormData) => {
  await new Promise((r) => setTimeout(r, 1000))
  if (Math.random() > 0.8) throw new Error('Server error')
  return { id: crypto.randomUUID(), ...data }
}

export function useUserForm() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema), // Zod validation
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      bio: '',
      notifications: true,
      website: '',
    },
    mode: 'onChange', // Validate on each change
  })

  // TanStack Mutation - for write operations
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(`User ${data.name} created successfully!`)
      form.reset()
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`)
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data)
  })

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
  }
}
