import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, BarChart3, LogOut, Briefcase } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";

export default function Navbar() {
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const token = localStorage.getItem('token') || null;
  const loggedIn = !!token;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      api.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data.data.user))
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const profileInitials = user
    ? user.name.split(" ").map(n => n.charAt(0).toUpperCase()).join("")
    : "G";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-blue-900/30 shadow-2xl"
      style={{ background: 'hsl(220,20%,6%,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 group focus:outline-none">
            <div className="relative">
              <CheckSquare className="text-blue-500 w-7 h-7 transition-all group-hover:text-blue-400" />
              <div className="absolute inset-0 bg-blue-500/20 rounded blur-xl group-hover:bg-blue-500/30 transition-all" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-violet-300 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-violet-400 transition-all">
              TaskFlow
            </span>
          </button>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {loggedIn && user ? (
              <>
                {/* Quick nav links */}
                <button onClick={() => navigate('/dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-300 hover:text-white hover:bg-blue-900/40 rounded-lg transition-all">
                  <BarChart3 size={15} /> Dashboard
                </button>
                <button onClick={() => navigate('/projects')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-300 hover:text-white hover:bg-blue-900/40 rounded-lg transition-all">
                  <Briefcase size={15} /> Projects
                </button>

                {/* Avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white hover:bg-blue-700 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-lg" />
                      <span className="relative z-10">{profileInitials}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 backdrop-blur-xl border border-blue-800/40 text-white shadow-2xl rounded-2xl"
                    style={{ background: 'hsl(220,18%,8%)' }}
                    align="end"
                    forceMount>
                    <DropdownMenuLabel className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {profileInitials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user?.name}</p>
                          <p className="text-xs text-blue-400 mt-0.5">{user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-blue-800/30" />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}
                      className="hover:bg-blue-600/20 hover:text-blue-200 p-3 cursor-pointer rounded-lg mx-2 my-1 transition-all">
                      <BarChart3 className="mr-2 h-4 w-4 text-blue-400" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/projects')}
                      className="hover:bg-blue-600/20 hover:text-blue-200 p-3 cursor-pointer rounded-lg mx-2 my-1 transition-all">
                      <Briefcase className="mr-2 h-4 w-4 text-blue-400" /> Projects
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-800/30" />
                    <DropdownMenuItem onClick={handleLogout}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300 p-3 cursor-pointer rounded-lg mx-2 my-1 transition-all">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}
                  className="text-blue-300 hover:text-white hover:bg-blue-900/40 px-4 py-2 rounded-xl transition-all text-sm font-medium">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all font-semibold hover:scale-105 text-sm">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
