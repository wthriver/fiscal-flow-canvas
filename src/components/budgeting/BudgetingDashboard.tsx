
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BarChart3, Download, FileSpreadsheet, PlusCircle, BarChart, Printer, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const BudgetingDashboard: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState("fy2025");
  const [activeTab, setActiveTab] = useState("overview");
  
  const handleExportBudget = () => {
    toast.success("Budget exported successfully", {
      description: "Your budget data has been downloaded"
    });
  };
  
  const handleCreateBudget = () => {
    toast.success("New budget created", {
      description: "Budget for FY 2026 has been created"
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Budgeting
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleCreateBudget}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Budget</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExportBudget}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="w-full sm:w-64">
          <Select value={selectedBudget} onValueChange={setSelectedBudget}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fy2025">FY 2025 Annual Budget</SelectItem>
              <SelectItem value="fy2025-q2">FY 2025 Q2 Budget</SelectItem>
              <SelectItem value="marketing">2025 Marketing Budget</SelectItem>
              <SelectItem value="operations">2025 Operations Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Status:</span> Active
          </p>
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Period:</span> Jan 2025 - Dec 2025
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$420,000.00</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">YTD Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$135,250.75</p>
            <p className="text-sm text-muted-foreground">32.2% of budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$284,749.25</p>
            <p className="text-sm text-muted-foreground">67.8% of budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">+$12,450.25</p>
            <p className="text-sm text-muted-foreground">Under budget by 3.0%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Budget Details</TabsTrigger>
          <TabsTrigger value="vs-actual">Budget vs. Actual</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Budgets</CardTitle>
              <CardDescription>Budget allocation by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Marketing</p>
                      <div className="text-xs text-muted-foreground">
                        $45,250.25 of $120,000.00
                      </div>
                    </div>
                    <div className="text-sm font-medium">37.7%</div>
                  </div>
                  <Progress value={37.7} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Operations</p>
                      <div className="text-xs text-muted-foreground">
                        $32,500.00 of $80,000.00
                      </div>
                    </div>
                    <div className="text-sm font-medium">40.6%</div>
                  </div>
                  <Progress value={40.6} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Product Development</p>
                      <div className="text-xs text-muted-foreground">
                        $38,750.50 of $150,000.00
                      </div>
                    </div>
                    <div className="text-sm font-medium">25.8%</div>
                  </div>
                  <Progress value={25.8} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Administration</p>
                      <div className="text-xs text-muted-foreground">
                        $18,750.00 of $70,000.00
                      </div>
                    </div>
                    <div className="text-sm font-medium">26.8%</div>
                  </div>
                  <Progress value={26.8} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>View Charts</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span>Print Report</span>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Tracking</CardTitle>
              <CardDescription>Budget vs. actual spending by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actual</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>January</TableCell>
                      <TableCell>$35,000.00</TableCell>
                      <TableCell>$33,250.75</TableCell>
                      <TableCell className="text-green-600">+$1,749.25</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Under Budget
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>February</TableCell>
                      <TableCell>$35,000.00</TableCell>
                      <TableCell>$34,500.00</TableCell>
                      <TableCell className="text-green-600">+$500.00</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Under Budget
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>March</TableCell>
                      <TableCell>$35,000.00</TableCell>
                      <TableCell>$36,250.00</TableCell>
                      <TableCell className="text-red-600">-$1,250.00</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Over Budget
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>April</TableCell>
                      <TableCell>$35,000.00</TableCell>
                      <TableCell>$31,250.00</TableCell>
                      <TableCell className="text-green-600">+$3,750.00</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Under Budget
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Line Items</CardTitle>
                <CardDescription>Detailed breakdown of all budget categories</CardDescription>
              </div>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Add Line Item</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Annual Budget</TableHead>
                      <TableHead>YTD Actual</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>% Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Salaries & Wages</TableCell>
                      <TableCell>Administration</TableCell>
                      <TableCell>$250,000.00</TableCell>
                      <TableCell>$83,333.33</TableCell>
                      <TableCell>$166,666.67</TableCell>
                      <TableCell>33.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Digital Advertising</TableCell>
                      <TableCell>Marketing</TableCell>
                      <TableCell>$50,000.00</TableCell>
                      <TableCell>$18,750.25</TableCell>
                      <TableCell>$31,249.75</TableCell>
                      <TableCell>37.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Office Rent</TableCell>
                      <TableCell>Operations</TableCell>
                      <TableCell>$36,000.00</TableCell>
                      <TableCell>$12,000.00</TableCell>
                      <TableCell>$24,000.00</TableCell>
                      <TableCell>33.3%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Software Subscriptions</TableCell>
                      <TableCell>Product Development</TableCell>
                      <TableCell>$24,000.00</TableCell>
                      <TableCell>$8,500.00</TableCell>
                      <TableCell>$15,500.00</TableCell>
                      <TableCell>35.4%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Events & Conferences</TableCell>
                      <TableCell>Marketing</TableCell>
                      <TableCell>$15,000.00</TableCell>
                      <TableCell>$2,500.00</TableCell>
                      <TableCell>$12,500.00</TableCell>
                      <TableCell>16.7%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Research & Development</TableCell>
                      <TableCell>Product Development</TableCell>
                      <TableCell>$45,000.00</TableCell>
                      <TableCell>$10,167.17</TableCell>
                      <TableCell>$34,832.83</TableCell>
                      <TableCell>22.6%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Edit Budget</Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="vs-actual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Actual Comparison</CardTitle>
              <CardDescription>Track your spending against budget allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Marketing Department</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Digital Advertising</p>
                          <div className="text-xs text-muted-foreground">
                            $18,750.25 of $50,000.00
                          </div>
                        </div>
                        <div className="text-sm font-medium">37.5%</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div style={{ width: "37.5%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                        </div>
                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-green-100">
                          <div style={{ width: "33.3%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>Actual (37.5%)</div>
                          <div>Target (33.3%)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Events & Conferences</p>
                          <div className="text-xs text-muted-foreground">
                            $2,500.00 of $15,000.00
                          </div>
                        </div>
                        <div className="text-sm font-medium">16.7%</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div style={{ width: "16.7%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                        </div>
                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-green-100">
                          <div style={{ width: "33.3%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>Actual (16.7%)</div>
                          <div>Target (33.3%)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Operations Department</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Office Rent</p>
                          <div className="text-xs text-muted-foreground">
                            $12,000.00 of $36,000.00
                          </div>
                        </div>
                        <div className="text-sm font-medium">33.3%</div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div style={{ width: "33.3%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                        </div>
                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-green-100">
                          <div style={{ width: "33.3%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>Actual (33.3%)</div>
                          <div>Target (33.3%)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                View All Categories
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Forecasting</CardTitle>
              <CardDescription>Project future spending and budget needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium mb-2">Forecast Period</label>
                    <Select defaultValue="next-quarter">
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next-month">Next Month</SelectItem>
                        <SelectItem value="next-quarter">Next Quarter</SelectItem>
                        <SelectItem value="next-year">Next Year</SelectItem>
                        <SelectItem value="custom">Custom Period</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium mb-2">Forecast Method</label>
                    <Select defaultValue="trend-based">
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear Projection</SelectItem>
                        <SelectItem value="trend-based">Trend-based</SelectItem>
                        <SelectItem value="seasonal">Seasonal Adjustment</SelectItem>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium mb-2">Growth Assumption</label>
                    <Select defaultValue="moderate">
                      <SelectTrigger>
                        <SelectValue placeholder="Select growth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative (3%)</SelectItem>
                        <SelectItem value="moderate">Moderate (5%)</SelectItem>
                        <SelectItem value="aggressive">Aggressive (10%)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Button className="mb-4">Generate Forecast</Button>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Projected Expenses</TableHead>
                          <TableHead>Projected Revenue</TableHead>
                          <TableHead>Net Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>May 2025</TableCell>
                          <TableCell>$35,750.00</TableCell>
                          <TableCell>$48,500.00</TableCell>
                          <TableCell className="text-green-600">+$12,750.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>June 2025</TableCell>
                          <TableCell>$36,250.00</TableCell>
                          <TableCell>$49,150.00</TableCell>
                          <TableCell className="text-green-600">+$12,900.00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>July 2025</TableCell>
                          <TableCell>$36,850.00</TableCell>
                          <TableCell>$49,750.00</TableCell>
                          <TableCell className="text-green-600">+$12,900.00</TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50 font-medium">
                          <TableCell>Q2 Total (Projected)</TableCell>
                          <TableCell>$108,850.00</TableCell>
                          <TableCell>$147,400.00</TableCell>
                          <TableCell className="text-green-600">+$38,550.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>View Charts</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export Forecast</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
