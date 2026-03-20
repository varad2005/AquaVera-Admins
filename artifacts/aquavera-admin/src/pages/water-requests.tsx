import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { useRequests } from "@/hooks/use-mock-api";
import { WaterRequest } from "@/data/mock-data";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { Search, Filter, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WaterRequests() {
  const { data: requests, isLoading } = useRequests();
  const { toast } = useToast();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1] || "");
  const initialSearch = queryParams.get('q') || "";

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRequests = requests?.filter((req: WaterRequest) => {
    if (filterStatus !== "All" && req.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.id.toLowerCase().includes(query) ||
        req.farmerName.toLowerCase().includes(query) ||
        req.village.toLowerCase().includes(query) ||
        req.district.toLowerCase().includes(query) ||
        req.cropType.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredRequests?.length || 0) / itemsPerPage);
  const paginatedRequests = filteredRequests?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Water Requests</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and verify irrigation allocations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search ID, Farmer..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 w-64 bg-card border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button 
            onClick={() => toast({ title: "Filters", description: "Advanced filtering modal coming soon!" })}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col h-[calc(100vh-220px)]">
        <div className="border-b border-border bg-muted/30 p-3 flex gap-2 overflow-x-auto">
          {['All', 'Pending', 'Flagged', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filterStatus === status 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Request ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Farmer & Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Crop Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Geo-Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">Loading requests data...</td>
                </tr>
              ) : paginatedRequests?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No requests found matching criteria.</td>
                </tr>
              ) : (
                paginatedRequests?.map((req: WaterRequest) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-foreground">{req.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{req.farmerName}</p>
                      <p className="text-xs text-muted-foreground">{req.village}, {req.district}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-foreground">{req.cropType}</p>
                      <p className="text-xs text-muted-foreground">{req.durationHours} hrs requested</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={req.geoStatus} type="geo" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(req.timestamp), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link 
                        href={`/requests/${req.id}`}
                        className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Review Request"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-border p-4 flex items-center justify-between bg-card">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{paginatedRequests?.length || 0}</span> of <span className="font-medium text-foreground">{filteredRequests?.length || 0}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-border rounded-md text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground px-2">Page {currentPage} of {totalPages || 1}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
