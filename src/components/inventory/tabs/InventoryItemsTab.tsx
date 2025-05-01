
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const InventoryItemsTab: React.FC = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reorder Point</TableHead>
          <TableHead>Cost Price</TableHead>
          <TableHead>Sell Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-muted/50">
          <TableCell>WID-001</TableCell>
          <TableCell>Widget Pro</TableCell>
          <TableCell>Widgets</TableCell>
          <TableCell>150</TableCell>
          <TableCell>25</TableCell>
          <TableCell>$19.99</TableCell>
          <TableCell>$29.99</TableCell>
          <TableCell>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Adjust</Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-muted/50">
          <TableCell>GAD-002</TableCell>
          <TableCell>Premium Gadget</TableCell>
          <TableCell>Gadgets</TableCell>
          <TableCell>75</TableCell>
          <TableCell>15</TableCell>
          <TableCell>$29.99</TableCell>
          <TableCell>$49.99</TableCell>
          <TableCell>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Adjust</Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-muted/50">
          <TableCell>TK-003</TableCell>
          <TableCell>Basic Tool Kit</TableCell>
          <TableCell>Tools</TableCell>
          <TableCell>20</TableCell>
          <TableCell>20</TableCell>
          <TableCell>$45.00</TableCell>
          <TableCell>$75.00</TableCell>
          <TableCell>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Adjust</Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
