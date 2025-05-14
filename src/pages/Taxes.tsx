
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaxCalculator } from "@/components/taxes/TaxCalculator";
import { FileText, Download, Calendar, Clock } from "lucide-react";

const Taxes = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tax Management</h1>
          <p className="text-muted-foreground">Prepare and manage your tax filings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Tax</p>
                <p className="text-2xl font-bold">$14,325.00</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <FileText size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deductions</p>
                <p className="text-2xl font-bold">$5,250.00</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Download size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Filing</p>
                <p className="text-2xl font-bold">Q2 2025</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                <Calendar size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <Clock size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TaxCalculator />
    </div>
  );
};

export default Taxes;
