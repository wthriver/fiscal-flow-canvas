
import React from "react";
import { DigitalReceiptCapture } from "@/components/expenses/DigitalReceiptCapture";

const Receipts: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Digital Receipt Capture</h1>
      <DigitalReceiptCapture />
    </div>
  );
};

export default Receipts;
