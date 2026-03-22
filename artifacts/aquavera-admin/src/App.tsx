import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider, useRole } from "@/context/role-context";
import { LanguageProvider } from "@/context/language-context";

import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WaterRequests from "@/pages/water-requests";
import RequestDetail from "@/pages/request-detail";
import UserManagement from "@/pages/user-management";
import ActivityLogs from "@/pages/activity-logs";
import Settings from "@/pages/settings";
import RegisteredFarmers from "@/pages/registered-farmers";
import SurveyMap from "@/pages/survey-map";
import NotFound from "@/pages/not-found";

import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/signup";
import OTPVerification from "@/pages/auth/otp-verification";
import ForgotPassword from "@/pages/auth/forget-password";
import CompleteProfile from "@/pages/auth/complete-profile";
import FarmerDashboard from "@/pages/farmer-dashboard";
import LandSummary from "@/pages/farmer/land-summary";
import BillSummary from "@/pages/farmer/bill-summary";
import ProfileSummary from "@/pages/farmer/profile-summary";
import NewRequest from "@/pages/farmer/new-request";
import PaymentPage from "@/pages/farmer/payment";
import RequestActivity from "@/pages/farmer/request-activity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  const { user, role } = useRole();
  const [location] = useLocation();

  // Simple Auth Guard
  const isAuthPath = location.startsWith('/auth');
  const isPublicPath = location === '/' || isAuthPath;

  if (!user && !isPublicPath) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      
      {/* Admin/Sub-Admin Routes */}
      <Route path="/dashboard">
        {role === 'Farmer' ? <Redirect to="/dashboard/farmer" /> : <Dashboard />}
      </Route>
      <Route path="/requests" component={WaterRequests} />
      <Route path="/requests/new" component={NewRequest} />
      <Route path="/requests/:id" component={RequestDetail} />
      <Route path="/farmers" component={RegisteredFarmers} />
      <Route path="/survey-map" component={SurveyMap} />
      <Route path="/users" component={UserManagement} />
      <Route path="/logs" component={ActivityLogs} />
      <Route path="/settings" component={Settings} />
      
      {/* Farmer Specific Routes */}
      <Route path="/dashboard/farmer" component={FarmerDashboard} />
      <Route path="/land-summary" component={LandSummary} />
      <Route path="/bills" component={BillSummary} />
      <Route path="/profile" component={ProfileSummary} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/request-activity" component={RequestActivity} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={SignUp} />
      <Route path="/auth/otp" component={OTPVerification} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />
      <Route path="/auth/complete-profile" component={CompleteProfile} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RoleProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </RoleProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
