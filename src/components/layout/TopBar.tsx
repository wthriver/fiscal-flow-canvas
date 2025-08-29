import React, { useState } from "react";
import { Bell, User, Menu, ChevronDown, Building, Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@/contexts/CompanyContext";
import { Company } from "@/types/company";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { companies, currentCompany, switchCompany, addCompany } = useCompany();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    industry: "",
    fiscalYearStart: "January 1",
  });

  const handleCompanyChange = (companyId: string) => {
    switchCompany(companyId);
  };

  const handleCreateCompany = () => {
    setIsCreateDialogOpen(true);
  };

  const handleNewCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCompanyData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNewCompany = () => {
    if (!newCompanyData.name) {
      toast.error("Company name is required");
      return;
    }

    // Add the new company with default data
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      ...newCompanyData,
      
      // Required enhanced properties
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      timeZone: 'America/New_York',
      businessType: 'Corporation' as const,
      accountingMethod: 'Accrual' as const,
      
      accounts: [], // Add required accounts field
      customers: [],
      invoices: [],
      estimates: [],
      expenses: [],
      transactions: [],
      bankAccounts: [],
      employees: [],
      projects: [],
      timeEntries: [],
      taxRates: [],
      payrollData: { 
        payPeriods: [],
        totalPayroll: 0,
        employeeCount: 0,
        averageSalary: 0
      },
      budgets: [],
      revenue: { current: 0, previous: 0, percentChange: 0 },
      profitMargin: { value: 30, previous: 25, percentChange: 20 },
      outstandingInvoices: { amount: 0, percentChange: 0 },
      activeCustomers: { count: 0, percentChange: 0 },
      inventory: { 
        items: [], 
        bundles: [],
        serialNumbers: [],
        lotTracking: []
      },
      sales: []
    };
    
    addCompany(newCompany);

    // Reset form and close dialog
    setNewCompanyData({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      taxId: "",
      industry: "",
      fiscalYearStart: "January 1",
    });
    setIsCreateDialogOpen(false);
    toast.success(`Company "${newCompanyData.name}" created successfully`);
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleCompanySettingsClick = () => {
    navigate("/settings");
    // Switch to company tab in settings
    const event = new CustomEvent('switchSettingsTab', {
      detail: { tab: 'company', section: 'companyInfo' }
    });
    window.dispatchEvent(event);
  };

  const handleHelpClick = () => {
    toast.info("Opening help & support resources");
  };

  const handleLogoutClick = () => {
    toast.success("Logged out successfully");
  };

  const handleNotificationsClick = () => {
    toast.info("Opening notifications panel");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="h-full">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-base font-medium outline-none">
              {currentCompany.name}
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Companies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {companies.map((company) => (
                <DropdownMenuItem 
                  key={company.id}
                  className={`font-medium ${company.id === currentCompany.id ? 'bg-accent' : ''}`}
                  onClick={() => handleCompanyChange(company.id)}
                >
                  <Building className="mr-2 h-4 w-4" />
                  {company.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateCompany}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="sm"
          onClick={() => window.location.href = 'https://skillsim.vercel.app/dashboard'}
          className="hidden sm:flex"
        >
          Master Dashboard
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNotificationsClick}
        >
          <Bell size={20} />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleCompanySettingsClick}>Company Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleHelpClick}>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutClick}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Company Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Company</DialogTitle>
            <DialogDescription>
              Enter the details for your new company.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name*
              </Label>
              <Input
                id="name"
                value={newCompanyData.name}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="industry" className="text-right">
                Industry
              </Label>
              <Input
                id="industry"
                value={newCompanyData.industry}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={newCompanyData.address}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newCompanyData.email}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newCompanyData.phone}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                value={newCompanyData.website}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxId" className="text-right">
                Tax ID
              </Label>
              <Input
                id="taxId"
                value={newCompanyData.taxId}
                onChange={handleNewCompanyInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveNewCompany}>
              Create Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TopBar;
