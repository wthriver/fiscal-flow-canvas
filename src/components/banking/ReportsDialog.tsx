import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "./reports/ReportHeader";
import { ReportTabs } from "./reports/ReportTabs";
import { useCompany } from "@/contexts/CompanyContext";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string;
}

export const ReportsDialog: React.FC<ReportsDialogProps> = ({ isOpen, onClose, accountId }) => {
  const { currentCompany } = useCompany();
  const account = currentCompany.bankAccounts.find(acc => acc.id === accountId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Reports</DialogTitle>
          <DialogDescription>
            Generate financial reports for {account?.name || "all accounts"}.
          </DialogDescription>
        </DialogHeader>

        <ReportHeader accountId={accountId} />
        <ReportTabs accountId={accountId} />

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
