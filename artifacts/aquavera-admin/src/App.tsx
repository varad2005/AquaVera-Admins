import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/context/role-context";
import { LanguageProvider } from "@/context/language-context";

import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import WaterRequests from "@/pages/water-requests";
import RequestDetail from "@/pages/request-detail";
import UserManagement from "@/pages/user-management";
import ActivityLogs from "@/pages/activity-logs";
import Settings from "@/pages/settings";
import RegisteredFarmers from "@/pages/registered-farmers";
import NotFound from "@/pages/not-found";

import Login from "@/pages/auth/login";
import SignUp from "@/pages/auth/signup";
import OTPVerification from "@/pages/auth/otp-verification";
import ForgotPassword from "@/pages/auth/forget-password";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/requests" component={WaterRequests} />
      <Route path="/requests/:id" component={RequestDetail} />
      <Route path="/farmers" component={RegisteredFarmers} />
      <Route path="/users" component={UserManagement} />
      <Route path="/logs" component={ActivityLogs} />
      <Route path="/settings" component={Settings} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={SignUp} />
      <Route path="/auth/otp" component={OTPVerification} />
      <Route path="/auth/forgot-password" component={ForgotPassword} />

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
