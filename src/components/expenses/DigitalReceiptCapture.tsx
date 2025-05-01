
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Camera, Upload, FileCheck, Search } from "lucide-react";

export const DigitalReceiptCapture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("camera");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<null | {
    vendor: string;
    date: string;
    amount: string;
    items: Array<{ description: string; price: string }>;
  }>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOcrResult(null);
    }
  };

  const processReceipt = () => {
    if (!previewUrl) {
      toast.error("Please upload or capture a receipt first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR result
      const mockResult = {
        vendor: "Office Supplies Inc.",
        date: "2025-04-15",
        amount: "$253.75",
        items: [
          { description: "Printer Paper", price: "$45.99" },
          { description: "Ink Cartridges", price: "$129.99" },
          { description: "Stapler", price: "$12.99" },
          { description: "Desk Organizer", price: "$34.99" },
          { description: "Pens (24pk)", price: "$29.79" }
        ]
      };
      
      setOcrResult(mockResult);
      setIsProcessing(false);
      toast.success("Receipt processed successfully", {
        description: "Extracted vendor, date, amount, and line items"
      });
    }, 2000);
  };

  const saveToExpenses = () => {
    if (!ocrResult) return;
    
    toast.success("Receipt added to expenses", {
      description: `${ocrResult.vendor} - ${ocrResult.amount} added to your expenses`
    });
    
    // Reset the form
    setPreviewUrl(null);
    setOcrResult(null);
  };

  // Mock data for recent receipts
  const recentReceipts = [
    { id: "rec1", vendor: "Office Depot", date: "2025-04-10", amount: "$153.42", status: "Processed" },
    { id: "rec2", vendor: "The Coffee Shop", date: "2025-04-09", amount: "$24.85", status: "Processed" },
    { id: "rec3", vendor: "Gas Station", date: "2025-04-07", amount: "$45.50", status: "Pending" },
    { id: "rec4", vendor: "Restaurant", date: "2025-04-05", amount: "$86.75", status: "Processed" }
  ];

  const filteredReceipts = recentReceipts.filter(receipt => 
    receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    receipt.amount.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold">Digital Receipt Capture</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Capture New Receipt</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Capture Receipt</DialogTitle>
                <DialogDescription>
                  Take a photo or upload a receipt to automatically extract information
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera" className="space-y-4">
                  <div className="flex justify-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 w-full h-64 flex flex-col items-center justify-center">
                      {!previewUrl ? (
                        <div className="text-center">
                          <Camera className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Click below to access your camera</p>
                        </div>
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Captured receipt"
                          className="max-h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      // In a real app, this would access the camera
                      // For demo purposes, we'll just use a file input
                      document.getElementById("receipt-upload")?.click();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {previewUrl ? "Retake Photo" : "Take Photo"}
                  </Button>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="flex justify-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 w-full h-64 flex flex-col items-center justify-center">
                      {!previewUrl ? (
                        <div className="text-center">
                          <Upload className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Drag and drop a receipt or click to browse</p>
                        </div>
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Uploaded receipt"
                          className="max-h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      onClick={() => document.getElementById("receipt-upload")?.click()}
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              {previewUrl && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button 
                      onClick={processReceipt} 
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? "Processing..." : "Process Receipt"}
                    </Button>
                  </div>
                
                  {ocrResult && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Extracted Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-medium">Vendor:</p>
                            <p>{ocrResult.vendor}</p>
                          </div>
                          <div>
                            <p className="font-medium">Date:</p>
                            <p>{ocrResult.date}</p>
                          </div>
                          <div>
                            <p className="font-medium">Amount:</p>
                            <p className="font-bold">{ocrResult.amount}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium">Items:</p>
                          <ul className="space-y-1">
                            {ocrResult.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.description}</span>
                                <span>{item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPreviewUrl(null);
                    setOcrResult(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveToExpenses} 
                  disabled={!ocrResult}
                >
                  Save to Expenses
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
          <CardDescription>View and manage your recently captured receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full sm:w-64 mb-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Vendor</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map(receipt => (
                  <tr key={receipt.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">{receipt.vendor}</td>
                    <td className="p-3">{receipt.date}</td>
                    <td className="p-3">{receipt.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receipt.status === "Processed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReceipts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No receipts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
