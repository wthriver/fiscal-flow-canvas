
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  category: string;
  reconciled: boolean;
}

interface TransactionEditModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSave: () => void;
}

export const TransactionEditModal: React.FC<TransactionEditModalProps> = ({
  transaction,
  onClose,
  onSave
}) => {
  const [editedCategory, setEditedCategory] = useState(transaction.category);
  const [note, setNote] = useState("");

  const handleSaveChanges = () => {
    // In a real app, we would save the changes to the transaction here
    onSave();
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-background shadow-sm">
      <h3 className="text-lg font-medium mb-4">Edit Transaction Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input type="text" value={transaction.date} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input type="text" value={transaction.amount} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input type="text" value={transaction.description} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input 
            type="text" 
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Add Note</label>
          <Textarea 
            placeholder="Add details about this transaction..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              transaction.reconciled 
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {transaction.reconciled ? "Reconciled" : "Pending"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
