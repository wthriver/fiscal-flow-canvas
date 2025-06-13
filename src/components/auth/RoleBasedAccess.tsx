
import React from 'react';

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  allowedRoles, 
  children 
}) => {
  // For now, we'll assume the user has admin access
  // In a real app, this would check the user's actual role
  const userRole = 'Admin';
  
  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return null;
};
