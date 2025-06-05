
import React from "react";
import { AuditTrail } from "@/components/audit/AuditTrail";

const AuditTrailPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <AuditTrail />
    </div>
  );
};

export default AuditTrailPage;
