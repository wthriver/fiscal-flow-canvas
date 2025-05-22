
import React from "react";
import TimeTracking from "@/components/timetracking/TimeTracking";

const TimeTrackingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Time Tracking</h1>
      <TimeTracking />
    </div>
  );
};

export default TimeTrackingPage;
