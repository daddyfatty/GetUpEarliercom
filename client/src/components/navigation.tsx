import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Menu, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import logoPath from "@assets/logo_1749324568864.png";

export function Navigation() {
  const [location] = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  const isAdmin = user?.email === "admin@getupear.lier.com";
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculatorItems = [
    { href: "/nutrition", label: "Food Tracker" },
    { href: "/calorie-calculator", label: "Calorie Calculator" },
  ];

  const navItems = [
    { href: "/coaching", label: "Coaching" },
    { href: "/recipes", label: "Recipes" },
    { href: "/workouts", label: "Workouts" },
    { href: "/blog", label: "Blog" },
    ...(isAuthenticated ? [{ href: "/profile", label: "Profile" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const aboutItems = [
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(loginForm.email);
      setIsLoginOpen(false);
      setLoginForm({ email: "", password: "" });
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
    } catch (error) {
      toast({ title: "Login failed", description: "Please check your credentials", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(registerForm.email);
      setIsRegisterOpen(false);
      setRegisterForm({ username: "", email: "", password: "" });
      toast({ title: "Account created!", description: "Welcome to Get Up Earlier!" });
    } catch (error) {
      toast({ title: "Registration failed", description: "Please try again", variant: "destructive" });
    }
  };

  return (
    <>
      {/* Desktop Header with Centered Logo */}
      <div className="hidden md:block bg-[hsl(var(--navy))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="Get Up Earlier" 
                className="h-24 w-auto max-w-[700px] object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav className={`bg-[hsl(var(--navy))] shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center h-28 transition-all duration-300 ${
            isScrolled ? 'md:h-20' : 'md:h-12'
          }`}>
            {/* Mobile Logo */}
            <div className="flex items-center md:hidden">
              <Link href="/">
                <img 
                  src={logoPath} 
                  alt="Get Up Earlier" 
                  className="h-24 w-auto max-w-[600px] object-contain"
                />
              </Link>
            </div>

            {/* Desktop Logo (appears when scrolled) */}
            <div className={`hidden md:flex items-center transition-all duration-300 ${
              isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <Link href="/">
                <img 
                  src={logoPath} 
                  alt="Get Up Earlier" 
                  className="h-20 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 max-w-4xl mx-auto">
              <div className="flex items-baseline justify-between w-full px-4 lg:px-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap ${
                        location === item.href
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                {/* Calculators Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className={`px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                        calculatorItems.some(item => location === item.href)
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      Calculators
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="bg-white border border-gray-200 shadow-lg">
                    {calculatorItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <span className="font-medium text-gray-900 hover:text-[hsl(var(--orange))] cursor-pointer w-full">
                            {item.label}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* About Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className={`px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                        aboutItems.some(item => location === item.href)
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      About
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="bg-white border border-gray-200 shadow-lg">
                    {aboutItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          <span className="font-medium text-gray-900 hover:text-[hsl(var(--orange))] cursor-pointer w-full">
                            {item.label}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <a 
                  href="https://www.facebook.com/groups/getupearlier" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                  title="Join Facebook Group"
                >
                  <SiFacebook className="h-5 w-5" />
                  <span className="text-xs font-medium hidden lg:inline">Group</span>
                </a>
                
                {isAuthenticated && (
                  <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                  </Button>
                )}

                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="hidden lg:inline">{user?.firstName || user?.email}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites">
                          <span className="h-4 w-4 mr-2">♥</span>
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/saved-results">
                          <span className="h-4 w-4 mr-2">📊</span>
                          Saved Results
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex space-x-2">
                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">
                          Sign In
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sign In</DialogTitle>
                          <DialogDescription>Enter your credentials to access your account</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div>
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                              id="login-email"
                              type="email"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                              id="login-password"
                              type="password"
                              value={loginForm.password}
                              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">Sign In</Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Link href="/coaching">
                      <Button size="sm" className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10 h-12 w-12">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <span
                          className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading ${
                            location === item.href
                              ? "text-[hsl(var(--orange))] bg-orange-50"
                              : "text-gray-900 hover:text-[hsl(var(--orange))]"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}

                    {/* Calculators Section for Mobile */}
                    <div className="border-t pt-4">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Calculators</div>
                      {calculatorItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <span
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading ${
                              location === item.href
                                ? "text-[hsl(var(--orange))] bg-orange-50"
                                : "text-gray-900 hover:text-[hsl(var(--orange))]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* About Section for Mobile */}
                    <div className="border-t pt-4">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">About</div>
                      {aboutItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <span
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading ${
                              location === item.href
                                ? "text-[hsl(var(--orange))] bg-orange-50"
                                : "text-gray-900 hover:text-[hsl(var(--orange))]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Facebook Group Link */}
                    <div className="pt-4 border-t">
                      <a 
                        href="https://www.facebook.com/groups/getupearlier" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-[hsl(var(--orange))] transition-colors"
                      >
                        <SiFacebook className="h-5 w-5 mr-3" />
                        Join Facebook Group
                      </a>
                    </div>

                    {isAuthenticated ? (
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-2 mb-4">
                          <User className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {user?.firstName || user?.email}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={logout}
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t space-y-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsLoginOpen(true)}
                          className="w-full"
                        >
                          Sign In
                        </Button>
                        <Link href="/coaching">
                          <Button 
                            className="w-full bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90"
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}