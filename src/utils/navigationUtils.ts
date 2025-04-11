
import { toast } from "sonner";

// Helper function for navigation actions
export const handleViewItem = (id: string, type: string) => {
  toast.info(`Viewing ${type} ${id}`);
  // In a real app, this would navigate to the detail view
  console.log(`Navigating to view ${type} ${id}`);
  
  // Display a modal with item details - simulation
  const detailsModal = document.createElement('div');
  detailsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  detailsModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Details for ${type}: ${id}</h3>
      <p class="mb-4">This is a simulated details view for the selected item.</p>
      <div class="flex justify-end">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="close-modal">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(detailsModal);
  document.getElementById('close-modal')?.addEventListener('click', () => {
    document.body.removeChild(detailsModal);
  });
};

export const handleEditItem = (id: string, type: string) => {
  toast.info(`Editing ${type} ${id}`);
  // In a real app, this would navigate to the edit form
  console.log(`Navigating to edit ${type} ${id}`);
  
  // Display an edit modal - simulation
  const editModal = document.createElement('div');
  editModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  editModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Edit ${type}: ${id}</h3>
      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${type} ${id}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md">Sample description for ${type} ${id}</textarea>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-edit">Cancel</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md" id="save-edit">Save Changes</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(editModal);
  
  document.getElementById('cancel-edit')?.addEventListener('click', () => {
    document.body.removeChild(editModal);
  });
  
  document.getElementById('save-edit')?.addEventListener('click', () => {
    toast.success(`${type} ${id} updated successfully`);
    document.body.removeChild(editModal);
  });
};

export const handleDeleteItem = (id: string, type: string) => {
  // Display a confirmation modal
  const confirmModal = document.createElement('div');
  confirmModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  confirmModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-2">Confirm Delete</h3>
      <p class="mb-4">Are you sure you want to delete ${type} ${id}? This action cannot be undone.</p>
      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-delete">Cancel</button>
        <button class="px-4 py-2 bg-red-600 text-white rounded-md" id="confirm-delete">Delete</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmModal);
  
  document.getElementById('cancel-delete')?.addEventListener('click', () => {
    document.body.removeChild(confirmModal);
  });
  
  document.getElementById('confirm-delete')?.addEventListener('click', () => {
    toast.success(`${type} ${id} deleted successfully`);
    document.body.removeChild(confirmModal);
    
    // In a real app, this would remove the item from the database
    console.log(`Deleting ${type} ${id}`);
    
    // Remove the row from the table if it exists
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.classList.add('animate-fade-out');
      setTimeout(() => {
        row.remove();
      }, 300);
    }
  });
};

export const handleCreateItem = (type: string) => {
  toast.info(`Creating new ${type}`);
  // In a real app, this would navigate to the create form
  console.log(`Navigating to create new ${type}`);
  
  // Display a create modal - simulation
  const createModal = document.createElement('div');
  createModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  createModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Create New ${type}</h3>
      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-create">Cancel</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md" id="save-create">Create</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(createModal);
  
  document.getElementById('cancel-create')?.addEventListener('click', () => {
    document.body.removeChild(createModal);
  });
  
  document.getElementById('save-create')?.addEventListener('click', () => {
    toast.success(`New ${type} created successfully`);
    document.body.removeChild(createModal);
  });
};

export const handleExport = (type: string, format: string = "CSV") => {
  toast.success(`Exporting ${type} as ${format}`);
  
  // Create a dropdown for export options - simulation
  const exportDropdown = document.createElement('div');
  exportDropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border';
  exportDropdown.style.top = '40px';
  exportDropdown.innerHTML = `
    <div class="px-4 py-2 text-sm text-gray-700 font-semibold border-b">Export Options</div>
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="export-csv">CSV</button>
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="export-excel">Excel</button>
    <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="export-pdf">PDF</button>
  `;
  
  // Find the export button that was clicked and position the dropdown next to it
  const exportButtons = document.querySelectorAll('[data-export="true"]');
  if (exportButtons.length > 0) {
    const exportButton = exportButtons[0] as HTMLElement;
    const rect = exportButton.getBoundingClientRect();
    exportDropdown.style.position = 'fixed';
    exportDropdown.style.top = `${rect.bottom}px`;
    exportDropdown.style.left = `${rect.left}px`;
  }
  
  document.body.appendChild(exportDropdown);
  
  // Handle clicks outside the dropdown to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (!exportDropdown.contains(event.target as Node)) {
      document.body.removeChild(exportDropdown);
      document.removeEventListener('click', handleClickOutside);
    }
  };
  
  // Add a small delay before adding the click listener to prevent immediate closing
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);
  
  // Handle export options
  document.getElementById('export-csv')?.addEventListener('click', () => {
    toast.success(`Exporting ${type} as CSV`);
    document.body.removeChild(exportDropdown);
  });
  
  document.getElementById('export-excel')?.addEventListener('click', () => {
    toast.success(`Exporting ${type} as Excel`);
    document.body.removeChild(exportDropdown);
  });
  
  document.getElementById('export-pdf')?.addEventListener('click', () => {
    toast.success(`Exporting ${type} as PDF`);
    document.body.removeChild(exportDropdown);
  });
};

export const handleFilter = (type: string) => {
  toast.info(`Filtering ${type}`);
  
  // Create a filter modal - simulation
  const filterModal = document.createElement('div');
  filterModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  filterModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Filter ${type}</h3>
      <div class="space-y-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="date" class="p-2 border rounded-md" placeholder="Start Date" />
            <input type="date" class="p-2 border rounded-md" placeholder="End Date" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="reset-filter">Reset</button>
        <button class="px-4 py-2 bg-primary text-white rounded-md" id="apply-filter">Apply Filters</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(filterModal);
  
  document.getElementById('reset-filter')?.addEventListener('click', () => {
    toast.info(`Filters reset for ${type}`);
  });
  
  document.getElementById('apply-filter')?.addEventListener('click', () => {
    toast.success(`Filters applied to ${type}`);
    document.body.removeChild(filterModal);
  });
};

export const handleDateRange = (type: string) => {
  toast.info(`Setting date range for ${type}`);
  
  // Create a date range picker modal - simulation
  const dateRangeModal = document.createElement('div');
  dateRangeModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  dateRangeModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Select Date Range</h3>
      <div class="space-y-4 mb-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" class="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">End Date</label>
            <input type="date" class="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Quick Select</label>
          <div class="grid grid-cols-2 gap-2">
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="this-week">This Week</button>
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="this-month">This Month</button>
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="last-month">Last Month</button>
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="last-quarter">Last Quarter</button>
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="this-year">This Year</button>
            <button class="p-2 border rounded-md hover:bg-gray-100 text-sm" id="last-year">Last Year</button>
          </div>
        </div>
      </div>
      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-date">Cancel</button>
        <button class="px-4 py-2 bg-primary text-white rounded-md" id="apply-date">Apply</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dateRangeModal);
  
  document.getElementById('this-week')?.addEventListener('click', () => {
    toast.info('Selected This Week');
  });
  
  document.getElementById('this-month')?.addEventListener('click', () => {
    toast.info('Selected This Month');
  });
  
  document.getElementById('cancel-date')?.addEventListener('click', () => {
    document.body.removeChild(dateRangeModal);
  });
  
  document.getElementById('apply-date')?.addEventListener('click', () => {
    toast.success(`Date range applied to ${type}`);
    document.body.removeChild(dateRangeModal);
  });
};
