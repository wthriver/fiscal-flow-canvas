
import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  User,
  FileText,
  ShoppingCart,
  Calendar,
  Coins,
  Landmark,
  Clock,
  Package2,
  Activity,
  Settings,
} from "lucide-react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <RouterLink
          ref={ref as any}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          to={props.href || "#"}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </RouterLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const routes = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    submenu: false,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: User,
    submenu: false,
  },
  {
    title: "Invoicing",
    href: "/invoices",
    icon: FileText,
    submenu: false,
  },
  {
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    submenu: false,
  },
  {
    title: "Accounting",
    href: "/accounting",
    icon: Coins,
    submenu: false,
  },
  {
    title: "Chart of Accounts",
    href: "/chart-of-accounts",
    icon: FileText, 
    submenu: false,
  },
  {
    title: "Banking",
    href: "/banking",
    icon: Landmark,
    submenu: false,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: LayoutDashboard,
    submenu: false,
  },
  {
    title: "Time Tracking",
    href: "/time-tracking",
    icon: Clock,
    submenu: false,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package2,
    submenu: false,
  },
  {
    title: "Budgeting",
    href: "/budgeting",
    icon: Activity,
    submenu: false,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: FileText,
    submenu: false,
  },
  {
    title: "Payroll",
    href: "/payroll",
    icon: Calendar,
    submenu: false,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    submenu: false,
  },
];

export function Navigation() {
  return (
    <div className="border-b">
      <div className="container flex items-center justify-between py-4">
        <RouterLink to="/" className="font-bold text-2xl">
          Acme Corp
        </RouterLink>
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <RouterLink to={route.href} className={navigationMenuTriggerStyle()}>
                  {route.title}
                </RouterLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <div className="p-4">
              <RouterLink to="/" className="font-bold text-2xl block mb-4">
                Acme Corp
              </RouterLink>
              {routes.map((route) => (
                <RouterLink
                  key={route.href}
                  to={route.href}
                  className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline"
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.title}</span>
                </RouterLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
