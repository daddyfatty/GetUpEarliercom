import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Menu, Bell, User, LogOut } from "lucide-react";
import logoPath from "@assets/getupeariler_logo.png";

export function Navigation() {
  const [location] = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const { user, isAuthenticated, isAdmin, login, register, logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { href: "/recipes", label: "Recipes" },
    { href: "/workouts", label: "Workouts" },
    { href: "/tracker", label: "Tracker" },
    { href: "/goals", label: "Goals" },
    { href: "/subscribe", label: "Subscribe" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      setIsLoginOpen(false);
      setLoginForm({ email: "", password: "" });
      toast({ title: "Welcome back!" });
    } catch (error) {
      toast({ title: "Login failed", description: "Please check your credentials", variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerForm.username, registerForm.email, registerForm.password);
      setIsRegisterOpen(false);
      setRegisterForm({ username: "", email: "", password: "" });
      toast({ title: "Account created successfully!" });
    } catch (error) {
      toast({ title: "Registration failed", description: "Please try again", variant: "destructive" });
    }
  };

  return (
    <nav className="bg-[hsl(var(--navy))] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="Get Up Earlier" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        location === item.href
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin">
                    <span
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        location === "/admin"
                          ? "text-[hsl(var(--orange))] bg-white/10"
                          : "text-white hover:text-[hsl(var(--orange))]"
                      }`}
                    >
                      Admin
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">
                  <Bell className="w-4 h-4" />
                </Button>
              )}
              
              {!isAuthenticated ? (
                <>
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">Login</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Login to Your Account</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button type="submit" className="w-full">Login</Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsLoginOpen(false);
                              setIsRegisterOpen(true);
                            }}
                          >
                            Don't have an account? Sign up
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white">Sign Up</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Your Account</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={registerForm.username}
                            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                            placeholder="Choose a username"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            placeholder="Create a password"
                            required
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button type="submit" className="w-full">Create Account</Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsRegisterOpen(false);
                              setIsLoginOpen(true);
                            }}
                          >
                            Already have an account? Login
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <Button className="bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90 text-white">
                    Upgrade to Pro
                  </Button>
                  <Button variant="ghost" onClick={logout} className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    {user?.username}
                    <LogOut className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={`block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                          location === item.href
                            ? "text-primary bg-primary/10"
                            : "text-gray-900 hover:text-primary dark:text-gray-100 dark:hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link href="/admin">
                      <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary dark:text-gray-100 dark:hover:text-primary cursor-pointer">
                        Admin
                      </span>
                    </Link>
                  )}
                  
                  <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                    {!isAuthenticated ? (
                      <div className="space-y-2">
                        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">Login</Button>
                          </DialogTrigger>
                        </Dialog>
                        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Upgrade to Pro
                        </Button>
                        <Button variant="outline" onClick={logout} className="w-full">
                          Logout ({user?.username})
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
