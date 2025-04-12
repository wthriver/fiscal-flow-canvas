
import { toast } from "sonner";

// Helper function for navigation actions
export const handleViewItem = (id: string, type: string) => {
  toast.info(`Viewing ${type} ${id}`);
  
  // Get appropriate details based on item type
  let itemDetails = getItemDetails(id, type);
  
  // Display a modal with item details
  const detailsModal = document.createElement('div');
  detailsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  detailsModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-bold">Details for ${type}: ${id}</h3>
        <span class="${getStatusClass(itemDetails.status)}">${itemDetails.status}</span>
      </div>
      
      <div class="space-y-4">
        ${renderDetailsContent(itemDetails, type)}
      </div>
      
      <div class="flex justify-end mt-6">
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
  
  // Get appropriate details based on item type
  let itemDetails = getItemDetails(id, type);
  
  // Display an edit modal - simulation
  const editModal = document.createElement('div');
  editModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  editModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Edit ${type}: ${id}</h3>
      <div class="space-y-4 mb-4">
        ${renderEditForm(itemDetails, type)}
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
  
  // Display a create modal - simulation
  const createModal = document.createElement('div');
  createModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  createModal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold mb-4">Create New ${type}</h3>
      <div class="space-y-4 mb-4">
        ${renderCreateForm(type)}
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
            ${getStatusOptions(type)}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="date" class="p-2 border rounded-md" placeholder="Start Date" />
            <input type="date" class="p-2 border rounded-md" placeholder="End Date" />
          </div>
        </div>
        ${getAdditionalFilterFields(type)}
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

// Helper functions for generating content based on item type
function getItemDetails(id: string, type: string) {
  // This would fetch real data in a production app
  // Returning mock data based on item type
  switch (type) {
    case 'Invoice':
      return {
        id,
        customer: 'ABC Corporation',
        date: '2025-04-10',
        amount: '$1,250.00',
        status: 'Paid',
        items: [
          { name: 'Web Design Services', qty: 1, price: '$1,000.00' },
          { name: 'Hosting (Monthly)', qty: 1, price: '$250.00' }
        ],
        notes: 'Payment received via bank transfer.'
      };
    case 'Expense':
      return {
        id,
        category: 'Office Supplies',
        vendor: 'Staples',
        date: '2025-04-09',
        amount: '$150.00',
        status: 'Approved',
        items: [
          { name: 'Printer Paper', qty: 2, price: '$45.00' },
          { name: 'Ink Cartridges', qty: 1, price: '$65.00' },
          { name: 'Pens and Notepads', qty: 1, price: '$40.00' }
        ],
        paymentMethod: 'Company Credit Card',
        notes: 'Monthly office supply restock.'
      };
    case 'Journal Entry':
      return {
        id,
        date: '2025-04-10',
        memo: 'Monthly Rent Payment',
        debitAccount: 'Rent Expense',
        creditAccount: 'Bank Account',
        amount: '$2,500.00',
        status: 'Posted',
        description: 'Payment for office space at 123 Business Ave.'
      };
    case 'Bank Account':
      return {
        id,
        name: 'Business Checking',
        accountNumber: 'xxxx-xxxx-1234',
        balance: '$24,500.00',
        status: 'Active',
        lastTransaction: '2025-04-11',
        bank: 'First National Bank'
      };
    case 'Customer':
      return {
        id,
        name: 'ABC Corporation',
        contact: 'John Smith',
        email: 'john@abccorp.com',
        phone: '(555) 123-4567',
        address: '123 Business St, New York, NY 10001',
        status: 'Active',
        totalPurchases: '$12,450.00'
      };
    case 'Product':
      return {
        id,
        name: 'Premium Widget',
        sku: 'WDGT-PRM-001',
        price: '$49.99',
        cost: '$22.50',
        quantity: 125,
        category: 'Widgets',
        status: 'In Stock'
      };
    case 'Project':
      return {
        id,
        name: 'Website Redesign',
        client: 'ABC Corporation',
        startDate: '2025-03-15',
        dueDate: '2025-05-30',
        budget: '$15,000.00',
        status: 'In Progress',
        completion: '45%',
        manager: 'Jane Wilson'
      };
    case 'Sale':
      return {
        id,
        customer: 'ABC Corporation',
        date: '2025-04-11',
        items: 5,
        total: '$1,250.00',
        status: 'Completed',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        salesRep: 'Michael Johnson'
      };
    default:
      return {
        id,
        name: `${type} ${id}`,
        date: '2025-04-10',
        status: 'Active',
        description: `This is a ${type} item.`
      };
  }
}

function renderDetailsContent(itemDetails: any, type: string) {
  // Generate appropriate content based on the item type
  let content = '';
  
  switch (type) {
    case 'Invoice':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Customer</p>
            <p>${itemDetails.customer}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Date</p>
            <p>${itemDetails.date}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Amount</p>
            <p>${itemDetails.amount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Items</p>
          <table class="w-full text-sm mt-1">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-1">Item</th>
                <th class="pb-1">Qty</th>
                <th class="pb-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemDetails.items.map((item: any) => `
                <tr class="border-b">
                  <td class="py-1">${item.name}</td>
                  <td class="py-1">${item.qty}</td>
                  <td class="py-1 text-right">${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Notes</p>
          <p class="text-sm">${itemDetails.notes}</p>
        </div>
      `;
      break;
    case 'Expense':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Category</p>
            <p>${itemDetails.category}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Vendor</p>
            <p>${itemDetails.vendor}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Date</p>
            <p>${itemDetails.date}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Amount</p>
            <p>${itemDetails.amount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Payment Method</p>
            <p>${itemDetails.paymentMethod}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Items</p>
          <table class="w-full text-sm mt-1">
            <thead>
              <tr class="border-b text-left">
                <th class="pb-1">Item</th>
                <th class="pb-1">Qty</th>
                <th class="pb-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemDetails.items.map((item: any) => `
                <tr class="border-b">
                  <td class="py-1">${item.name}</td>
                  <td class="py-1">${item.qty}</td>
                  <td class="py-1 text-right">${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Notes</p>
          <p class="text-sm">${itemDetails.notes}</p>
        </div>
      `;
      break;
    case 'Journal Entry':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Date</p>
            <p>${itemDetails.date}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Amount</p>
            <p>${itemDetails.amount}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Memo</p>
            <p>${itemDetails.memo}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Accounts</p>
          <div class="border rounded-md mt-1 divide-y">
            <div class="p-2">
              <p class="font-medium">Debit</p>
              <p>${itemDetails.debitAccount}: ${itemDetails.amount}</p>
            </div>
            <div class="p-2">
              <p class="font-medium">Credit</p>
              <p>${itemDetails.creditAccount}: ${itemDetails.amount}</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-500">Description</p>
          <p class="text-sm">${itemDetails.description}</p>
        </div>
      `;
      break;
    case 'Bank Account':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Account Name</p>
            <p>${itemDetails.name}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Account Number</p>
            <p>${itemDetails.accountNumber}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Bank</p>
            <p>${itemDetails.bank}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Current Balance</p>
            <p class="font-semibold">${itemDetails.balance}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Last Transaction</p>
            <p>${itemDetails.lastTransaction}</p>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">View Transactions</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Download Statement</button>
        </div>
      `;
      break;
    case 'Customer':
      content = `
        <div class="space-y-3">
          <div>
            <p class="text-sm font-medium text-gray-500">Name</p>
            <p>${itemDetails.name}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Contact Person</p>
            <p>${itemDetails.contact}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Email</p>
            <p>${itemDetails.email}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Phone</p>
            <p>${itemDetails.phone}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Address</p>
            <p>${itemDetails.address}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Total Purchases</p>
            <p class="font-semibold">${itemDetails.totalPurchases}</p>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">View Invoices</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm">View Sales</button>
        </div>
      `;
      break;
    case 'Product':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Name</p>
            <p>${itemDetails.name}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">SKU</p>
            <p>${itemDetails.sku}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Price</p>
            <p>${itemDetails.price}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Cost</p>
            <p>${itemDetails.cost}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Quantity</p>
            <p>${itemDetails.quantity}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Category</p>
            <p>${itemDetails.category}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Adjust Inventory</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm">View History</button>
        </div>
      `;
      break;
    case 'Project':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Name</p>
            <p>${itemDetails.name}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Client</p>
            <p>${itemDetails.client}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Start Date</p>
            <p>${itemDetails.startDate}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Due Date</p>
            <p>${itemDetails.dueDate}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Budget</p>
            <p>${itemDetails.budget}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Project Manager</p>
            <p>${itemDetails.manager}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Completion</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${itemDetails.completion}"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">View Tasks</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm">View Timeline</button>
        </div>
      `;
      break;
    case 'Sale':
      content = `
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Customer</p>
            <p>${itemDetails.customer}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Date</p>
            <p>${itemDetails.date}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Items</p>
            <p>${itemDetails.items}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Total</p>
            <p>${itemDetails.total}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Payment Status</p>
            <p>${itemDetails.paymentStatus}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Payment Method</p>
            <p>${itemDetails.paymentMethod}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Sales Rep</p>
            <p>${itemDetails.salesRep}</p>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">View Invoice</button>
          <button class="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Print Receipt</button>
        </div>
      `;
      break;
    default:
      content = `
        <div class="space-y-3">
          <div>
            <p class="text-sm font-medium text-gray-500">Name</p>
            <p>${itemDetails.name}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Date</p>
            <p>${itemDetails.date}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p>${itemDetails.status}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Description</p>
            <p>${itemDetails.description}</p>
          </div>
        </div>
      `;
  }
  
  return content;
}

function renderEditForm(itemDetails: any, type: string) {
  // Generate appropriate form fields based on the item type
  switch (type) {
    case 'Invoice':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.customer}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.date)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Draft" ${itemDetails.status === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Sent" ${itemDetails.status === 'Sent' ? 'selected' : ''}>Sent</option>
            <option value="Paid" ${itemDetails.status === 'Paid' ? 'selected' : ''}>Paid</option>
            <option value="Overdue" ${itemDetails.status === 'Overdue' ? 'selected' : ''}>Overdue</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea class="w-full p-2 border rounded-md">${itemDetails.notes}</textarea>
        </div>
      `;
    case 'Expense':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.category}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Vendor</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.vendor}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.date)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.amount}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Pending" ${itemDetails.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${itemDetails.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Denied" ${itemDetails.status === 'Denied' ? 'selected' : ''}>Denied</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea class="w-full p-2 border rounded-md">${itemDetails.notes}</textarea>
        </div>
      `;
    case 'Journal Entry':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.date)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Memo</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.memo}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Debit Account</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.debitAccount}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Credit Account</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.creditAccount}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.amount}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md">${itemDetails.description}</textarea>
        </div>
      `;
    case 'Customer':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.name}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Contact Person</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.contact}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" class="w-full p-2 border rounded-md" value="${itemDetails.email}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.phone}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <textarea class="w-full p-2 border rounded-md">${itemDetails.address}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Active" ${itemDetails.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${itemDetails.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      `;
    case 'Product':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.name}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">SKU</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.sku}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.price}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cost</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.cost}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Quantity</label>
          <input type="number" class="w-full p-2 border rounded-md" value="${itemDetails.quantity}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.category}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="In Stock" ${itemDetails.status === 'In Stock' ? 'selected' : ''}>In Stock</option>
            <option value="Low Stock" ${itemDetails.status === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
            <option value "Out of Stock" ${itemDetails.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
            <option value="Discontinued" ${itemDetails.status === 'Discontinued' ? 'selected' : ''}>Discontinued</option>
          </select>
        </div>
      `;
    case 'Project':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.name}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Client</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.client}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.startDate)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Due Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.dueDate)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Budget</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.budget}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Not Started" ${itemDetails.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
            <option value="In Progress" ${itemDetails.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="On Hold" ${itemDetails.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
            <option value="Completed" ${itemDetails.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Completion (%)</label>
          <input type="number" class="w-full p-2 border rounded-md" value="${parseInt(itemDetails.completion)}" min="0" max="100" />
        </div>
      `;
    case 'Sale':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.customer}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(itemDetails.date)}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Total</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.total}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Completed" ${itemDetails.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Processing" ${itemDetails.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="On Hold" ${itemDetails.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Paid" ${itemDetails.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
            <option value="Pending" ${itemDetails.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Method</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Credit Card" ${itemDetails.paymentMethod === 'Credit Card' ? 'selected' : ''}>Credit Card</option>
            <option value="Bank Transfer" ${itemDetails.paymentMethod === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
            <option value="Cash" ${itemDetails.paymentMethod === 'Cash' ? 'selected' : ''}>Cash</option>
            <option value="Check" ${itemDetails.paymentMethod === 'Check' ? 'selected' : ''}>Check</option>
          </select>
        </div>
      `;
    default:
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" value="${itemDetails.name}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Active" ${itemDetails.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${itemDetails.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md">${itemDetails.description}</textarea>
        </div>
      `;
  }
}

function renderCreateForm(type: string) {
  // Generate appropriate form fields based on the item type
  switch (type) {
    case 'Invoice':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a customer</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Invoice Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(new Date().toISOString())}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Due Date</label>
          <input type="date" class="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Items</label>
          <div class="border rounded-md p-2">
            <button class="text-sm text-blue-600">+ Add Item</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea class="w-full p-2 border rounded-md"></textarea>
        </div>
      `;
    case 'Expense':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a category</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
            <option value="Software">Software</option>
            <option value="Meals">Meals</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Vendor</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter vendor name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(new Date().toISOString())}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Method</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select payment method</option>
            <option value="Company Credit Card">Company Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Check">Check</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea class="w-full p-2 border rounded-md"></textarea>
        </div>
      `;
    case 'Journal Entry':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(new Date().toISOString())}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Memo</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter a memo" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Debit Account</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select an account</option>
            <option value="Rent Expense">Rent Expense</option>
            <option value="Utilities Expense">Utilities Expense</option>
            <option value="Salary Expense">Salary Expense</option>
            <option value="Insurance Expense">Insurance Expense</option>
            <option value="Office Supplies Expense">Office Supplies Expense</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Credit Account</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select an account</option>
            <option value="Bank Account">Bank Account</option>
            <option value="Accounts Payable">Accounts Payable</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md"></textarea>
        </div>
      `;
    case 'Customer':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter customer name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Contact Person</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter contact name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" class="w-full p-2 border rounded-md" placeholder="Enter email address" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Phone</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter phone number" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter address"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Customer Type</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Business">Business</option>
            <option value="Individual">Individual</option>
          </select>
        </div>
      `;
    case 'Product':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter product name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">SKU</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter SKU" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cost</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Initial Quantity</label>
          <input type="number" class="w-full p-2 border rounded-md" placeholder="0" min="0" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a category</option>
            <option value="Widgets">Widgets</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Tools">Tools</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter product description"></textarea>
        </div>
      `;
    case 'Project':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter project name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Client</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a client</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(new Date().toISOString())}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Due Date</label>
          <input type="date" class="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Budget</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Project Manager</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a manager</option>
            <option value="Jane Wilson">Jane Wilson</option>
            <option value="Michael Johnson">Michael Johnson</option>
            <option value="Sarah Parker">Sarah Parker</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter project description"></textarea>
        </div>
      `;
    case 'Sale':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a customer</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" class="w-full p-2 border rounded-md" value="${formatDate(new Date().toISOString())}" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Items</label>
          <div class="border rounded-md p-2">
            <button class="text-sm text-blue-600">+ Add Item</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Method</label>
          <select class="w-full p-2 border rounded-md">
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Sales Rep</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">Select a sales rep</option>
            <option value="Michael Johnson">Michael Johnson</option>
            <option value="Sarah Parker">Sarah Parker</option>
            <option value="David Williams">David Williams</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Notes</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter notes"></textarea>
        </div>
      `;
    default:
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea class="w-full p-2 border rounded-md" placeholder="Enter description"></textarea>
        </div>
      `;
  }
}

