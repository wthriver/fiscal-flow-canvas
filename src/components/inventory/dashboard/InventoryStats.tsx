
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InventoryStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">5</p>
        </CardContent>
      </Card>
      
      <Card className="bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Low Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2</p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Out of Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">1</p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Inventory Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$7,798.75</p>
        </CardContent>
      </Card>
    </div>
  );
};
