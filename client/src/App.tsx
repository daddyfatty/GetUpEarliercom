import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { SiteFooter } from "@/components/site-footer";
import Home from "@/pages/home";
import Recipes from "@/pages/recipes";
import RecipeDetail from "@/pages/recipe-detail";
import RecipeArchive from "@/pages/recipe-archive";
import Workouts from "@/pages/workouts";
import WorkoutDetail from "@/pages/workout-detail";
import WorkoutVideo from "@/pages/workout-video";


import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import BlogEdit from "@/pages/blog-edit";
import CategoryPage from "@/pages/category";

import About from "@/pages/about";
import Services from "@/pages/services";
import PersonalStrengthTraining from "@/pages/personal-strength-training";
import VirtualNutritionCoaching from "@/pages/virtual-nutrition-coaching";
import AccountabilityCoaching from "@/pages/accountability-coaching";
import CertifiedRunningCoaching from "@/pages/certified-running-coaching";
import PrivateYoga from "@/pages/private-yoga";
import SmallGroupYoga from "@/pages/small-group-yoga";
import Contact from "@/pages/contact";
import TeamMichael from "@/pages/team-michael";
import TeamErica from "@/pages/team-erica";
import UserProfile from "@/pages/user-profile";
import Admin from "@/pages/admin";
import AdminFacebook from "@/pages/admin-facebook";
import AdminDashboard from "@/pages/admin-dashboard";
import Checkout from "@/pages/checkout";
import Subscribe from "@/pages/subscribe";
import CalorieCalculator from "@/pages/calorie-calculator-clean";
import AlcoholCalculatorPage from "@/pages/alcohol-calculator";
import Profile from "@/pages/profile";
import Favorites from "@/pages/favorites";
import SavedResults from "@/pages/saved-results";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/recipes/archive" component={RecipeArchive} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/workouts" component={Workouts} />
          <Route path="/workouts/:id" component={WorkoutDetail} />
          <Route path="/workouts/:id/video" component={WorkoutVideo} />

          <Route path="/calorie-calculator" component={CalorieCalculator} />
          <Route path="/alcohol-calculator" component={AlcoholCalculatorPage} />

          <Route path="/blog" component={Blog} />
          {/* Edit route only available in development */}
          {import.meta.env.DEV && <Route path="/blog/:slug/edit" component={BlogEdit} />}
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/category/:category" component={CategoryPage} />

          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/services/personal-strength-training" component={PersonalStrengthTraining} />
        <Route path="/services/virtual-nutrition-coaching" component={VirtualNutritionCoaching} />
        <Route path="/services/accountability-coaching" component={AccountabilityCoaching} />
        <Route path="/services/certified-running-coaching" component={CertifiedRunningCoaching} />
        <Route path="/services/private-yoga" component={PrivateYoga} />
        <Route path="/services/small-group-yoga" component={SmallGroupYoga} />
          <Route path="/contact" component={Contact} />
          <Route path="/team/michael" component={TeamMichael} />
          <Route path="/team/erica" component={TeamErica} />
          <Route path="/profile" component={Profile} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/saved-results" component={SavedResults} />
          <Route path="/user-profile" component={UserProfile} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/facebook" component={AdminFacebook} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <SiteFooter />
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
