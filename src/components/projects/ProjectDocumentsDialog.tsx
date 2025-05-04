
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { ProjectDocument } from "@/contexts/CompanyContext";
import { useCompany } from "@/contexts/CompanyContext";

interface ProjectDocumentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ProjectDocumentsDialog: React.FC<ProjectDocumentsDialogProps> = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName 
}) => {
  const { currentCompany, updateCompany } = useCompany();
  const project = currentCompany.projects.find(p => p.id === projectId);
  const documents = project?.documents || [];

  const handleDeleteDocument = (documentId: string) => {
    const updatedProjects = currentCompany.projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          documents: project.documents?.filter(doc => doc.id !== documentId) || []
        };
      }
      return project;
    });
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    toast.success("Document deleted successfully");
  };

  const handleViewDocument = (document: ProjectDocument) => {
    toast.info(`Viewing ${document.name}`, {
      description: "Document viewer would open here"
    });
  };

  const handleDownloadDocument = (document: ProjectDocument) => {
    toast.success(`Downloading ${document.name}`);
  };

  const handleUploadDocument = () => {
    // Simulate uploading a new document
    const newDocument: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: `Document-${Math.floor(Math.random() * 1000)}.pdf`,
      type: "PDF",
      size: "1.2 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      url: "#"
    };
    
    const updatedProjects = currentCompany.projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          documents: [...(project.documents || []), newDocument]
        };
      }
      return project;
    });
    
    updateCompany(currentCompany.id, { projects: updatedProjects });
    toast.success("Document uploaded successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Project Documents</DialogTitle>
          <DialogDescription>
            View and manage documents for {projectName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center my-4">
          <p className="text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? 's' : ''} available
          </p>
          <Button onClick={handleUploadDocument}>Upload Document</Button>
        </div>
        
        {documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    {document.name}
                  </TableCell>
                  <TableCell>{document.type}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>{document.uploadDate}</TableCell>
                  <TableCell>{document.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewDocument(document)}
                      >
                        <Eye size={16} />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download size={16} />
                        <span className="sr-only">Download</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border rounded-md">
            <FileText size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No documents available</p>
            <p className="text-sm text-muted-foreground mb-4">Upload documents to get started</p>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
