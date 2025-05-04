
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDocument } from "@/contexts/CompanyContext";
import { FileText, Plus } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { ProjectDocumentsDialog } from "./ProjectDocumentsDialog";
import { toast } from "sonner";

interface ProjectDocumentsProps {
  projectId: string;
  projectName: string;
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId, projectName }) => {
  const { currentCompany } = useCompany();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const project = currentCompany.projects.find(p => p.id === projectId);
  const documents = project?.documents || [];
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Project Documents</CardTitle>
              <CardDescription>
                {documents.length} document{documents.length !== 1 ? 's' : ''} available
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setDialogOpen(true)}
            >
              <Plus size={16} />
              <span>Manage Documents</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.slice(0, 4).map(document => (
                <div
                  key={document.id}
                  className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                  onClick={() => toast.info(`Opening document: ${document.name}`)}
                >
                  <FileText size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{document.name}</p>
                    <p className="text-xs text-muted-foreground">{document.type} • {document.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No documents available</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setDialogOpen(true)}
              >
                Upload Documents
              </Button>
            </div>
          )}
          
          {documents.length > 4 && (
            <div className="mt-2 text-center">
              <Button variant="link" onClick={() => setDialogOpen(true)}>
                View all {documents.length} documents
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <ProjectDocumentsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        projectId={projectId}
        projectName={projectName}
      />
    </>
  );
};
