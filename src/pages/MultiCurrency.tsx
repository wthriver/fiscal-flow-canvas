
import React from "react";
import { MultiCurrencySupport } from "@/components/currency/MultiCurrencySupport";

const MultiCurrency: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <MultiCurrencySupport />
    </div>
  );
};

export default MultiCurrency;
