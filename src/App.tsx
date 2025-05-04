
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Banking from "./pages/Banking";
import Reports from "./pages/Reports";
import Journal from "./pages/Journal";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Projects from "./pages/Projects";
import Taxes from "./pages/Taxes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { CompanyProvider } from "./contexts/CompanyContext";

// Import feature pages
import Payroll from "./pages/Payroll";
import TimeTrackingPage from "./pages/TimeTracking";
import Budgeting from "./pages/Budgeting";
import Receipts from "./pages/Receipts";

// Settings related pages are now accessed through the Settings page
// These routes remain for direct access
import AuditTrail from "./pages/AuditTrail";
import MultiCurrency from "./pages/MultiCurrency";
import Integrations from "./pages/Integrations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CompanyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/banking" element={<Banking />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/time-tracking" element={<TimeTrackingPage />} />
              <Route path="/taxes" element={<Taxes />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Advanced feature routes */}
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/budgeting" element={<Budgeting />} />
              
              {/* Settings-related pages for direct access */}
              <Route path="/audit-trail" element={<AuditTrail />} />
              <Route path="/multi-currency" element={<MultiCurrency />} />
              <Route path="/integrations" element={<Integrations />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