function getStatusOptions(type: string) {
  // Return appropriate status options based on the item type
  switch (type) {
    case 'Invoices':
      return `
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
      `;
    case 'Expenses':
      return `
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
      `;
    case 'Journal Entries':
      return `
        <option value="draft">Draft</option>
        <option value="posted">Posted</option>
      `;
    case 'Customers':
      return `
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      `;
    case 'Products':
      return `
        <option value="in_stock">In Stock</option>
        <option value="low_stock">Low Stock</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="discontinued">Discontinued</option>
      `;
    case 'Projects':
      return `
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="on_hold">On Hold</option>
        <option value="completed">Completed</option>
      `;
    case 'Sales':
      return `
        <option value="completed">Completed</option>
        <option value="processing">Processing</option>
        <option value="on_hold">On Hold</option>
      `;
    default:
      return `
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      `;
  }
}

function getAdditionalFilterFields(type: string) {
  // Return additional filter fields based on the item type
  switch (type) {
    case 'Invoices':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Amount Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Customers</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
      `;
    case 'Expenses':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Categories</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
            <option value="Software">Software</option>
            <option value="Meals">Meals</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
      `;
    case 'Journal Entries':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Account</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Accounts</option>
            <option value="Bank Account">Bank Account</option>
            <option value="Rent Expense">Rent Expense</option>
            <option value="Salary Expense">Salary Expense</option>
            <option value="Utilities Expense">Utilities Expense</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
      `;
    case 'Customers':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer Type</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Types</option>
            <option value="Business">Business</option>
            <option value="Individual">Individual</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Total Purchase Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
      `;
    case 'Products':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Categories</option>
            <option value="Widgets">Widgets</option>
            <option value="Gadgets">Gadgets</option>
            <option value="Tools">Tools</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Price" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Price" />
          </div>
        </div>
      `;
    case 'Projects':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Client</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Clients</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Budget Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Budget" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Budget" />
          </div>
        </div>
      `;
    case 'Sales':
      return `
        <div>
          <label class="block text-sm font-medium mb-1">Customer</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Customers</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="XYZ Limited">XYZ Limited</option>
            <option value="123 Industries">123 Industries</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Payment Status</label>
          <select class="w-full p-2 border rounded-md">
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Amount Range</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="number" class="p-2 border rounded-md" placeholder="Min Amount" />
            <input type="number" class="p-2 border rounded-md" placeholder="Max Amount" />
          </div>
        </div>
      `;
    default:
      return '';
  }
}

function getStatusClass(status: string) {
  // Return appropriate CSS class based on status
  status = status?.toLowerCase() || '';
  
  if (status.includes('paid') || status.includes('completed') || status.includes('approved') || status.includes('active') || status.includes('in stock')) {
    return 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
  }
  
  if (status.includes('pending') || status.includes('draft') || status.includes('in progress') || status.includes('processing') || status.includes('low stock')) {
    return 'px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
  }
  
  if (status.includes('overdue') || status.includes('denied') || status.includes('on hold') || status.includes('out of stock') || status.includes('discontinued')) {
    return 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
  }
  
  return 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
}

// Convert 2025-04-10 to 2025-04-10 (for date inputs)
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    // Return original string if can't parse
    return dateString;
  }
}
