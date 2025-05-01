
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, UserCheck, Wallet, FilePlus, Download, FileText, Share2, Users } from "lucide-react";

export const PayrollDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-4">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>New Payroll Run</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Manage Employees</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Next Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">May 15, 2025</p>
            <p className="text-sm text-muted-foreground">6 employees</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Process Early</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Last Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,450.89</p>
            <p className="text-sm text-muted-foreground">April 30, 2025</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View Details</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Employee Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">6 Active</p>
            <p className="text-sm text-muted-foreground">0 Pending</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">Manage</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll-history">Payroll History</TabsTrigger>
          <TabsTrigger value="tax-filings">Tax Filings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Employee</th>
                    <th className="py-3 px-4 text-left">Position</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Pay Rate</th>
                    <th className="py-3 px-4 text-left">Pay Type</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Jane Smith</td>
                    <td className="py-3 px-4">Designer</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="py-3 px-4">$45.00</td>
                    <td className="py-3 px-4">Hourly</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">John Doe</td>
                    <td className="py-3 px-4">Developer</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="py-3 px-4">$85,000.00</td>
                    <td className="py-3 px-4">Salary</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Bob Johnson</td>
                    <td className="py-3 px-4">Developer</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="py-3 px-4">$40.00</td>
                    <td className="py-3 px-4">Hourly</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payroll-history" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Employees</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Apr 30, 2025</td>
                    <td className="py-3 px-4">April Payroll</td>
                    <td className="py-3 px-4">6</td>
                    <td className="py-3 px-4">$12,450.89</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">Mar 31, 2025</td>
                    <td className="py-3 px-4">March Payroll</td>
                    <td className="py-3 px-4">6</td>
                    <td className="py-3 px-4">$12,350.45</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tax-filings" className="border rounded-md p-4 mt-2">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Form</th>
                    <th className="py-3 px-4 text-left">Period</th>
                    <th className="py-3 px-4 text-left">Due Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">941 (Federal Tax)</td>
                    <td className="py-3 px-4">Q2 2025</td>
                    <td className="py-3 px-4">Jul 31, 2025</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Upcoming</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Prepare</Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">State Withholding</td>
                    <td className="py-3 px-4">Q2 2025</td>
                    <td className="py-3 px-4">Jul 31, 2025</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Upcoming</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Prepare</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="border rounded-md p-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Summary of all payrolls by period</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View</Button>
                <Button variant="outline">Export</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Liability</CardTitle>
                <CardDescription>Summary of tax liabilities</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View</Button>
                <Button variant="outline">Export</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employee Earnings</CardTitle>
                <CardDescription>Breakdown of earnings by employee</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View</Button>
                <Button variant="outline">Export</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deductions Report</CardTitle>
                <CardDescription>Summary of all deductions</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View</Button>
                <Button variant="outline">Export</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
