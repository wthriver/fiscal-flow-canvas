
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Play, Square, Pause, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  clockIn: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  overtimeHours: number;
  status: 'clocked-in' | 'on-break' | 'clocked-out';
  date: string;
}

export const TimeClockSystem: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      employeeId: 'emp1',
      employeeName: 'John Smith',
      clockIn: '2024-06-11T08:00:00',
      totalHours: 8.5,
      overtimeHours: 0.5,
      status: 'clocked-out',
      date: '2024-06-11',
      clockOut: '2024-06-11T17:30:00'
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState('emp1');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const clockIn = () => {
    const now = new Date().toISOString();
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeId: selectedEmployee,
      employeeName: 'John Smith',
      clockIn: now,
      totalHours: 0,
      overtimeHours: 0,
      status: 'clocked-in',
      date: new Date().toISOString().split('T')[0]
    };

    setTimeEntries([...timeEntries, newEntry]);
    toast.success("Clocked in successfully");
  };

  const clockOut = () => {
    const now = new Date().toISOString();
    setTimeEntries(timeEntries.map(entry => {
      if (entry.employeeId === selectedEmployee && entry.status === 'clocked-in') {
        const clockInTime = new Date(entry.clockIn);
        const clockOutTime = new Date(now);
        const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        const overtimeHours = Math.max(0, totalHours - 8);

        return {
          ...entry,
          clockOut: now,
          totalHours: Math.round(totalHours * 100) / 100,
          overtimeHours: Math.round(overtimeHours * 100) / 100,
          status: 'clocked-out' as const
        };
      }
      return entry;
    }));
    toast.success("Clocked out successfully");
  };

  const startBreak = () => {
    const now = new Date().toISOString();
    setTimeEntries(timeEntries.map(entry => {
      if (entry.employeeId === selectedEmployee && entry.status === 'clocked-in') {
        return {
          ...entry,
          breakStart: now,
          status: 'on-break' as const
        };
      }
      return entry;
    }));
    toast.success("Break started");
  };

  const endBreak = () => {
    const now = new Date().toISOString();
    setTimeEntries(timeEntries.map(entry => {
      if (entry.employeeId === selectedEmployee && entry.status === 'on-break') {
        return {
          ...entry,
          breakEnd: now,
          status: 'clocked-in' as const
        };
      }
      return entry;
    }));
    toast.success("Break ended");
  };

  const getCurrentEntry = () => {
    return timeEntries.find(entry => 
      entry.employeeId === selectedEmployee && 
      (entry.status === 'clocked-in' || entry.status === 'on-break')
    );
  };

  const currentEntry = getCurrentEntry();
  const todayEntries = timeEntries.filter(entry => 
    entry.date === new Date().toISOString().split('T')[0]
  );

  const getTotalHoursToday = () => {
    return todayEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  };

  const getTotalOvertimeToday = () => {
    return todayEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'clocked-in': { variant: 'default' as const, label: 'Clocked In' },
      'on-break': { variant: 'secondary' as const, label: 'On Break' },
      'clocked-out': { variant: 'outline' as const, label: 'Clocked Out' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Time Clock System</h2>
          <p className="text-muted-foreground">Employee time tracking with punch in/out and break management</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Hours Today</p>
                <p className="text-2xl font-bold">{getTotalHoursToday().toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overtime Today</p>
                <p className="text-2xl font-bold">{getTotalOvertimeToday().toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Clocked In</p>
                <p className="text-2xl font-bold">
                  {timeEntries.filter(e => e.status === 'clocked-in').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">On Break</p>
                <p className="text-2xl font-bold">
                  {timeEntries.filter(e => e.status === 'on-break').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Clock Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Status</h3>
              {currentEntry ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    {getStatusBadge(currentEntry.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clock In Time:</span>
                    <span className="font-mono">
                      {new Date(currentEntry.clockIn).toLocaleTimeString()}
                    </span>
                  </div>
                  {currentEntry.breakStart && (
                    <div className="flex justify-between items-center">
                      <span>Break Start:</span>
                      <span className="font-mono">
                        {new Date(currentEntry.breakStart).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Not currently clocked in</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {!currentEntry && (
                  <Button onClick={clockIn} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Clock In
                  </Button>
                )}
                
                {currentEntry && currentEntry.status === 'clocked-in' && (
                  <>
                    <Button onClick={clockOut} variant="destructive" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Clock Out
                    </Button>
                    <Button onClick={startBreak} variant="outline" className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Start Break
                    </Button>
                  </>
                )}
                
                {currentEntry && currentEntry.status === 'on-break' && (
                  <>
                    <Button onClick={clockOut} variant="destructive" className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Clock Out
                    </Button>
                    <Button onClick={endBreak} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      End Break
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.employeeName}</TableCell>
                  <TableCell>{new Date(entry.clockIn).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    {entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>{entry.totalHours.toFixed(1)}h</TableCell>
                  <TableCell>{entry.overtimeHours.toFixed(1)}h</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
