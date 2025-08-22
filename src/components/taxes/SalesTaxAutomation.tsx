import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Calculator, FileText, MapPin, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface TaxJurisdiction {
  id: string;
  name: string;
  type: 'state' | 'county' | 'city';
  rate: number;
  isActive: boolean;
  nexusStatus: 'physical' | 'economic' | 'none';
  threshold?: number;
  filingFrequency: 'monthly' | 'quarterly' | 'annually';
}

interface TaxRule {
  id: string;
  name: string;
  productCategory: string;
  jurisdictions: string[];
  isExempt: boolean;
  customRate?: number;
}

interface TaxFiling {
  id: string;
  jurisdiction: string;
  period: string;
  dueDate: string;
  status: 'draft' | 'filed' | 'overdue';
  amount: number;
  filedDate?: string;
}

const SAMPLE_JURISDICTIONS: TaxJurisdiction[] = [
  {
    id: 'tx-1',
    name: 'California',
    type: 'state',
    rate: 7.25,
    isActive: true,
    nexusStatus: 'physical',
    filingFrequency: 'quarterly'
  },
  {
    id: 'tx-2',
    name: 'New York',
    type: 'state',
    rate: 8.00,
    isActive: true,
    nexusStatus: 'economic',
    threshold: 500000,
    filingFrequency: 'quarterly'
  },
  {
    id: 'tx-3',
    name: 'Los Angeles County',
    type: 'county',
    rate: 0.50,
    isActive: true,
    nexusStatus: 'physical',
    filingFrequency: 'quarterly'
  }
];

const SAMPLE_TAX_RULES: TaxRule[] = [
  {
    id: 'tr-1',
    name: 'Software Services',
    productCategory: 'Digital Services',
    jurisdictions: ['tx-1', 'tx-2'],
    isExempt: false
  },
  {
    id: 'tr-2',
    name: 'Medical Equipment',
    productCategory: 'Medical',
    jurisdictions: ['tx-1'],
    isExempt: true
  }
];

const SAMPLE_FILINGS: TaxFiling[] = [
  {
    id: 'tf-1',
    jurisdiction: 'California',
    period: 'Q4 2023',
    dueDate: '2024-01-31',
    status: 'filed',
    amount: 2450.50,
    filedDate: '2024-01-28'
  },
  {
    id: 'tf-2',
    jurisdiction: 'New York',
    period: 'Q4 2023',
    dueDate: '2024-01-31',
    status: 'draft',
    amount: 1875.25
  }
];

export const SalesTaxAutomation: React.FC = () => {
  const [jurisdictions, setJurisdictions] = useState<TaxJurisdiction[]>(SAMPLE_JURISDICTIONS);
  const [taxRules, setTaxRules] = useState<TaxRule[]>(SAMPLE_TAX_RULES);
  const [filings, setFilings] = useState<TaxFiling[]>(SAMPLE_FILINGS);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [autoFile, setAutoFile] = useState(false);
  const { toast } = useToast();

  const calculateTaxRate = (jurisdictionIds: string[]) => {
    return jurisdictions
      .filter(j => jurisdictionIds.includes(j.id) && j.isActive)
      .reduce((total, j) => total + j.rate, 0);
  };

  const getFilingStatusBadge = (status: TaxFiling['status']) => {
    const variants = {
      draft: 'secondary',
      filed: 'default',
      overdue: 'destructive'
    } as const;
    
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      filed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getNexusStatusBadge = (status: TaxJurisdiction['nexusStatus']) => {
    const colors = {
      physical: 'bg-blue-100 text-blue-800',
      economic: 'bg-purple-100 text-purple-800',
      none: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="secondary" className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)} Nexus
      </Badge>
    );
  };

  const handleFileTax = (filing: TaxFiling) => {
    toast({
      title: "Tax Filing Initiated",
      description: `Filing ${filing.period} taxes for ${filing.jurisdiction}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Tax Automation</h1>
          <p className="text-muted-foreground">Automate tax calculations, compliance, and filings</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Tax Report
        </Button>
      </div>

      {/* Tax Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,742.50</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jurisdictions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jurisdictions.filter(j => j.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Nexus established</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Filings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filings.filter(f => f.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">On-time filings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="jurisdictions">Jurisdictions</TabsTrigger>
          <TabsTrigger value="rules">Tax Rules</TabsTrigger>
          <TabsTrigger value="filings">Filings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tax Activity</CardTitle>
                <CardDescription>Latest tax calculations and filings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-4 w-4" />
                      <span className="text-sm">Invoice INV-001 tax calculated</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$85.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">California Q4 filing prepared</span>
                    </div>
                    <span className="text-sm text-muted-foreground">$2,450.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tax filing due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filings.filter(f => f.status === 'draft').map((filing) => (
                    <div key={filing.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{filing.jurisdiction}</div>
                        <div className="text-xs text-muted-foreground">{filing.period}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{filing.dueDate}</div>
                        <div className="text-xs text-muted-foreground">${filing.amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jurisdictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Jurisdictions</CardTitle>
              <CardDescription>Manage tax jurisdictions and nexus status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jurisdictions.map((jurisdiction) => (
                  <div key={jurisdiction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{jurisdiction.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {jurisdiction.rate}% • {jurisdiction.filingFrequency} filing
                          {jurisdiction.threshold && ` • $${jurisdiction.threshold.toLocaleString()} threshold`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getNexusStatusBadge(jurisdiction.nexusStatus)}
                      <Badge variant={jurisdiction.isActive ? 'default' : 'secondary'}>
                        {jurisdiction.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Jurisdiction</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Rules</CardTitle>
              <CardDescription>Configure product-specific tax rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {rule.productCategory} • Applied to {rule.jurisdictions.length} jurisdictions
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.isExempt ? 'secondary' : 'default'}>
                        {rule.isExempt ? 'Exempt' : 'Taxable'}
                      </Badge>
                      {rule.customRate && (
                        <Badge variant="outline">{rule.customRate}%</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Add Tax Rule</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Filings</CardTitle>
              <CardDescription>Track and manage tax filings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filings.map((filing) => (
                  <div key={filing.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{filing.jurisdiction} - {filing.period}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {filing.dueDate} • Amount: ${filing.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getFilingStatusBadge(filing.status)}
                      {filing.status === 'draft' && (
                        <Button size="sm" onClick={() => handleFileTax(filing)}>
                          File Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Configure tax automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-calculate tax on invoices</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically calculate tax based on customer location and product rules
                  </div>
                </div>
                <Switch checked={autoCalculate} onCheckedChange={setAutoCalculate} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-file tax returns</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically file tax returns when due (requires review)
                  </div>
                </div>
                <Switch checked={autoFile} onCheckedChange={setAutoFile} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-rate">Default Tax Rate (%)</Label>
                <Input id="default-rate" type="number" placeholder="8.5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rounding">Tax Rounding</Label>
                <Select defaultValue="round">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round to nearest cent</SelectItem>
                    <SelectItem value="up">Always round up</SelectItem>
                    <SelectItem value="down">Always round down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};