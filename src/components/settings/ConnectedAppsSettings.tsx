
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Shield, 
  MoreVertical, 
  LucideIcon 
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  connectedAt: string;
  permissions: string[];
  icon: string;
}

export function ConnectedAppsSettings() {
  const [apps, setApps] = useState<ConnectedApp[]>([
    {
      id: "1",
      name: "Google Drive",
      description: "Access to upload and manage your documents",
      connectedAt: "Connected on Jan 15, 2023",
      permissions: ["Read files", "Write files"],
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/175px-Google_Drive_icon_%282020%29.svg.png"
    },
    {
      id: "2",
      name: "Slack",
      description: "Send notifications to your Slack workspace",
      connectedAt: "Connected on Mar 7, 2023",
      permissions: ["Send messages"],
      icon: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png"
    },
    {
      id: "3",
      name: "Dropbox",
      description: "Sync your files with Dropbox",
      connectedAt: "Connected on Apr 22, 2023",
      permissions: ["Read files", "Write files"],
      icon: "https://aem.dropbox.com/cms/content/dam/dropbox/www/en-us/branding/app-dropbox.png"
    }
  ]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<ConnectedApp | null>(null);

  const handleDisconnect = (app: ConnectedApp) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const confirmDisconnect = () => {
    if (appToDelete) {
      setApps(apps.filter(app => app.id !== appToDelete.id));
      toast.success(`Disconnected ${appToDelete.name} successfully`);
      setDeleteDialogOpen(false);
      setAppToDelete(null);
    }
  };

  const addNewApp = () => {
    toast.info("Redirecting to app marketplace...");
    // In a real app, this would redirect to an app marketplace or connection page
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>Connected Applications</CardTitle>
        </div>
        <CardDescription>Manage applications and services connected to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end mb-4">
          <Button onClick={addNewApp}>
            <Plus className="mr-2 h-4 w-4" />
            Connect New App
          </Button>
        </div>
        
        {apps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No connected applications</p>
            <Button onClick={addNewApp} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Connect an Application
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="flex items-start gap-4 p-4 border rounded-md">
                <img src={app.icon} alt={app.name} className="w-12 h-12 rounded" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{app.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toast.info(`Viewing ${app.name} details`)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Checking permissions for ${app.name}`)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Review Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => handleDisconnect(app)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Disconnect
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {app.permissions.map((permission, idx) => (
                      <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {permission}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{app.connectedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect {appToDelete?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will revoke access for {appToDelete?.name}. You can reconnect it later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDisconnect} className="bg-destructive text-destructive-foreground">
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
