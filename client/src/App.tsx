import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PartyDetail from "./pages/PartyDetail";
import BecomeHost from "./pages/BecomeHost";
import CreateParty from "./pages/CreateParty";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ChangePassword from "./pages/ChangePassword";
import AllParties from "./pages/AllParties";
import HostDashboard from "./pages/HostDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HostApprovals from "./pages/HostApprovals";
import UserProfile from "./pages/UserProfile";
import HostRejected from "./pages/HostRejected";
import { useEffect } from "react";
import { getParties, saveParty } from "./lib/storage";
import { initialParties } from "./lib/initialParties";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/party/:id" component={PartyDetail} />
      <Route path="/become-host" component={BecomeHost} />
      <Route path="/create-party" component={CreateParty} />
      <Route path="/all-parties" component={AllParties} />
      <Route path="/host/dashboard" component={HostDashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/change-password" component={ChangePassword} />
      <Route path="/admin/host-approvals" component={HostApprovals} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/host/rejected" component={HostRejected} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Load initial parties on first visit
  useEffect(() => {
    const parties = getParties();
    if (parties.length === 0) {
      initialParties.forEach(party => saveParty(party));
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
