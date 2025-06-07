
import React from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback = null
}) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    return null;
  }

  const hasAccess = allowedRoles.some(role => hasRole(role));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
