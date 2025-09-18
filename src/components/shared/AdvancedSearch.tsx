import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';

interface SearchFilters {
  entityType: 'all' | 'customers' | 'invoices' | 'expenses' | 'transactions' | 'projects';
  keyword: string;
  dateRange: {
    from: string;
    to: string;
  };
  amountRange: {
    min: number;
    max: number;
  };
  status: string[];
  tags: string[];
  customFields: Record<string, string>;
}

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  amount?: number;
  date?: string;
  status?: string;
  tags?: string[];
  relevance: number;
}

export const AdvancedSearch: React.FC = () => {
  const { currentCompany } = useCompany();
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    entityType: 'all',
    keyword: '',
    dateRange: { from: '', to: '' },
    amountRange: { min: 0, max: 0 },
    status: [],
    tags: [],
    customFields: {}
  });

  const availableStatuses = ['Draft', 'Sent', 'Paid', 'Overdue', 'Active', 'Inactive', 'Pending', 'Completed'];
  const availableTags = ['Important', 'Urgent', 'Follow-up', 'VIP', 'Recurring', 'One-time'];

  const performSearch = async () => {
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: SearchResult[] = [];

    // Search customers
    if (filters.entityType === 'all' || filters.entityType === 'customers') {
      currentCompany?.customers?.forEach(customer => {
        if (!filters.keyword || 
            customer.name.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            customer.email.toLowerCase().includes(filters.keyword.toLowerCase())) {
            results.push({
              id: customer.id,
              type: 'Customer',
              title: customer.name,
              subtitle: customer.email,
              status: customer.status,
              relevance: Number(calculateRelevance(customer.name, filters.keyword))
            });
        }
      });
    }

    // Search invoices
    if (filters.entityType === 'all' || filters.entityType === 'invoices') {
      currentCompany?.invoices?.forEach(invoice => {
        if (!filters.keyword || 
            invoice.id.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            invoice.customer?.toLowerCase().includes(filters.keyword.toLowerCase())) {
          const withinDateRange = !filters.dateRange.from || 
            (new Date(invoice.date) >= new Date(filters.dateRange.from) &&
             (!filters.dateRange.to || new Date(invoice.date) <= new Date(filters.dateRange.to)));
          
          const withinAmountRange = !filters.amountRange.max || 
            (invoice.total >= filters.amountRange.min && invoice.total <= filters.amountRange.max);

          if (withinDateRange && withinAmountRange) {
            results.push({
              id: invoice.id,
              type: 'Invoice',
              title: `Invoice ${invoice.id}`,
              subtitle: invoice.customer || 'Unknown Customer',
              amount: invoice.total,
              date: invoice.date,
              status: invoice.status,
              relevance: Number(calculateRelevance(invoice.id, filters.keyword))
            });
          }
        }
      });
    }

    // Search expenses
    if (filters.entityType === 'all' || filters.entityType === 'expenses') {
      currentCompany?.expenses?.forEach(expense => {
        if (!filters.keyword || 
            expense.description.toLowerCase().includes(filters.keyword.toLowerCase()) ||
            expense.vendor?.toLowerCase().includes(filters.keyword.toLowerCase())) {
          results.push({
            id: expense.id,
            type: 'Expense',
            title: expense.description,
            subtitle: expense.vendor || 'No Vendor',
            amount: typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0,
            date: expense.date,
            relevance: Number(calculateRelevance(expense.description, filters.keyword))
          });
        }
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    setSearchResults(results);
    setIsSearching(false);
  };

  const calculateRelevance = (text: string, keyword: string): number => {
    if (!keyword) return 1;
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerText === lowerKeyword) return 100;
    if (lowerText.startsWith(lowerKeyword)) return 80;
    if (lowerText.includes(lowerKeyword)) return 60;
    
    // Fuzzy matching
    const distance = levenshteinDistance(lowerText, lowerKeyword);
    return Math.max(0, 40 - (distance * 5));
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const clearFilters = () => {
    setFilters({
      entityType: 'all',
      keyword: '',
      dateRange: { from: '', to: '' },
      amountRange: { min: 0, max: 0 },
      status: [],
      tags: [],
      customFields: {}
    });
    setSearchResults([]);
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'Customer': return '👤';
      case 'Invoice': return '📄';
      case 'Expense': return '💰';
      case 'Project': return '📋';
      default: return '📎';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search across all records..."
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            className="pl-8"
            onKeyDown={(e) => e.key === 'Enter' && performSearch()}
          />
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Advanced Search Filters</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Search In</Label>
                  <Select 
                    value={filters.entityType} 
                    onValueChange={(value: any) => setFilters(prev => ({ ...prev, entityType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="customers">Customers Only</SelectItem>
                      <SelectItem value="invoices">Invoices Only</SelectItem>
                      <SelectItem value="expenses">Expenses Only</SelectItem>
                      <SelectItem value="transactions">Transactions Only</SelectItem>
                      <SelectItem value="projects">Projects Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    type="date"
                    placeholder="From"
                    value={filters.dateRange.from}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, from: e.target.value } 
                    }))}
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    value={filters.dateRange.to}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, to: e.target.value } 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Amount Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Min Amount"
                    value={filters.amountRange.min || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      amountRange: { ...prev.amountRange, min: parseFloat(e.target.value) || 0 } 
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max Amount"
                    value={filters.amountRange.max || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      amountRange: { ...prev.amountRange, max: parseFloat(e.target.value) || 0 } 
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableStatuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label htmlFor={status} className="text-sm">{status}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => { performSearch(); setIsOpen(false); }}>
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button onClick={performSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Active Filters */}
      {(filters.entityType !== 'all' || filters.status.length > 0 || filters.dateRange.from || filters.amountRange.max) && (
        <div className="flex flex-wrap gap-2">
          {filters.entityType !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.entityType}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, entityType: 'all' }))}
              />
            </Badge>
          )}
          {filters.status.map(status => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleStatus(status)}
              />
            </Badge>
          ))}
          {filters.dateRange.from && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {filters.dateRange.from} - {filters.dateRange.to || 'Now'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, dateRange: { from: '', to: '' } }))}
              />
            </Badge>
          )}
          {filters.amountRange.max > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              ${filters.amountRange.min} - ${filters.amountRange.max}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, amountRange: { min: 0, max: 0 } }))}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div key={`${result.type}-${result.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getResultIcon(result.type)}</span>
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.amount && (
                      <span className="text-sm font-medium">${result.amount.toLocaleString()}</span>
                    )}
                    {result.status && (
                      <Badge variant="outline">{result.status}</Badge>
                    )}
                    {result.date && (
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    )}
                    <Badge variant="secondary">{result.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};