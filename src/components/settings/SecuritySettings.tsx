
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [twoFactorSetupOpen, setTwoFactorSetupOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [qrCodeUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Lovable:john@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Lovable");

  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleTwoFactorToggle = (checked: boolean) => {
    if (checked) {
      // Open 2FA setup flow when enabling
      setTwoFactorSetupOpen(true);
    } else {
      // Directly disable 2FA
      setTwoFactor(false);
      toast.info("Two-factor authentication disabled");
    }
  };

  const completeTwoFactorSetup = () => {
    // In a real app, we would validate the verification code here
    if (verificationCode.length === 6) {
      setTwoFactor(true);
      setTwoFactorSetupOpen(false);
      toast.success("Two-factor authentication enabled");
    } else {
      toast.error("Please enter a valid 6-digit verification code");
    }
  };

  const cancelTwoFactorSetup = () => {
    setTwoFactorSetupOpen(false);
    setVerificationCode("");
    // Don't enable 2FA if setup was canceled
    setTwoFactor(false);
  };

  const changePassword = () => {
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    // Reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast.success("Password changed successfully");
  };

  const TwoFactorSetupDialog = () => (
    <Dialog open={twoFactorSetupOpen && !isMobile} onOpenChange={setTwoFactorSetupOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app, then enter the verification code below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for 2FA" 
            className="w-48 h-48 mb-4 border rounded"
          />
          <p className="text-sm mb-4">Or enter this code manually: <code className="bg-muted p-1 rounded">JBSWY3DPEHPK3PXP</code></p>
          <Input
            id="verificationCode"
            placeholder="Enter 6-digit code"
            className="w-full"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={cancelTwoFactorSetup}>Cancel</Button>
          <Button onClick={completeTwoFactorSetup}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const TwoFactorSetupDrawer = () => (
    <Drawer open={twoFactorSetupOpen && isMobile} onOpenChange={setTwoFactorSetupOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Set up Two-Factor Authentication</DrawerTitle>
          <DrawerDescription>
            Scan the QR code with your authenticator app, then enter the verification code below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 flex flex-col items-center justify-center py-4">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for 2FA" 
            className="w-48 h-48 mb-4 border rounded"
          />
          <p className="text-sm mb-4">Or enter this code manually: <code className="bg-muted p-1 rounded">JBSWY3DPEHPK3PXP</code></p>
          <Input
            id="verificationCode"
            placeholder="Enter 6-digit code"
            className="w-full"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
        </div>
        <DrawerFooter className="pt-2">
          <Button onClick={completeTwoFactorSetup}>Verify</Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={cancelTwoFactorSetup}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle>Security Settings</CardTitle>
        </div>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={changePassword}
              className="w-full sm:w-auto"
            >
              <Key className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-2">
              {twoFactor && <Shield className="h-5 w-5 text-green-500" />}
              <Switch 
                checked={twoFactor} 
                onCheckedChange={handleTwoFactorToggle}
              />
            </div>
          </div>
          {twoFactor && (
            <div className="mt-2 p-3 border rounded bg-green-50 dark:bg-green-950 text-sm flex gap-2 items-start">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-300">Two-factor authentication is enabled</p>
                <p className="text-green-700 dark:text-green-400">Your account is protected with an additional layer of security.</p>
              </div>
            </div>
          )}
          {!twoFactor && (
            <div className="mt-2 p-3 border rounded bg-amber-50 dark:bg-amber-950 text-sm flex gap-2 items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-300">Two-factor authentication is not enabled</p>
                <p className="text-amber-700 dark:text-amber-400">We strongly recommend enabling 2FA to enhance your account security.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Two-factor authentication setup UI */}
        {TwoFactorSetupDialog()}
        {TwoFactorSetupDrawer()}
      </CardContent>
    </Card>
  );
}
