
import React from "react";
import { ComprehensiveAuditTrail } from "@/components/audit/ComprehensiveAuditTrail";

const AuditTrailPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <ComprehensiveAuditTrail />
    </div>
  );
};

export default AuditTrailPage;
