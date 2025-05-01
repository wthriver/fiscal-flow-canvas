
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const BundlesTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bundles & Assemblies</CardTitle>
          <CardDescription>Create and manage product bundles and assemblies</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Combine multiple inventory items into bundles or assemblies for selling as a single unit.</p>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bundle Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Bundle Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Complete Tool Set</TableCell>
                  <TableCell>BDL-001</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>$125.00</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gadget Bundle Pack</TableCell>
                  <TableCell>BDL-002</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>$69.99</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Create Bundle</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
