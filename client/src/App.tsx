import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import Home from "@/pages/home";
import Recipes from "@/pages/recipes";
import RecipeDetail from "@/pages/recipe-detail";
import Workouts from "@/pages/workouts";
import Tracker from "@/pages/tracker";
import Goals from "@/pages/goals";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/workouts" component={Workouts} />
          <Route path="/tracker" component={Tracker} />
          <Route path="/goals" component={Goals} />
          <Route path="/admin" component={Admin} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
