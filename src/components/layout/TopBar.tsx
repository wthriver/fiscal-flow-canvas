
import React from "react";
import { Bell, User, Menu, ChevronDown } from "lucide-react";
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
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TopBar: React.FC = () => {
  const currentCompany = "ABC Corporation";
  const navigate = useNavigate();

  const handleCompanyChange = (company: string) => {
    toast.success(`Switched to ${company}`);
  };

  const handleCreateCompany = () => {
    toast.info("Opening create company dialog");
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleCompanySettingsClick = () => {
    navigate("/settings");
    toast.info("Navigating to company settings");
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
              {currentCompany}
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Companies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="font-medium"
                onClick={() => handleCompanyChange("ABC Corporation")}
              >
                ABC Corporation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCompanyChange("XYZ Limited")}>
                XYZ Limited
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCompanyChange("123 Industries")}>
                123 Industries
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateCompany}>
                Create New Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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
    </header>
  );
};

export default TopBar;
