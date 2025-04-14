
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MoreHorizontal, Users, UserPlus, DollarSign, CalendarIcon, Mail, Phone, Building, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";

const Customers: React.FC = () => {
  const { currentCompany, switchCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    id: "",
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    type: "Business",
    status: "Active"
  });
  
  // Filter customers based on search term
  const filteredCustomers = currentCompany.customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateCustomer = () => {
    setShowCustomerForm(true);
  };

  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [id]: value }));
  };

  const handleCustomerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!newCustomer.name) {
      toast.error("Customer name is required");
      return;
    }
    
    // Update the current company with the new customer data
    // We'd use a more robust method in a real application
    toast.success(`Customer ${newCustomer.name} created`);
    setShowCustomerForm(false);
    
    // Reset the form
    setNewCustomer({
      id: "",
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      type: "Business",
      status: "Active"
    });
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = filteredCustomers.find(c => c.id === customerId);
    if (customer) {
      toast.info(`Editing customer ${customer.name}`);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customer = filteredCustomers.find(c => c.id === customerId);
    if (customer) {
      toast.info(`Deleting customer ${customer.name}`);
    }
  };

  const handleViewCustomer = (customerId: string) => {
    const customer = filteredCustomers.find(c => c.id === customerId);
    
    if (!customer) return;
    
    // Create a modal to display customer details
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
        <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          </svg>
        </button>
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold">${customer.name}</h3>
            <p class="text-gray-500">${customer.type} • ${customer.status}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
            <div class="space-y-2">
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>${customer.phone}</span>
              </div>
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>${customer.email}</span>
              </div>
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}, ${customer.country}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-2">Customer Details</h4>
            <div class="space-y-2">
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>
                  <path d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"></path>
                </svg>
                <span>Contact: ${customer.contactName}</span>
              </div>
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>Customer since: January 2023</span>
              </div>
              <div class="flex items-center">
                <svg width="16" height="16" class="mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Last order: March 15, 2025</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-b py-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-3 rounded">
              <div class="text-sm text-gray-500">Total Orders</div>
              <div class="text-2xl font-bold">24</div>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <div class="text-sm text-gray-500">Lifetime Value</div>
              <div class="text-2xl font-bold">$12,450</div>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <div class="text-sm text-gray-500">Outstanding Balance</div>
              <div class="text-2xl font-bold">$0</div>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <div class="flex gap-2">
            <button id="edit-customer" class="px-4 py-2 border rounded hover:bg-gray-50 flex items-center">
              <svg width="16" height="16" class="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
              </svg>
              Edit
            </button>
            <button id="create-invoice" class="px-4 py-2 border rounded hover:bg-gray-50 flex items-center">
              <svg width="16" height="16" class="mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
              Create Invoice
            </button>
          </div>
          <button class="px-4 py-2 bg-primary text-white rounded" id="view-dashboard">View Dashboard</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('close-modal')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    document.getElementById('edit-customer')?.addEventListener('click', () => {
      document.body.removeChild(modal);
      handleEditCustomer(customerId);
    });
    
    document.getElementById('view-dashboard')?.addEventListener('click', () => {
      toast.info(`Opening dashboard for ${customer.name}`);
      document.body.removeChild(modal);
    });
    
    document.getElementById('create-invoice')?.addEventListener('click', () => {
      toast.info(`Creating invoice for ${customer.name}`);
      document.body.removeChild(modal);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage {currentCompany.name}'s customers and contacts</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={handleCreateCustomer}
        >
          <PlusCircle size={16} />
          <span>New Customer</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredCustomers.length}</CardTitle>
            <CardDescription>Total Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">{filteredCustomers.filter(c => c.status === "Active").length}</CardTitle>
            <CardDescription>Active Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-500">{filteredCustomers.filter(c => c.type === "Business").length}</CardTitle>
            <CardDescription>Business Customers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{filteredCustomers.filter(c => c.type === "Individual").length}</CardTitle>
            <CardDescription>Individual Customers</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {showCustomerForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Customer</CardTitle>
            <CardDescription>Add a new customer to {currentCompany.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCustomerFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Company/Organization Name*</label>
                  <Input 
                    id="name" 
                    value={newCustomer.name} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactName" className="text-sm font-medium">Contact Person</label>
                  <Input 
                    id="contactName" 
                    value={newCustomer.contactName} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter contact name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newCustomer.email} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input 
                    id="phone" 
                    value={newCustomer.phone} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Address</label>
                <Input 
                  id="address" 
                  value={newCustomer.address} 
                  onChange={handleCustomerFormChange} 
                  placeholder="Enter street address"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input 
                    id="city" 
                    value={newCustomer.city} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">State/Province</label>
                  <Input 
                    id="state" 
                    value={newCustomer.state} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="text-sm font-medium">Postal Code</label>
                  <Input 
                    id="postalCode" 
                    value={newCustomer.postalCode} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <Input 
                    id="country" 
                    value={newCustomer.country} 
                    onChange={handleCustomerFormChange} 
                    placeholder="Enter country"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Customer Type</label>
                  <select 
                    id="type" 
                    value={newCustomer.type} 
                    onChange={handleCustomerFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Business">Business</option>
                    <option value="Individual">Individual</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select 
                    id="status" 
                    value={newCustomer.status} 
                    onChange={handleCustomerFormChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCustomerForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Customer</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage your {currentCompany.name}'s customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.contactName}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : customer.status === "Inactive" 
                            ? "bg-gray-100 text-gray-800" 
                            : "bg-blue-100 text-blue-800"
                      }`}>
                        {customer.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600"
                          >
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No customers found for {currentCompany.name}
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

export default Customers;
