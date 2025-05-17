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
import Link from "next/link";
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
        <Link
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
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
    href: "/invoicing",
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
    icon: FileText, // Use appropriate icon from lucide-react
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
        <Link href="/" className="font-bold text-2xl">
          Acme Corp
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {route.title}
                  </NavigationMenuLink>
                </Link>
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
              <Link href="/" className="font-bold text-2xl block mb-4">
                Acme Corp
              </Link>
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="flex items-center space-x-2 py-2 text-sm font-medium hover:underline"
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.title}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
