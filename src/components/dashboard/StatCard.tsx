
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  percentageChange?: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  percentageChange,
  icon,
  className,
}) => {
  const showPercentage = percentageChange !== undefined;
  const isPositive = showPercentage && percentageChange >= 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || showPercentage) && (
          <div className="flex items-center mt-1">
            {showPercentage && (
              <div
                className={cn(
                  "flex items-center text-xs mr-2",
                  isPositive ? "text-finance-green-600" : "text-finance-red-600"
                )}
              >
                {isPositive ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                <span>{Math.abs(percentageChange)}%</span>
              </div>
            )}
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
