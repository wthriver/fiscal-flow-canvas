import React from 'react';
import { AdvancedSearch as AdvancedSearchComponent } from '@/components/shared/AdvancedSearch';

const AdvancedSearch: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced Search</h1>
        <p className="text-muted-foreground">Find any record across your entire business</p>
      </div>
      <AdvancedSearchComponent />
    </div>
  );
};

export default AdvancedSearch;