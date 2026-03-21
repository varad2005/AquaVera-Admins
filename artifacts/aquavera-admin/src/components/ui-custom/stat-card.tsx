import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-3xl border border-border p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        {trend && (
          <span className={cn(
            "text-sm font-medium flex items-center",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
