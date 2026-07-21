import { z } from 'zod';

/**
 * Common Zod validators to ensure data integrity and prevent injection.
 */
export const SecurityValidators = {
  // Passwords must be at least 8 chars, contain one letter and one number
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
    
  // Standard email validation
  email: z.string().email('Invalid email format'),
  
  // Safe string that prevents obvious injection characters
  safeString: z.string()
    .min(1)
    .regex(/^[^<>{}]*$/, 'Input contains invalid characters'),
    
  // Numeric ID
  id: z.number().int().positive(),
};
