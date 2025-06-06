import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCompany } from "@/contexts/CompanyContext";
import { toast } from "sonner";
import { Customer } from "@/types/company";

const Customers: React.FC = () => {
  const { currentCompany, addCustomer, updateCustomer, deleteCustomer } = useCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
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
    (customer.contactName && customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
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
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = filteredCustomers.find(c => c.id === customerId);
    if (customer) {
      setEditingCustomer(customer);
      setNewCustomer({
        id: customer.id,
        name: customer.name,
        contactName: customer.contactName || "",
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        postalCode: customer.postalCode || "",
        country: customer.country || "",
        type: customer.type || "Business",
        status: customer.status || "Active"
      });
      setShowCustomerForm(true);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    const customer = filteredCustomers.find(c => c.id === customerId);
    if (customer) {
      if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
        deleteCustomer(customerId);
        toast.success(`Customer ${customer.name} deleted successfully`);
      }
    }
  };

  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [id]: value }));
  };

  const generateCustomerId = () => {
    return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleCustomerFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!newCustomer.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!newCustomer.email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    const customerData: Customer = {
      id: editingCustomer ? editingCustomer.id : generateCustomerId(),
      name: newCustomer.name.trim(),
      contactName: newCustomer.contactName.trim(),
      email: newCustomer.email.trim(),
      phone: newCustomer.phone.trim(),
      address: newCustomer.address.trim(),
      city: newCustomer.city.trim(),
      state: newCustomer.state.trim(),
      postalCode: newCustomer.postalCode.trim(),
      country: newCustomer.country.trim(),
      type: newCustomer.type,
      status: newCustomer.status
    };

    if (editingCustomer) {
      updateCustomer(customerData);
      toast.success(`Customer ${customerData.name} updated successfully`);
    } else {
      addCustomer(customerData);
      toast.success(`Customer ${customerData.name} created successfully`);
    }
    
    setShowCustomerForm(false);
    setEditingCustomer(null);
    
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
            <CardTitle>{editingCustomer ? 'Edit' : 'Create New'} Customer</CardTitle>
            <CardDescription>{editingCustomer ? 'Update' : 'Add a new'} customer {editingCustomer ? 'information' : `to ${currentCompany.name}`}</CardDescription>
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
                  onClick={() => {
                    setShowCustomerForm(false);
                    setEditingCustomer(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCustomer ? 'Update' : 'Save'} Customer
                </Button>
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
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage your {currentCompany.name}'s customers ({filteredCustomers.length} total)</CardDescription>
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
                    <TableCell>{customer.contactName || 'N/A'}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
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
                    {searchTerm ? `No customers found matching "${searchTerm}"` : `No customers found for ${currentCompany.name}. Create your first customer to get started.`}
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
