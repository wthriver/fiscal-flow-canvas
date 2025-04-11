
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Mail, Phone, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";

const Customers: React.FC = () => {
  // Sample customer data
  const customers = [
    { 
      id: "CUST-001", 
      name: "ABC Corporation", 
      contactName: "John Smith",
      email: "john@abccorp.com", 
      phone: "(555) 123-4567", 
      openInvoices: 2,
      balance: "$3,450.00",
      status: "Active" 
    },
    { 
      id: "CUST-002", 
      name: "XYZ Limited", 
      contactName: "Jane Doe",
      email: "jane@xyzlimited.com", 
      phone: "(555) 987-6543", 
      openInvoices: 1,
      balance: "$1,200.00",
      status: "Active" 
    },
    { 
      id: "CUST-003", 
      name: "123 Industries", 
      contactName: "Robert Johnson",
      email: "robert@123industries.com", 
      phone: "(555) 456-7890", 
      openInvoices: 0,
      balance: "$0.00",
      status: "Active" 
    },
    { 
      id: "CUST-004", 
      name: "Global Tech", 
      contactName: "Sarah Williams",
      email: "sarah@globaltech.com", 
      phone: "(555) 789-0123", 
      openInvoices: 3,
      balance: "$5,875.25",
      status: "Active" 
    },
    { 
      id: "CUST-005", 
      name: "Acme Inc", 
      contactName: "Michael Brown",
      email: "michael@acmeinc.com", 
      phone: "(555) 234-5678", 
      openInvoices: 0,
      balance: "$0.00",
      status: "Inactive" 
    },
  ];

  const handleAddCustomer = () => {
    // Display a create customer modal
    const createModal = document.createElement('div');
    createModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    createModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Add New Customer</h3>
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Company Name</label>
              <input type="text" class="w-full p-2 border rounded-md" placeholder="Company name" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Contact Name</label>
              <input type="text" class="w-full p-2 border rounded-md" placeholder="Full name" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input type="email" class="w-full p-2 border rounded-md" placeholder="Email address" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" class="w-full p-2 border rounded-md" placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <input type="text" class="w-full p-2 border rounded-md mb-2" placeholder="Street address" />
            <div class="grid grid-cols-2 gap-2">
              <input type="text" class="p-2 border rounded-md" placeholder="City" />
              <input type="text" class="p-2 border rounded-md" placeholder="State/Province" />
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <input type="text" class="p-2 border rounded-md" placeholder="Postal code" />
              <input type="text" class="p-2 border rounded-md" placeholder="Country" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Customer Type</label>
            <select class="w-full p-2 border rounded-md">
              <option value="business">Business</option>
              <option value="individual">Individual</option>
              <option value="non-profit">Non-profit</option>
              <option value="government">Government</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Additional notes"></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-create">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-create">Save Customer</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(createModal);
    
    document.getElementById('cancel-create')?.addEventListener('click', () => {
      document.body.removeChild(createModal);
    });
    
    document.getElementById('save-create')?.addEventListener('click', () => {
      toast.success("New customer created successfully");
      document.body.removeChild(createModal);
    });
  };

  const handleViewCustomer = (id: string) => {
    // Find the customer
    const customer = customers.find(customer => customer.id === id);
    
    if (!customer) return;
    
    // Display a customer details modal
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    detailsModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold">${customer.name}</h3>
            <p class="text-gray-500">${customer.id}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            customer.status === "Active" 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          }">
            ${customer.status}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <User size={16} className="text-gray-400 mr-2" />
                  <span>${customer.contactName}</span>
                </div>
                <div class="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span>${customer.email}</span>
                </div>
                <div class="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span>${customer.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Address</h4>
              <address class="mt-2 not-italic">
                123 Business St<br />
                Suite 100<br />
                San Francisco, CA 94107<br />
                United States
              </address>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Financial Overview</h4>
              <div class="mt-2 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Balance</span>
                  <span class="font-medium">${customer.balance}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Open Invoices</span>
                  <span class="font-medium">${customer.openInvoices}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Overdue</span>
                  <span class="font-medium">$0.00</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Lifetime Value</span>
                  <span class="font-medium">$12,450.75</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Customer Since</h4>
              <p class="mt-1">January 15, 2024</p>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500">Recent Activity</h4>
            <div class="mt-2 space-y-3">
              <div class="text-sm">
                <div class="font-medium">Invoice #INV-001</div>
                <div class="text-gray-500">April 10, 2025 · $1,250.00</div>
              </div>
              <div class="text-sm">
                <div class="font-medium">Payment Received</div>
                <div class="text-gray-500">April 5, 2025 · $2,500.00</div>
              </div>
              <div class="text-sm">
                <div class="font-medium">Invoice #INV-002</div>
                <div class="text-gray-500">March 25, 2025 · $2,200.00</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <h4 class="font-semibold mb-3">Notes</h4>
          <p class="text-gray-600 text-sm">Large enterprise client with multiple departments. Primary contact is John Smith, but can also reach out to Sarah in Accounting for invoice questions.</p>
        </div>
        
        <div class="flex flex-wrap justify-end gap-2 mt-6">
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="send-email">
            <Mail size={16} />
            <span>Send Email</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="create-invoice">
            <FileText size={16} />
            <span>Create Invoice</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="edit-customer">
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
    
    document.body.appendChild(detailsModal);
    
    document.getElementById('close-view')?.addEventListener('click', () => {
      document.body.removeChild(detailsModal);
    });
    
    document.getElementById('send-email')?.addEventListener('click', () => {
      toast.info(`Composing email to ${customer.email}`);
    });
    
    document.getElementById('create-invoice')?.addEventListener('click', () => {
      toast.info(`Creating invoice for ${customer.name}`);
    });
    
    document.getElementById('edit-customer')?.addEventListener('click', () => {
      document.body.removeChild(detailsModal);
      handleEditCustomer(id);
    });
  };

  const handleEditCustomer = (id: string) => {
    // Find the customer
    const customer = customers.find(customer => customer.id === id);
    
    if (!customer) return;
    
    // Display an edit customer modal
    const editModal = document.createElement('div');
    editModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    editModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Edit Customer</h3>
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Company Name</label>
              <input type="text" class="w-full p-2 border rounded-md" value="${customer.name}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Contact Name</label>
              <input type="text" class="w-full p-2 border rounded-md" value="${customer.contactName}" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <input type="email" class="w-full p-2 border rounded-md" value="${customer.email}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" class="w-full p-2 border rounded-md" value="${customer.phone}" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <input type="text" class="w-full p-2 border rounded-md mb-2" value="123 Business St" />
            <div class="grid grid-cols-2 gap-2">
              <input type="text" class="p-2 border rounded-md" value="San Francisco" />
              <input type="text" class="p-2 border rounded-md" value="CA" />
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <input type="text" class="p-2 border rounded-md" value="94107" />
              <input type="text" class="p-2 border rounded-md" value="United States" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Customer Type</label>
            <select class="w-full p-2 border rounded-md">
              <option value="business" selected>Business</option>
              <option value="individual">Individual</option>
              <option value="non-profit">Non-profit</option>
              <option value="government">Government</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select class="w-full p-2 border rounded-md">
              <option value="active" ${customer.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="inactive" ${customer.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2">Large enterprise client with multiple departments. Primary contact is John Smith, but can also reach out to Sarah in Accounting for invoice questions.</textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-edit">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-edit">Save Changes</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(editModal);
    
    document.getElementById('cancel-edit')?.addEventListener('click', () => {
      document.body.removeChild(editModal);
    });
    
    document.getElementById('save-edit')?.addEventListener('click', () => {
      toast.success(`Customer ${customer.name} updated successfully`);
      document.body.removeChild(editModal);
    });
  };

  const handleSendEmail = (email: string) => {
    // Display a compose email modal
    const emailModal = document.createElement('div');
    emailModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    emailModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Send Email</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">To</label>
            <input type="email" class="w-full p-2 border rounded-md" value="${email}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Subject</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Email subject" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Message</label>
            <textarea class="w-full p-2 border rounded-md" rows="6" placeholder="Type your message here..."></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="attach-files" class="rounded" />
            <label for="attach-files" class="text-sm">Attach invoice/statement files</label>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-email">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="send-email-btn">Send</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(emailModal);
    
    document.getElementById('cancel-email')?.addEventListener('click', () => {
      document.body.removeChild(emailModal);
    });
    
    document.getElementById('send-email-btn')?.addEventListener('click', () => {
      toast.success(`Email sent to ${email}`);
      document.body.removeChild(emailModal);
    });
  };

  const handleStatement = (id: string) => {
    // Find the customer
    const customer = customers.find(customer => customer.id === id);
    
    if (!customer) return;
    
    toast.info(`Generating statement for ${customer.name}`);
    
    // Simulate loading
    setTimeout(() => {
      toast.success(`Statement for ${customer.name} is ready for download`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleAddCustomer}
        >
          <PlusCircle size={16} />
          <span>Add Customer</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">42</CardTitle>
            <CardDescription>Total Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">28</CardTitle>
            <CardDescription>Active Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">12</CardTitle>
            <CardDescription>With Open Invoices</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">$42,890</CardTitle>
            <CardDescription>Total Receivables</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FilterButton type="Customers" />
          <ExportButton type="Customers" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Open Invoices</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contactName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.openInvoices}</TableCell>
                  <TableCell>{customer.balance}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewCustomer(customer.id)}
                      >
                        <User size={16} />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleSendEmail(customer.email)}
                      >
                        <Mail size={16} />
                        <span className="sr-only">Email</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleStatement(customer.id)}
                      >
                        <FileText size={16} />
                        <span className="sr-only">Statement</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
