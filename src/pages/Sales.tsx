import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ShoppingCart, FileText, CalendarIcon, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";
import { handleDateRange } from "@/utils/navigationUtils";
import { useCompany } from "@/contexts/CompanyContext";

const Sales: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter sales based on search term
  const filteredSales = currentCompany.sales?.filter(sale => 
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate total sales for the week
  const salesThisWeek = filteredSales.reduce((total, sale) => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    if (saleDate >= weekAgo && saleDate <= today) {
      // Extract numeric value from formatted string (e.g., "$1,250.00" to 1250.00)
      const amount = parseFloat(sale.total.replace(/[^0-9.-]+/g, ""));
      return total + amount;
    }
    return total;
  }, 0);

  // Count pending orders
  const pendingOrders = filteredSales.filter(sale => 
    sale.status === "Processing" || sale.status === "On Hold"
  ).length;

  const handleCreateEstimate = () => {
    // Display a create estimate modal
    const estimateModal = document.createElement('div');
    estimateModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    estimateModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Create Estimate</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Customer</label>
              <select class="w-full p-2 border rounded-md">
                <option value="">Select a customer</option>
                <option value="ABC Corporation">ABC Corporation</option>
                <option value="XYZ Limited">XYZ Limited</option>
                <option value="123 Industries">123 Industries</option>
                <option value="Global Tech">Global Tech</option>
                <option value="Acme Inc">Acme Inc</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Estimate Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="2025-04-11" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Expiration Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="2025-05-11" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Estimate #</label>
              <input type="text" class="w-full p-2 border rounded-md" value="EST-001" readonly />
            </div>
          </div>
          
          <div class="border rounded-md">
            <div class="bg-gray-50 p-3 border-b">
              <h4 class="font-medium">Items</h4>
            </div>
            <div class="p-3">
              <table class="w-full">
                <thead>
                  <tr class="text-sm text-gray-500 border-b">
                    <th class="pb-2 text-left">Item</th>
                    <th class="pb-2 text-left">Description</th>
                    <th class="pb-2 text-right">Quantity</th>
                    <th class="pb-2 text-right">Price</th>
                    <th class="pb-2 text-right">Amount</th>
                    <th class="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2">
                      <select class="w-full p-1 border rounded-md text-sm">
                        <option value="">Select an item</option>
                        <option value="Widget Pro">Widget Pro</option>
                        <option value="Premium Gadget">Premium Gadget</option>
                        <option value="Basic Tool Kit">Basic Tool Kit</option>
                      </select>
                    </td>
                    <td class="py-2"><input type="text" class="w-full p-1 border rounded-md text-sm" placeholder="Description" /></td>
                    <td class="py-2"><input type="number" class="w-full p-1 border rounded-md text-sm text-right" value="1" /></td>
                    <td class="py-2"><input type="text" class="w-full p-1 border rounded-md text-sm text-right" value="$0.00" /></td>
                    <td class="py-2 text-right">$0.00</td>
                    <td class="py-2 text-center">
                      <button class="text-gray-400 hover:text-red-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="mt-2 text-sm text-primary flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14"></path><path d="M5 12h14"></path>
                </svg>
                Add Item
              </button>
            </div>
            <div class="bg-gray-50 p-3 flex justify-end">
              <div class="w-64 space-y-1">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Notes visible to customer"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Terms and Conditions</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Standard terms and conditions"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-estimate">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-estimate">Save Estimate</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(estimateModal);
    
    document.getElementById('cancel-estimate')?.addEventListener('click', () => {
      document.body.removeChild(estimateModal);
    });
    
    document.getElementById('save-estimate')?.addEventListener('click', () => {
      toast.success("Estimate created successfully");
      document.body.removeChild(estimateModal);
    });
  };

  const handleCreateSale = () => {
    // Display a create sale modal
    const saleModal = document.createElement('div');
    saleModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    saleModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h3 class="text-lg font-bold mb-4">New Sale</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Customer</label>
              <select class="w-full p-2 border rounded-md">
                <option value="">Select a customer</option>
                <option value="ABC Corporation">ABC Corporation</option>
                <option value="XYZ Limited">XYZ Limited</option>
                <option value="123 Industries">123 Industries</option>
                <option value="Global Tech">Global Tech</option>
                <option value="Acme Inc">Acme Inc</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sale Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="2025-04-11" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Payment Terms</label>
              <select class="w-full p-2 border rounded-md">
                <option value="due_on_receipt">Due on receipt</option>
                <option value="net_15">Net 15</option>
                <option value="net_30">Net 30</option>
                <option value="net_60">Net 60</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sale #</label>
              <input type="text" class="w-full p-2 border rounded-md" value="SALE-006" readonly />
            </div>
          </div>
          
          <div class="border rounded-md">
            <div class="bg-gray-50 p-3 border-b">
              <h4 class="font-medium">Items</h4>
            </div>
            <div class="p-3">
              <table class="w-full">
                <thead>
                  <tr class="text-sm text-gray-500 border-b">
                    <th class="pb-2 text-left">Item</th>
                    <th class="pb-2 text-left">Description</th>
                    <th class="pb-2 text-right">Quantity</th>
                    <th class="pb-2 text-right">Price</th>
                    <th class="pb-2 text-right">Amount</th>
                    <th class="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2">
                      <select class="w-full p-1 border rounded-md text-sm">
                        <option value="">Select an item</option>
                        <option value="Widget Pro">Widget Pro</option>
                        <option value="Premium Gadget">Premium Gadget</option>
                        <option value="Basic Tool Kit">Basic Tool Kit</option>
                      </select>
                    </td>
                    <td class="py-2"><input type="text" class="w-full p-1 border rounded-md text-sm" placeholder="Description" /></td>
                    <td class="py-2"><input type="number" class="w-full p-1 border rounded-md text-sm text-right" value="1" /></td>
                    <td class="py-2"><input type="text" class="w-full p-1 border rounded-md text-sm text-right" value="$0.00" /></td>
                    <td class="py-2 text-right">$0.00</td>
                    <td class="py-2 text-center">
                      <button class="text-gray-400 hover:text-red-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="mt-2 text-sm text-primary flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14"></path><path d="M5 12h14"></path>
                </svg>
                Add Item
              </button>
            </div>
            <div class="bg-gray-50 p-3 flex justify-end">
              <div class="w-64 space-y-1">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Payment Method</label>
              <select class="w-full p-2 border rounded-md">
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select class="w-full p-2 border rounded-md">
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Internal notes"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-sale">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-sale">Complete Sale</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(saleModal);
    
    document.getElementById('cancel-sale')?.addEventListener('click', () => {
      document.body.removeChild(saleModal);
    });
    
    document.getElementById('save-sale')?.addEventListener('click', () => {
      toast.success("Sale completed successfully");
      document.body.removeChild(saleModal);
    });
  };

  const handleViewSale = (id: string) => {
    // Find the sale
    const sale = sales.find(sale => sale.id === id);
    
    if (!sale) return;
    
    // Display a sale details modal
    const saleModal = document.createElement('div');
    saleModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    saleModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold">Sale ${sale.id}</h3>
            <p class="text-gray-500">${sale.date}</p>
          </div>
          <div class="flex gap-2">
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
              sale.status === "Completed" 
                ? "bg-green-100 text-green-800" 
                : sale.status === "Processing" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-yellow-100 text-yellow-800"
            }">
              ${sale.status}
            </span>
            <span class="px-2 py-1 rounded-full text-xs font-medium ${
              sale.paymentStatus === "Paid" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }">
              ${sale.paymentStatus}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Customer</h4>
            <p class="font-medium">${sale.customer}</p>
            <p class="text-sm text-gray-600">John Smith</p>
            <p class="text-sm text-gray-600">john@abccorp.com</p>
            <p class="text-sm text-gray-600">(555) 123-4567</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Sale Date</h4>
              <p>${sale.date}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Payment Terms</h4>
              <p>Due on receipt</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Payment Status</h4>
              <p>${sale.paymentStatus}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Payment Method</h4>
              <p>Credit Card</p>
            </div>
          </div>
        </div>
        
        <div class="border rounded-md mb-6">
          <div class="bg-gray-50 p-3 border-b">
            <h4 class="font-medium">Items</h4>
          </div>
          <div class="p-3">
            <table class="w-full">
              <thead>
                <tr class="text-sm text-gray-500 border-b">
                  <th class="pb-2 text-left">Item</th>
                  <th class="pb-2 text-left">Description</th>
                  <th class="pb-2 text-right">Quantity</th>
                  <th class="pb-2 text-right">Price</th>
                  <th class="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="py-2">Widget Pro</td>
                  <td class="py-2">Standard widget with premium features</td>
                  <td class="py-2 text-right">2</td>
                  <td class="py-2 text-right">$29.99</td>
                  <td class="py-2 text-right">$59.98</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Premium Gadget</td>
                  <td class="py-2">High-end gadget for professional use</td>
                  <td class="py-2 text-right">1</td>
                  <td class="py-2 text-right">$49.99</td>
                  <td class="py-2 text-right">$49.99</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Basic Tool Kit</td>
                  <td class="py-2">Essential tools for maintenance</td>
                  <td class="py-2 text-right">2</td>
                  <td class="py-2 text-right">$75.00</td>
                  <td class="py-2 text-right">$150.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="bg-gray-50 p-3 flex justify-end">
            <div class="w-64 space-y-1">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>$259.97</span>
              </div>
              <div class="flex justify-between">
                <span>Tax (8%):</span>
                <span>$20.80</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total:</span>
                <span>${sale.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Notes</h4>
          <p class="text-gray-600 text-sm">Regular customer order. Shipped via standard delivery.</p>
        </div>
        
        <div class="flex flex-wrap justify-end gap-2 mt-6">
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="create-invoice">
            <FileText size={16} />
            <span>Generate Invoice</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="edit-sale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="close-view">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(saleModal);
    
    document.getElementById('close-view')?.addEventListener('click', () => {
      document.body.removeChild(saleModal);
    });
    
    document.getElementById('create-invoice')?.addEventListener('click', () => {
      toast.success(`Invoice created for ${sale.id}`);
    });
    
    document.getElementById('edit-sale')?.addEventListener('click', () => {
      document.body.removeChild(saleModal);
      // Show edit modal with sale data pre-filled
      toast.info(`Editing ${sale.id}`);
    });
  };

  const handleViewInvoice = (id: string) => {
    // Find the sale
    const sale = sales.find(sale => sale.id === id);
    
    if (!sale) return;
    
    // Display an invoice preview modal
    const invoiceModal = document.createElement('div');
    invoiceModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    invoiceModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold">Invoice #INV-${id.split('-')[1]}</h3>
            <p class="text-gray-500">Generated from Sale ${id}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            sale.paymentStatus === "Paid" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }">
            ${sale.paymentStatus}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">From</h4>
            <p class="font-medium">Your Company Name</p>
            <p class="text-sm text-gray-600">123 Business Street</p>
            <p class="text-sm text-gray-600">Suite 100</p>
            <p class="text-sm text-gray-600">San Francisco, CA 94107</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">To</h4>
            <p class="font-medium">${sale.customer}</p>
            <p class="text-sm text-gray-600">456 Client Avenue</p>
            <p class="text-sm text-gray-600">Floor 4</p>
            <p class="text-sm text-gray-600">New York, NY 10001</p>
          </div>
          <div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Invoice Date</h4>
                <p>${sale.date}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Due Date</h4>
                <p>${sale.date}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Invoice #</h4>
                <p>INV-${id.split('-')[1]}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Sale #</h4>
                <p>${id}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border rounded-md mb-6">
          <div class="bg-gray-50 p-3 border-b">
            <h4 class="font-medium">Items</h4>
          </div>
          <div class="p-3">
            <table class="w-full">
              <thead>
                <tr class="text-sm text-gray-500 border-b">
                  <th class="pb-2 text-left">Item</th>
                  <th class="pb-2 text-left">Description</th>
                  <th class="pb-2 text-right">Quantity</th>
                  <th class="pb-2 text-right">Price</th>
                  <th class="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="py-2">Various Items</td>
                  <td class="py-2">Items from sale ${id}</td>
                  <td class="py-2 text-right">${sale.items}</td>
                  <td class="py-2 text-right">Various</td>
                  <td class="py-2 text-right">${sale.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="bg-gray-50 p-3 flex justify-end">
            <div class="w-64 space-y-1">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>${sale.total}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax (included):</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total:</span>
                <span>${sale.total}</span>
              </div>
              <div class="flex justify-between text-green-600 mt-2">
                <span>Amount Paid:</span>
                <span>${sale.paymentStatus === "Paid" ? sale.total : "$0.00"}</span>
              </div>
              <div class="flex justify-between font-bold ${sale.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"}">
                <span>Balance Due:</span>
                <span>${sale.paymentStatus === "Paid" ? "$0.00" : sale.total}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-2">Payment Instructions</h4>
          <p class="text-gray-600 text-sm">Please make payment to: Bank Account #12345678, Routing #987654321, or via check to Your Company Name.</p>
        </div>
        
        <div class="flex flex-wrap justify-end gap-2 mt-6">
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="download-invoice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Download PDF</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="email-invoice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>Email Invoice</span>
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="close-invoice">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(invoiceModal);
    
    document.getElementById('close-invoice')?.addEventListener('click', () => {
      document.body.removeChild(invoiceModal);
    });
    
    document.getElementById('download-invoice')?.addEventListener('click', () => {
      toast.success(`Invoice #INV-${id.split('-')[1]} downloaded`);
    });
    
    document.getElementById('email-invoice')?.addEventListener('click', () => {
      toast.success(`Invoice #INV-${id.split('-')[1]} emailed to ${sale.customer}`);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s sales orders and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCreateEstimate}
          >
            <Tag size={16} />
            <span>Create Estimate</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateSale}
          >
            <PlusCircle size={16} />
            <span>New Sale</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">${salesThisWeek.toFixed(2)}</CardTitle>
            <CardDescription>Sales This Week</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredSales.length}</CardTitle>
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{pendingOrders}</CardTitle>
            <CardDescription>Pending Orders</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">+12.5%</CardTitle>
            <CardDescription>vs. Last Week</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleDateRange("Sales")}
          >
            <CalendarIcon size={16} />
            <span>Date Range</span>
          </Button>
          <FilterButton type="Sales" />
          <ExportButton type="Sales" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>View and manage {currentCompany.name}'s recent sales orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.items}</TableCell>
                    <TableCell>{sale.total}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : sale.status === "Processing" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sale.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentStatus === "Paid" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sale.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewSale(sale.id)}
                        >
                          <ShoppingCart size={16} />
                          <span className="sr-only">View Order</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewInvoice(sale.id)}
                        >
                          <FileText size={16} />
                          <span className="sr-only">Invoice</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No sales found for {currentCompany.name}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
