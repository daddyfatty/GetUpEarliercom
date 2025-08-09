import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Menu, Bell, User, LogOut, ChevronDown, ChevronRight, Mail } from "lucide-react";
import { SiFacebook, SiYoutube } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import logoPath from "@assets/AI-Wintrer-Runner5_1754078126180.png";

export function Navigation() {
  const [location] = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBlogDropdownOpen, setIsBlogDropdownOpen] = useState(false);
  const { user, isAuthenticated, login, logout } = useAuth();
  const isAdmin = user?.email === "admin@getupear.lier.com";
  const { toast } = useToast();
  
  // Fetch top categories for blog dropdown
  const { data: topCategories = [] } = useQuery({
    queryKey: ['/api/blog/categories/top'],
    queryFn: async () => {
      const response = await fetch('/api/blog/categories/top?limit=10');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const calculatorItems = [
    { href: "/calorie-calculator", label: "Calorie Calculator" },
    { href: "/alcohol-calculator", label: "Alcohol Weight Gain Calculator" },
  ];

  const navItems = [
    { href: "/services", label: "1-on-1 Services" },
    { href: "/blog", label: "Blog" },
    { href: "/recipes", label: "Recipes", beta: true },
    { href: "/workouts", label: "Workouts & Challenges", beta: true },
    { href: "/amazon", label: "Our Picks", icon: "amazon" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const aboutItems = [
    { href: "/about", label: "About" },
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
      {/* Desktop Header with Logo Left, Icons Right */}
      <div className="hidden md:block bg-[hsl(var(--navy))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="Get Up Earlier" 
                className="h-16 w-auto max-w-[400px] object-contain"
              />
            </Link>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.youtube.com/@getupearlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="YouTube Channel"
              >
                <SiYoutube className="h-5 w-5" />
                <span className="text-sm font-medium">63k</span>
              </a>
              
              <a 
                href="https://www.facebook.com/groups/getupearlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="Join Facebook Group"
              >
                <SiFacebook className="h-5 w-5" />
                <span className="text-sm font-medium">Group</span>
              </a>
              
              <Link 
                href="/amazon"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="Our Picks"
              >
                <img 
                  src="/attached_assets/aonly_1753878383025.png" 
                  alt="Amazon" 
                  className="h-5 w-auto object-contain"
                />
                <span className="text-sm font-medium">Picks</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <nav className={`bg-[hsl(var(--navy))] shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Navigation Container */}
          <div className="md:hidden">
            {/* Top row: Logo and Hamburger */}
            <div className="flex justify-between items-center h-20">
              <Link href="/">
                <img 
                  src={logoPath} 
                  alt="Get Up Earlier" 
                  className="h-16 w-auto max-w-[280px] object-contain"
                />
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10"
                onClick={toggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Bottom row: Social Icons */}
            <div className="flex justify-center items-center space-x-6 pb-3">
              <a 
                href="https://www.youtube.com/@getupearlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="YouTube Channel"
              >
                <SiYoutube className="h-4 w-4" />
                <span className="text-xs font-medium">63k</span>
              </a>
              
              <a 
                href="https://www.facebook.com/groups/getupearlier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="Join Facebook Group"
              >
                <SiFacebook className="h-4 w-4" />
                <span className="text-xs font-medium">Group</span>
              </a>
              
              <Link 
                href="/amazon"
                className="text-white hover:text-[hsl(var(--orange))] transition-colors flex items-center space-x-1"
                title="Our Picks"
              >
                <img 
                  src="/attached_assets/aonly_1753878383025.png" 
                  alt="Amazon" 
                  className="h-4 w-auto object-contain"
                />
                <span className="text-xs font-medium">Picks</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex justify-between items-center h-28 transition-all duration-300 ${
            isScrolled ? 'md:h-20' : 'md:h-12'
          }`}>


            {/* Desktop Navigation Menu */}
            <div className="flex items-center justify-center flex-1">
              <div className="flex items-center justify-center space-x-3 lg:space-x-4">
                {/* 1-on-1 Services */}
                <Link href="/services">
                  <span
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location === "/services"
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                  >
                    1-on-1 Services
                  </span>
                </Link>
                
                {/* About */}
                <Link href="/about">
                  <span
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location === "/about"
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                  >
                    About
                  </span>
                </Link>
                
                {/* Blog with Dropdown */}
                <div className="relative group">
                  <div
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location.startsWith("/blog") || location.startsWith("/category")
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                    onClick={() => window.location.href = '/blog'}
                  >
                    Blog
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="absolute top-full left-0 -mt-[1px] pt-[1px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                    <div className="bg-gradient-to-br from-white via-blue-50 to-sky-100 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-lg border-2 border-blue-300 dark:border-gray-700 mt-1 min-w-[620px] overflow-hidden">
                      <Link href="/blog" className="block relative overflow-hidden group/all">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/all:translate-x-full transition-transform duration-500"></div>
                        <div className="relative px-6 py-5 flex items-center justify-between group-hover/all:translate-x-1 transition-transform">
                          <span className="font-bold text-white text-lg flex items-center">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                            </svg>
                            View All Blog Posts
                          </span>
                          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        </div>
                      </Link>
                      {topCategories.length > 0 && (
                        <>
                          <div className="px-6 py-3 bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-800/50 border-b border-blue-200/50 dark:border-gray-700">
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center">
                              <span className="mr-2">✨</span> Top Categories
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-10 gap-y-2 px-6 py-5 bg-gradient-to-br from-white via-sky-50/30 to-blue-50/30 dark:from-gray-900/50 dark:to-gray-800/50">
                            {topCategories.map((category: { name: string; count: number }) => (
                              <Link 
                                key={category.name} 
                                href={`/category/${encodeURIComponent(category.name.toLowerCase())}`} 
                                className="group/item flex items-center justify-between py-3 px-4 rounded-lg bg-white/60 dark:bg-gray-800/30 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-700/50 transition-all hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-blue-200 dark:hover:border-gray-600"
                              >
                                <span className="capitalize text-sm font-bold text-gray-800 dark:text-gray-300 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400 whitespace-nowrap">
                                  {category.name.replace(/-/g, ' ')}
                                </span>
                                <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-3 py-1.5 rounded-full ml-4 shadow-md">
                                  {category.count}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Recipes */}
                <Link href="/recipes">
                  <span
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location === "/recipes"
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                  >
                    Recipes
                    <span className="ml-1 text-[8px] bg-gray-500/50 text-gray-200 px-1 py-0 rounded font-normal">
                      beta
                    </span>
                  </span>
                </Link>
                
                {/* Workouts & Challenges */}
                <Link href="/workouts">
                  <span
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location === "/workouts"
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                  >
                    Workouts & Challenges
                    <span className="ml-1 text-[8px] bg-gray-500/50 text-gray-200 px-1 py-0 rounded font-normal">
                      beta
                    </span>
                  </span>
                </Link>
                

                
                {/* Calculators Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                        calculatorItems.some(item => location === item.href)
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      Calculators
                      <span className="ml-1 text-[8px] bg-gray-500/50 text-gray-200 px-1 py-0 rounded font-normal">
                        beta
                      </span>
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
                
                {/* Admin (if applicable) */}
                {isAdmin && (
                  <Link href="/admin">
                    <span
                      className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                        location === "/admin"
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      Admin
                    </span>
                  </Link>
                )}
                
                {/* Contact - Email Icon */}
                <Link href="/contact">
                  <span
                    className={`px-2 py-2 rounded-md text-sm lg:text-base font-medium transition-colors cursor-pointer uppercase font-heading whitespace-nowrap flex items-center ${
                      location === "/contact"
                        ? "text-[hsl(var(--orange))] bg-white/10"
                        : "text-white hover:text-[hsl(var(--orange))]"
                    }`}
                    title="Contact Us"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contact
                  </span>
                </Link>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                {/* TEMPORARILY HIDDEN - Bell notification and user profile section */}
                {/* {isAuthenticated && (
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
                ) : ( */}
                {false && (
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

                    <Link href="/services">
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
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10 h-28 w-28 p-2 flex flex-col items-center justify-center gap-1">
                    <Menu className="h-20 w-20" strokeWidth={4} />
                    <span className="text-xs font-semibold tracking-wider">MENU</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    
                    {/* User Profile Section - HIDDEN FOR NOW */}
                    {false && isAuthenticated && (
                      <div className="border-b pb-4 mb-4">
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <div className="w-10 h-10 bg-[hsl(var(--orange))] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user?.firstName || "Michael"}
                            </div>
                            <div className="text-sm text-gray-500">My Profile</div>
                          </div>
                        </div>
                        <div className="space-y-1 mt-3">
                          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="block px-3 py-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] hover:bg-orange-50 rounded-md cursor-pointer">
                              <User className="inline h-4 w-4 mr-2" />
                              My Profile
                            </span>
                          </Link>
                          <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="block px-3 py-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] hover:bg-orange-50 rounded-md cursor-pointer">
                              <span className="inline-block w-4 h-4 mr-2 text-center">♥</span>
                              Favorites
                            </span>
                          </Link>
                          <Link href="/saved-results" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="block px-3 py-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] hover:bg-orange-50 rounded-md cursor-pointer">
                              <span className="inline-block w-4 h-4 mr-2 text-center">📊</span>
                              Saved Results
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Main Navigation */}
                    {/* 1-on-1 Services */}
                    <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center ${
                          location === "/services"
                            ? "text-[hsl(var(--orange))] bg-orange-50"
                            : "text-gray-900 hover:text-[hsl(var(--orange))]"
                        }`}
                      >
                        1-on-1 Services
                      </span>
                    </Link>
                    
                    {/* About */}
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center ${
                          location === "/about"
                            ? "text-[hsl(var(--orange))] bg-orange-50"
                            : "text-gray-900 hover:text-[hsl(var(--orange))]"
                        }`}
                      >
                        About
                      </span>
                    </Link>
                    
                    {/* Blog with Categories */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-left">
                        <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                          <span
                            className={`block text-base font-medium transition-colors cursor-pointer uppercase font-heading ${
                              location.startsWith("/blog") || location.startsWith("/category")
                                ? "text-[hsl(var(--orange))]"
                                : "text-gray-900 hover:text-[hsl(var(--orange))]"
                            }`}
                          >
                            Blog
                          </span>
                        </Link>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-2">
                        <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="block px-6 py-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] hover:bg-orange-50 rounded-md cursor-pointer">
                            All Posts
                          </span>
                        </Link>
                        {topCategories.length > 0 && (
                          <>
                            <div className="px-6 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Top Categories
                            </div>
                            {topCategories.map((category: { name: string; count: number }) => (
                              <Link 
                                key={category.name} 
                                href={`/category/${encodeURIComponent(category.name.toLowerCase())}`} 
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="block px-6 py-2 text-sm text-gray-600 hover:text-[hsl(var(--orange))] hover:bg-orange-50 rounded-md cursor-pointer">
                                  <div className="flex justify-between items-center">
                                    <span className="capitalize">{category.name.replace(/-/g, ' ')}</span>
                                    <span className="text-xs text-gray-400">({category.count})</span>
                                  </div>
                                </span>
                              </Link>
                            ))}
                          </>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    {/* Recipes */}
                    <Link href="/recipes" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center ${
                          location === "/recipes"
                            ? "text-[hsl(var(--orange))] bg-orange-50"
                            : "text-gray-900 hover:text-[hsl(var(--orange))]"
                        }`}
                      >
                        Recipes
                        <span className="ml-2 text-[8px] bg-gray-500/50 text-gray-600 px-1 py-0 rounded font-normal">
                          beta
                        </span>
                      </span>
                    </Link>
                    
                    {/* Workouts */}
                    <Link href="/workouts" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center ${
                          location === "/workouts"
                            ? "text-[hsl(var(--orange))] bg-orange-50"
                            : "text-gray-900 hover:text-[hsl(var(--orange))]"
                        }`}
                      >
                        Workouts & Challenges
                        <span className="ml-2 text-[8px] bg-gray-500/50 text-gray-600 px-1 py-0 rounded font-normal">
                          beta
                        </span>
                      </span>
                    </Link>
                    

                    
                    {/* Admin (if applicable) */}
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <span
                          className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center ${
                            location === "/admin"
                              ? "text-[hsl(var(--orange))] bg-orange-50"
                              : "text-gray-900 hover:text-[hsl(var(--orange))]"
                          }`}
                        >
                          Admin
                        </span>
                      </Link>
                    )}

                    {/* Calculators Collapsible Section */}
                    <Collapsible open={isCalculatorsOpen} onOpenChange={setIsCalculatorsOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-left border-t pt-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                          Calculators
                          <span className="ml-2 text-[8px] bg-gray-500/50 text-gray-600 px-1 py-0 rounded font-normal">
                            beta
                          </span>
                        </span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isCalculatorsOpen ? 'rotate-90' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-2">
                        {calculatorItems.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <span
                              className={`block px-6 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading ${
                                location === item.href
                                  ? "text-[hsl(var(--orange))] bg-orange-50"
                                  : "text-gray-600 hover:text-[hsl(var(--orange))]"
                              }`}
                            >
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Contact with Email Icon */}
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer uppercase font-heading flex items-center border-t pt-4 ${
                          location === "/contact"
                            ? "text-[hsl(var(--orange))] bg-orange-50"
                            : "text-gray-900 hover:text-[hsl(var(--orange))]"
                        }`}
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Contact
                      </span>
                    </Link>



                    {/* Auth Section for Mobile - HIDDEN FOR NOW */}
                    {false && (
                    <div className="pt-4 border-t">
                      {isAuthenticated ? (
                        <Button 
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline" 
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
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
                                  <Label htmlFor="mobile-login-email">Email</Label>
                                  <Input
                                    id="mobile-login-email"
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="mobile-login-password">Password</Label>
                                  <Input
                                    id="mobile-login-password"
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
                          
                          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      )}
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