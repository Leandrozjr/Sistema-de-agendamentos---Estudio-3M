import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { AnimatePresence } from "framer-motion";

// Use hash-based routing (/#/) to support opening index.html directly via file:// protocol
function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

// Note on theming:
// - Choose defaultTheme based on your design (light or dark background)
// - Update the color palette in index.css to match
// - If you want switchable themes, add `switchable` prop and use `useTheme` hook

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingScreen key="loader" onFinished={() => setTimeout(() => setLoading(false), 500)} />
            ) : (
              <div key="app-content" className="animate-in fade-in duration-700">
                <AppRouter />
              </div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
