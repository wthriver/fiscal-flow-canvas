import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDropzone } from 'react-dropzone';
import { FilePlus, File, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectDocument } from '@/types/company';

interface ProjectDocumentsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  documents: ProjectDocument[];
  onSave: (newDocuments: ProjectDocument[]) => void;
}

export const ProjectDocumentsDialog: React.FC<ProjectDocumentsDialogProps> = ({
  open,
  setOpen,
  documents: initialDocuments,
  onSave,
}) => {
  const [newDocumentName, setNewDocumentName] = useState('');
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.map((file: File) => {
      const newDocument: ProjectDocument = {
        id: `document-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: `${file.size} bytes`,
        url: URL.createObjectURL(file),
        uploadedBy: 'CurrentUser', // Replace with actual user
        uploadDate: new Date().toISOString(),
        lastModified: new Date(file.lastModified).toISOString(),
      };
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
    });
    toast.success("Document uploaded successfully");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveDocument = (id: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };

  const handleSave = () => {
    onSave(documents);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Project Documents</DialogTitle>
          <DialogDescription>
            Upload and manage documents related to this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div {...getRootProps()} className="dropzone border rounded-md p-4 cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <FilePlus className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </div>
            )}
          </div>
          <div className="document-list">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span>{doc.name}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleRemoveDocument(doc.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
