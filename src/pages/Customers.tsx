
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, Users, TrendingUp, Calendar, Mail } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { Customer } from '@/types/company';
import { CustomerManagement } from '@/components/customers/CustomerManagement';

const Customers: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const customers = currentCompany?.customers || [];
  const invoices = currentCompany?.invoices || [];
  const projects = currentCompany?.projects || [];

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate customer statistics
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + (customer.totalSales || 0), 0);
  const averageOrderValue = customers.length > 0 ? totalRevenue / customers.length : 0;

  // Get top customers by revenue
  const topCustomers = [...customers]
    .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
    .slice(0, 5);

  // Get recent customers
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.customerSince).getTime() - new Date(a.customerSince).getTime())
    .slice(0, 5);

  const getCustomerInvoices = (customerId: string) => {
    return invoices.filter(invoice => invoice.customerId === customerId);
  };

  const getCustomerProjects = (customerId: string) => {
    return projects.filter(project => project.clientId === customerId);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships and data</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeCustomers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => {
                const customerDate = new Date(c.customerSince);
                const now = new Date();
                return customerDate.getMonth() === now.getMonth() && 
                       customerDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              New customers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Customer Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'Active' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === 'Inactive' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('Inactive')}
              size="sm"
            >
              Inactive
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Revenue</CardTitle>
                <CardDescription>Customers with highest total sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(customer.totalSales || 0).toLocaleString()}</p>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>Newest additions to your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{customer.customerSince}</p>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                {filteredCustomers.length} of {customers.length} customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredCustomers.map((customer) => {
                  const customerInvoices = getCustomerInvoices(customer.id);
                  const customerProjects = getCustomerProjects(customer.id);
                  
                  return (
                    <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{customer.name}</p>
                            <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <span>{customer.phone}</span>
                            )}
                            {customer.company && (
                              <span>{customer.company}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(customer.totalSales || 0).toLocaleString()}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{customerInvoices.length} invoices</span>
                          <span>•</span>
                          <span>{customerProjects.length} projects</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Active', 'Inactive'].map(status => {
                    const count = customers.filter(c => c.status === status).length;
                    const percentage = customers.length > 0 ? (count / customers.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
                            {status}
                          </Badge>
                          <span className="text-sm">{count} customers</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['This Month', 'Last Month', 'This Year'].map(period => {
                    const now = new Date();
                    let count = 0;
                    
                    if (period === 'This Month') {
                      count = customers.filter(c => {
                        const date = new Date(c.customerSince);
                        return date.getMonth() === now.getMonth() && 
                               date.getFullYear() === now.getFullYear();
                      }).length;
                    } else if (period === 'Last Month') {
                      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                      count = customers.filter(c => {
                        const date = new Date(c.customerSince);
                        return date.getMonth() === lastMonth.getMonth() && 
                               date.getFullYear() === lastMonth.getFullYear();
                      }).length;
                    } else {
                      count = customers.filter(c => {
                        const date = new Date(c.customerSince);
                        return date.getFullYear() === now.getFullYear();
                      }).length;
                    }
                    
                    return (
                      <div key={period} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{period}</span>
                        <span className="font-medium">{count} new customers</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;
