
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const LotTrackingTab: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lot Tracking</CardTitle>
          <CardDescription>Track inventory by lot/batch number with expiration dates</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Track inventory items by lot or batch numbers to manage items that expire or need to be recalled.</p>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Premium Gadget</TableCell>
                  <TableCell>LOT-2025-042</TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>Dec 31, 2026</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Premium Gadget</TableCell>
                  <TableCell>LOT-2025-021</TableCell>
                  <TableCell>30</TableCell>
                  <TableCell>Jun 15, 2026</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add Lot</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
