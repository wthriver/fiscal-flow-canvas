
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import { Scan, Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface ScannedReceipt {
  id: string;
  fileName: string;
  uploadDate: string;
  status: "Processing" | "Completed" | "Failed";
  extractedData?: {
    vendor: string;
    amount: number;
    date: string;
    category: string;
  };
}

export const ReceiptScanner = () => {
  const [receipts, setReceipts] = useState<ScannedReceipt[]>([
    {
      id: "receipt-1",
      fileName: "office_supplies_receipt.jpg",
      uploadDate: "2025-05-20",
      status: "Completed",
      extractedData: {
        vendor: "Office Depot",
        amount: 127.50,
        date: "2025-05-20",
        category: "Office Supplies"
      }
    },
    {
      id: "receipt-2",
      fileName: "lunch_meeting.pdf",
      uploadDate: "2025-05-22",
      status: "Processing"
    }
  ]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const newReceipt: ScannedReceipt = {
        id: `receipt-${Date.now()}-${Math.random()}`,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "Processing"
      };

      setReceipts(prev => [newReceipt, ...prev]);
      toast.success(`Receipt ${file.name} uploaded successfully`);

      // Simulate OCR processing
      setTimeout(() => {
        setReceipts(prev => prev.map(receipt => 
          receipt.id === newReceipt.id 
            ? {
                ...receipt,
                status: "Completed" as const,
                extractedData: {
                  vendor: "Auto-detected Vendor",
                  amount: Math.random() * 200 + 10,
                  date: new Date().toISOString().split('T')[0],
                  category: "Business Expense"
                }
              }
            : receipt
        ));
        toast.success("Receipt processed successfully");
      }, 3000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const createExpenseFromReceipt = (receipt: ScannedReceipt) => {
    if (!receipt.extractedData) return;
    
    toast.success("Expense created from receipt");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Receipt Scanner & OCR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p>Drop the receipt files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop receipt files here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports JPG, PNG, and PDF files
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Receipts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{receipt.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {receipt.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        receipt.status === "Completed" ? "default" :
                        receipt.status === "Processing" ? "secondary" : "destructive"
                      }
                    >
                      {receipt.status === "Processing" && <Clock className="h-3 w-3 mr-1" />}
                      {receipt.status === "Completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {receipt.status}
                    </Badge>
                  </div>
                </div>

                {receipt.extractedData && (
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-2">Extracted Data:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <Label>Vendor</Label>
                        <p>{receipt.extractedData.vendor}</p>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <p>${receipt.extractedData.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label>Date</Label>
                        <p>{receipt.extractedData.date}</p>
                      </div>
                      <div>
                        <Label>Category</Label>
                        <p>{receipt.extractedData.category}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => createExpenseFromReceipt(receipt)}
                    >
                      Create Expense
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
