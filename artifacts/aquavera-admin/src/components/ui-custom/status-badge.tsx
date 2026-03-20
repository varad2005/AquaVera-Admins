import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: 'request' | 'geo' | 'user';
  className?: string;
}

export function StatusBadge({ status, type = 'request', className }: StatusBadgeProps) {
  let colorClass = "";

  if (type === 'request') {
    switch (status) {
      case 'Approved': colorClass = "bg-green-100 text-green-800 border-green-200"; break;
      case 'Pending': colorClass = "bg-amber-100 text-amber-800 border-amber-200"; break;
      case 'Flagged': colorClass = "bg-orange-100 text-orange-800 border-orange-200"; break;
      case 'Rejected': colorClass = "bg-red-100 text-red-800 border-red-200"; break;
      default: colorClass = "bg-slate-100 text-slate-800 border-slate-200";
    }
  } else if (type === 'geo') {
    switch (status) {
      case 'Valid': colorClass = "bg-blue-100 text-blue-800 border-blue-200"; break;
      case 'Invalid': colorClass = "bg-red-100 text-red-800 border-red-200"; break;
      case 'Pending': colorClass = "bg-slate-100 text-slate-800 border-slate-200"; break;
      default: colorClass = "bg-slate-100 text-slate-800 border-slate-200";
    }
  } else if (type === 'user') {
    switch (status) {
      case 'Active': colorClass = "bg-green-100 text-green-800 border-green-200"; break;
      case 'Inactive': colorClass = "bg-slate-100 text-slate-800 border-slate-200"; break;
      default: colorClass = "bg-slate-100 text-slate-800 border-slate-200";
    }
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border", colorClass, className)}>
      {status}
    </span>
  );
}
