import React from 'react';
import { PaymentTracking as PaymentTrackingComponent } from '@/components/shared/PaymentTracking';

const PaymentTracking: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <PaymentTrackingComponent />
    </div>
  );
};

export default PaymentTracking;