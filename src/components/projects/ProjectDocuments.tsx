
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface ProjectDocumentsProps {
  documents: ProjectDocument[];
  onViewDocument: (document: ProjectDocument) => void;
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ 
  documents = [],
  onViewDocument 
}) => {
  // Map company context documents to component format if needed
  const formattedDocuments = documents.map(doc => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    uploadedBy: doc.uploadedBy || "Unknown",
    date: doc.date || (doc as any).uploadDate || "Unknown" // Handle both date naming conventions
  }));

  if (!formattedDocuments || formattedDocuments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="mx-auto h-8 w-8 mb-2" />
        <p>No documents have been uploaded yet</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell>{doc.uploadedBy}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDocument(doc)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
