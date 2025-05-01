
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const SerialNumbersTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Serial Number Tracking</CardTitle>
          <CardDescription>Track individual inventory items by serial number</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Track individual inventory items by unique serial numbers for warranty and service purposes.</p>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Advanced Gizmo</TableCell>
                  <TableCell>SN-A0012548</TableCell>
                  <TableCell>Apr 15, 2025</TableCell>
                  <TableCell>ABC Corporation</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Sold</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Advanced Gizmo</TableCell>
                  <TableCell>SN-A0012549</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add Serial Number</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
