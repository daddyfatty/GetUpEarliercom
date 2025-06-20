import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, User, Bell, ChevronDown, LogIn, UserPlus, Search } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import logoPath from "@assets/getupeariler_logo.png";

const navItems = [
  { href: "/recipes", label: "Recipes" },
  { href: "/workouts", label: "Workouts" },
  { href: "/services", label: "1-on-1 Services" },
  { href: "/blog", label: "Blog" },
];

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`bg-[hsl(var(--navy))] shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Desktop Navigation - Full Width Layout */}
            <div className="hidden md:flex items-center justify-between w-full">
              {/* Left side: Logo (when scrolled) and Nav Items */}
              <div className="flex items-center space-x-8">
                <div className={`flex items-center transition-all duration-300 ${
                  isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  <Link href="/">
                    <img 
                      src={logoPath} 
                      alt="Get Up Earlier" 
                      className="h-16 w-auto object-contain"
                    />
                  </Link>
                </div>
                
                <div className="flex items-baseline space-x-6 lg:space-x-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer uppercase font-heading ${
                          location === item.href
                            ? "text-[hsl(var(--orange))] bg-white/10"
                            : "text-white hover:text-[hsl(var(--orange))] hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Right side: Actions */}
              <div className="flex items-center space-x-4">
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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="w-full">
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <a href="/api/logout" className="w-full">
                          Logout
                        </a>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--orange))] hover:bg-white/10">
                          <Search className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Search</DialogTitle>
                          <DialogDescription>
                            Search for recipes, workouts, or blog posts
                          </DialogDescription>
                        </DialogHeader>
                        <form className="flex items-center space-x-2">
                          <Input 
                            type="text" 
                            placeholder="What are you looking for?"
                            className="flex-1"
                          />
                          <Button type="submit">Search</Button>
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
                    
                    <div className="border-t pt-4 mt-6">
                      <a 
                        href="https://www.facebook.com/groups/getupearlier" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 text-gray-900 hover:text-[hsl(var(--orange))] transition-colors"
                      >
                        <SiFacebook className="h-5 w-5" />
                        <span>Join Facebook Group</span>
                      </a>
                      
                      {isAuthenticated ? (
                        <div className="space-y-2 mt-4">
                          <Link href="/profile">
                            <span className="block px-3 py-2 text-gray-900 hover:text-[hsl(var(--orange))] transition-colors">
                              Profile
                            </span>
                          </Link>
                          <Link href="/settings">
                            <span className="block px-3 py-2 text-gray-900 hover:text-[hsl(var(--orange))] transition-colors">
                              Settings
                            </span>
                          </Link>
                          <a href="/api/logout" className="block px-3 py-2 text-gray-900 hover:text-[hsl(var(--orange))] transition-colors">
                            Logout
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-2 mt-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full justify-start text-gray-900 hover:text-[hsl(var(--orange))]"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                          <Link href="/services">
                            <Button className="w-full bg-[hsl(var(--orange))] hover:bg-[hsl(var(--orange))]/90">
                              Sign Up
                            </Button>
                          </Link>
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
    </>
  );
}