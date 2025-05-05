
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ReportHeader } from "./reports/ReportHeader";
import { ReportTabs } from "./reports/ReportTabs";
import { useCompany } from "@/contexts/CompanyContext";

interface ReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  accountName?: string;
}

export const ReportsDialog: React.FC<ReportsDialogProps> = ({ 
  isOpen, 
  onClose, 
  accountId = "",
  open,
  onOpenChange
}) => {
  const { currentCompany } = useCompany();
  const account = currentCompany.bankAccounts.find(acc => acc.id === accountId);

  // Use open/onOpenChange if provided, otherwise use isOpen/onClose
  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || (() => onClose());

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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
