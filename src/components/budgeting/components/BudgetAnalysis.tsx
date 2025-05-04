
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BarChart } from "@/components/ui/bar-chart";

interface ChartData {
  name: string;
  budgeted: number;
  actual: number;
}

interface BudgetAnalysisProps {
  chartData: ChartData[];
}

export const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ chartData }) => {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <BarChart 
              data={chartData}
              xField="name"
              yField={["budgeted", "actual"]}
              colors={["#94a3b8", "#3b82f6"]}
              category="name"
            />
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
              <span className="text-sm">Budgeted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Actual</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-4">
        <Button 
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={() => toast.info("Generating detailed report...")}
        >
          <FileText size={16} />
          <span>Generate Detailed Report</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
