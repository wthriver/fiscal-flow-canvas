
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, Calendar, FileText, Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterButton, ExportButton } from "@/components/common/ActionButtons";
import { toast } from "sonner";

const Projects: React.FC = () => {
  // Sample projects data
  const projects = [
    { 
      id: "PROJ-001", 
      name: "Website Redesign", 
      client: "ABC Corporation", 
      startDate: "2025-03-15",
      dueDate: "2025-05-30",
      budget: "$12,500.00",
      tracked: "45h 30m",
      billed: "$6,825.00",
      status: "In Progress" 
    },
    { 
      id: "PROJ-002", 
      name: "Mobile App Development", 
      client: "XYZ Limited", 
      startDate: "2025-04-01",
      dueDate: "2025-07-15",
      budget: "$25,000.00",
      tracked: "12h 45m",
      billed: "$1,912.50",
      status: "In Progress" 
    },
    { 
      id: "PROJ-003", 
      name: "Annual Audit", 
      client: "123 Industries", 
      startDate: "2025-02-10",
      dueDate: "2025-03-10",
      budget: "$5,000.00",
      tracked: "32h 15m",
      billed: "$4,837.50",
      status: "Completed" 
    },
    { 
      id: "PROJ-004", 
      name: "Marketing Campaign", 
      client: "Global Tech", 
      startDate: "2025-04-15",
      dueDate: "2025-05-15",
      budget: "$8,750.00",
      tracked: "0h 0m",
      billed: "$0.00",
      status: "Not Started" 
    },
    { 
      id: "PROJ-005", 
      name: "Product Launch", 
      client: "Acme Inc", 
      startDate: "2025-05-01",
      dueDate: "2025-06-15",
      budget: "$15,000.00",
      tracked: "0h 0m",
      billed: "$0.00",
      status: "Not Started" 
    },
  ];

  const handleAddProject = () => {
    // Display a create project modal
    const projectModal = document.createElement('div');
    projectModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    projectModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-bold mb-4">New Project</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Project Name</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter project name" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Client</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select a client</option>
              <option value="ABC Corporation">ABC Corporation</option>
              <option value="XYZ Limited">XYZ Limited</option>
              <option value="123 Industries">123 Industries</option>
              <option value="Global Tech">Global Tech</option>
              <option value="Acme Inc">Acme Inc</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" class="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Budget</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="$0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Project Type</label>
            <select class="w-full p-2 border rounded-md">
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="retainer">Monthly Retainer</option>
              <option value="non_billable">Non-billable</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Project Description</label>
            <textarea class="w-full p-2 border rounded-md" rows="3" placeholder="Describe the project..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Team Members</label>
            <select class="w-full p-2 border rounded-md" multiple>
              <option value="user1">Jane Smith</option>
              <option value="user2">John Doe</option>
              <option value="user3">Robert Johnson</option>
              <option value="user4">Sarah Williams</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-project">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-project">Create Project</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(projectModal);
    
    document.getElementById('cancel-project')?.addEventListener('click', () => {
      document.body.removeChild(projectModal);
    });
    
    document.getElementById('save-project')?.addEventListener('click', () => {
      toast.success("New project created successfully");
      document.body.removeChild(projectModal);
    });
  };

  const handleTrackTime = (id?: string) => {
    // Find the project if ID is provided
    const project = id ? projects.find(project => project.id === id) : null;
    
    // Display a time tracking modal
    const timeModal = document.createElement('div');
    timeModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    timeModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Track Time</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Project</label>
            <select class="w-full p-2 border rounded-md" ${project ? 'disabled' : ''}>
              <option value="">Select a project</option>
              ${projects.map(p => `<option value="${p.id}" ${project && p.id === project.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Task</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="What are you working on?" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${new Date().toISOString().split('T')[0]}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Time</label>
              <div class="flex gap-2">
                <input type="number" class="w-full p-2 border rounded-md text-center" min="0" max="24" value="1" placeholder="Hours" />
                <span class="flex items-center">:</span>
                <input type="number" class="w-full p-2 border rounded-md text-center" min="0" max="59" step="15" value="0" placeholder="Minutes" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Billable</label>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="billable" class="rounded" checked />
              <label for="billable" class="text-sm">This time is billable</label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Optional notes..."></textarea>
          </div>
        </div>
        <div class="flex justify-between">
          <button class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md flex items-center gap-1" id="start-timer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Start Timer</span>
          </button>
          <div class="space-x-2">
            <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-time">Cancel</button>
            <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-time">Save Entry</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(timeModal);
    
    document.getElementById('cancel-time')?.addEventListener('click', () => {
      document.body.removeChild(timeModal);
    });
    
    document.getElementById('start-timer')?.addEventListener('click', () => {
      toast.info("Timer started");
      document.body.removeChild(timeModal);
    });
    
    document.getElementById('save-time')?.addEventListener('click', () => {
      toast.success("Time entry saved successfully");
      document.body.removeChild(timeModal);
    });
  };

  const handleViewProject = (id: string) => {
    // Find the project
    const project = projects.find(project => project.id === id);
    
    if (!project) return;
    
    // Display a project details modal
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    detailsModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold">${project.name}</h3>
            <p class="text-gray-500">${project.id}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-medium ${
            project.status === "Completed" 
              ? "bg-green-100 text-green-800" 
              : project.status === "In Progress" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-800"
          }">
            ${project.status}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Client</h4>
              <p class="font-medium">${project.client}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Start Date</h4>
                <p>${project.startDate}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Due Date</h4>
                <p>${project.dueDate}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Description</h4>
              <p class="text-sm text-gray-600">This project involves redesigning the client's website to improve user experience and incorporate modern design elements.</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Project Overview</h4>
              <div class="mt-2 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Budget</span>
                  <span class="font-medium">${project.budget}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Time Tracked</span>
                  <span class="font-medium">${project.tracked}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Amount Billed</span>
                  <span class="font-medium">${project.billed}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Completion</span>
                  <span class="font-medium">65%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Project Team</h4>
              <div class="mt-2 flex flex-wrap gap-2">
                <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  <span class="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-white">J</span>
                  <span>Jane Smith</span>
                </div>
                <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  <span class="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center text-white">R</span>
                  <span>Robert Johnson</span>
                </div>
                <div class="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  <span class="h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center text-white">S</span>
                  <span>Sarah Williams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-6">
          <div>
            <h4 class="font-medium mb-3">Tasks</h4>
            <div class="border rounded-md">
              <table class="w-full">
                <thead>
                  <tr class="text-sm text-gray-500 border-b">
                    <th class="py-2 px-4 text-left">Task</th>
                    <th class="py-2 px-4 text-left">Assigned To</th>
                    <th class="py-2 px-4 text-left">Due Date</th>
                    <th class="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2 px-4">Design homepage mockup</td>
                    <td class="py-2 px-4">Sarah Williams</td>
                    <td class="py-2 px-4">2025-04-20</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span></td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-4">Develop responsive navbar</td>
                    <td class="py-2 px-4">Robert Johnson</td>
                    <td class="py-2 px-4">2025-04-25</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4">Implement contact form</td>
                    <td class="py-2 px-4">Jane Smith</td>
                    <td class="py-2 px-4">2025-05-05</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Started</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium mb-3">Recent Time Entries</h4>
            <div class="border rounded-md">
              <table class="w-full">
                <thead>
                  <tr class="text-sm text-gray-500 border-b">
                    <th class="py-2 px-4 text-left">Date</th>
                    <th class="py-2 px-4 text-left">User</th>
                    <th class="py-2 px-4 text-left">Task</th>
                    <th class="py-2 px-4 text-left">Hours</th>
                    <th class="py-2 px-4 text-left">Billable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2 px-4">2025-04-11</td>
                    <td class="py-2 px-4">Sarah Williams</td>
                    <td class="py-2 px-4">UI improvements on homepage</td>
                    <td class="py-2 px-4">3.5</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span></td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2 px-4">2025-04-10</td>
                    <td class="py-2 px-4">Robert Johnson</td>
                    <td class="py-2 px-4">Responsive navigation implementation</td>
                    <td class="py-2 px-4">4.0</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span></td>
                  </tr>
                  <tr>
                    <td class="py-2 px-4">2025-04-09</td>
                    <td class="py-2 px-4">Jane Smith</td>
                    <td class="py-2 px-4">Client meeting and requirements review</td>
                    <td class="py-2 px-4">1.5</td>
                    <td class="py-2 px-4"><span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">No</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap justify-end gap-2 mt-6">
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="track-time">
            <Clock size={16} />
            <span>Track Time</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="view-activity">
            <Activity size={16} />
            <span>Activity</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="create-invoice">
            <FileText size={16} />
            <span>Invoice</span>
          </button>
          <button class="px-4 py-2 border bg-white hover:bg-gray-50 rounded-md flex items-center gap-2" id="edit-project">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="close-view">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(detailsModal);
    
    document.getElementById('close-view')?.addEventListener('click', () => {
      document.body.removeChild(detailsModal);
    });
    
    document.getElementById('track-time')?.addEventListener('click', () => {
      document.body.removeChild(detailsModal);
      handleTrackTime(id);
    });
    
    document.getElementById('view-activity')?.addEventListener('click', () => {
      toast.info(`Viewing activity log for ${project.name}`);
    });
    
    document.getElementById('create-invoice')?.addEventListener('click', () => {
      toast.info(`Creating invoice for ${project.name}`);
    });
    
    document.getElementById('edit-project')?.addEventListener('click', () => {
      document.body.removeChild(detailsModal);
      handleEditProject(id);
    });
  };

  const handleEditProject = (id: string) => {
    // Find the project
    const project = projects.find(project => project.id === id);
    
    if (!project) return;
    
    // Display an edit project modal
    const editModal = document.createElement('div');
    editModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    editModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Edit Project</h3>
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-sm font-medium mb-1">Project Name</label>
            <input type="text" class="w-full p-2 border rounded-md" value="${project.name}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Client</label>
            <select class="w-full p-2 border rounded-md">
              <option value="ABC Corporation" ${project.client === 'ABC Corporation' ? 'selected' : ''}>ABC Corporation</option>
              <option value="XYZ Limited" ${project.client === 'XYZ Limited' ? 'selected' : ''}>XYZ Limited</option>
              <option value="123 Industries" ${project.client === '123 Industries' ? 'selected' : ''}>123 Industries</option>
              <option value="Global Tech" ${project.client === 'Global Tech' ? 'selected' : ''}>Global Tech</option>
              <option value="Acme Inc" ${project.client === 'Acme Inc' ? 'selected' : ''}>Acme Inc</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${project.startDate}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${project.dueDate}" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Budget</label>
            <input type="text" class="w-full p-2 border rounded-md" value="${project.budget}" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select class="w-full p-2 border rounded-md">
              <option value="Not Started" ${project.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
              <option value="In Progress" ${project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="On Hold" ${project.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Project Description</label>
            <textarea class="w-full p-2 border rounded-md" rows="3">This project involves redesigning the client's website to improve user experience and incorporate modern design elements.</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Team Members</label>
            <select class="w-full p-2 border rounded-md" multiple>
              <option value="user1" selected>Jane Smith</option>
              <option value="user2">John Doe</option>
              <option value="user3" selected>Robert Johnson</option>
              <option value="user4" selected>Sarah Williams</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-edit">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="save-edit">Save Changes</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(editModal);
    
    document.getElementById('cancel-edit')?.addEventListener('click', () => {
      document.body.removeChild(editModal);
    });
    
    document.getElementById('save-edit')?.addEventListener('click', () => {
      toast.success(`Project ${project.name} updated successfully`);
      document.body.removeChild(editModal);
    });
  };

  const handleViewInvoice = (id: string) => {
    // Find the project
    const project = projects.find(project => project.id === id);
    
    if (!project) return;
    
    // Display project invoice modal
    const invoiceModal = document.createElement('div');
    invoiceModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    invoiceModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Create Invoice for ${project.name}</h3>
        <div class="space-y-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Client</label>
              <input type="text" class="w-full p-2 border rounded-md bg-gray-50" value="${project.client}" readonly />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Invoice Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${new Date().toISOString().split('T')[0]}" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Due Date</label>
              <input type="date" class="w-full p-2 border rounded-md" value="${new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]}" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Invoice #</label>
              <input type="text" class="w-full p-2 border rounded-md" value="INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}" readonly />
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium mb-2">Invoice Items</h4>
            <div class="border rounded-md">
              <div class="bg-gray-50 p-3 border-b">
                <h5 class="font-medium">Time Entries</h5>
              </div>
              <div class="p-3">
                <label class="flex items-center mb-2">
                  <input type="checkbox" class="mr-2" checked />
                  <span>Include all unbilled time (${project.tracked})</span>
                </label>
                <table class="w-full">
                  <thead>
                    <tr class="text-sm text-gray-500 border-b">
                      <th class="pb-2 text-left">Date</th>
                      <th class="pb-2 text-left">Task</th>
                      <th class="pb-2 text-left">User</th>
                      <th class="pb-2 text-right">Hours</th>
                      <th class="pb-2 text-right">Rate</th>
                      <th class="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b">
                      <td class="py-2">2025-04-11</td>
                      <td class="py-2">UI improvements</td>
                      <td class="py-2">Sarah W.</td>
                      <td class="py-2 text-right">3.5</td>
                      <td class="py-2 text-right">$150.00</td>
                      <td class="py-2 text-right">$525.00</td>
                    </tr>
                    <tr>
                      <td class="py-2">2025-04-10</td>
                      <td class="py-2">Responsive navigation</td>
                      <td class="py-2">Robert J.</td>
                      <td class="py-2 text-right">4.0</td>
                      <td class="py-2 text-right">$150.00</td>
                      <td class="py-2 text-right">$600.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium mb-2">Additional Items</h4>
            <div class="border rounded-md p-3">
              <button class="text-sm text-primary flex items-center gap-1 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14"></path><path d="M5 12h14"></path>
                </svg>
                Add Item
              </button>
              <table class="w-full">
                <thead>
                  <tr class="text-sm text-gray-500 border-b">
                    <th class="pb-2 text-left">Item</th>
                    <th class="pb-2 text-left">Description</th>
                    <th class="pb-2 text-right">Quantity</th>
                    <th class="pb-2 text-right">Rate</th>
                    <th class="pb-2 text-right">Amount</th>
                    <th class="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-2">
                      <input type="text" class="w-full p-1 border rounded-md text-sm" placeholder="Item name" />
                    </td>
                    <td class="py-2">
                      <input type="text" class="w-full p-1 border rounded-md text-sm" placeholder="Description" />
                    </td>
                    <td class="py-2">
                      <input type="number" class="w-full p-1 border rounded-md text-sm text-right" value="1" />
                    </td>
                    <td class="py-2">
                      <input type="text" class="w-full p-1 border rounded-md text-sm text-right" placeholder="$0.00" />
                    </td>
                    <td class="py-2 text-right">$0.00</td>
                    <td class="py-2 text-center">
                      <button class="text-gray-400 hover:text-red-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-md flex justify-end">
            <div class="w-64 space-y-1">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>$1,125.00</span>
              </div>
              <div class="flex justify-between">
                <span>Tax (0%):</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total:</span>
                <span>$1,125.00</span>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea class="w-full p-2 border rounded-md" rows="2" placeholder="Notes to display on invoice..."></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button class="px-4 py-2 bg-gray-200 rounded-md" id="cancel-invoice">Cancel</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md" id="create-invoice-btn">Create Invoice</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(invoiceModal);
    
    document.getElementById('cancel-invoice')?.addEventListener('click', () => {
      document.body.removeChild(invoiceModal);
    });
    
    document.getElementById('create-invoice-btn')?.addEventListener('click', () => {
      toast.success(`Invoice created for ${project.name}`);
      document.body.removeChild(invoiceModal);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your client projects and track time</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleTrackTime()}
          >
            <Clock size={16} />
            <span>Track Time</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleAddProject}
          >
            <PlusCircle size={16} />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">15</CardTitle>
            <CardDescription>Total Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">8</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">4</CardTitle>
            <CardDescription>Completed Projects</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">3</CardTitle>
            <CardDescription>Overdue Projects</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full sm:w-[300px] pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => FilterButton({ type: "Projects" }).props.onClick()}
          >
            <Calendar size={16} />
            <span>Date Range</span>
          </Button>
          <FilterButton type="Projects" />
          <ExportButton type="Projects" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Projects</CardTitle>
          <CardDescription>View and manage your client projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Tracked Time</TableHead>
                <TableHead>Billed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>{project.tracked}</TableCell>
                  <TableCell>{project.billed}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : project.status === "In Progress" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleTrackTime(project.id)}
                      >
                        <Clock size={16} />
                        <span className="sr-only">Track Time</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <Activity size={16} />
                        <span className="sr-only">Activity</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewInvoice(project.id)}
                      >
                        <FileText size={16} />
                        <span className="sr-only">Invoice</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
