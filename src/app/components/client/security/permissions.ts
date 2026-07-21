export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

/**
 * Check if the user has the required role.
 * 
 * @param userRole The role of the current user.
 * @param requiredRole The role required to access the resource.
 * @returns boolean True if the user has permission, false otherwise.
 */
export function hasPermission(userRole: string, requiredRole: Role): boolean {
  if (!userRole) return false;

  // Admin has access to everything
  if (userRole === Role.ADMIN) return true;

  return userRole === requiredRole;
}
