import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../../components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { BarChart3, BookOpen, ClipboardCheck, Compass, FileCheck, Hotel, LogOut, Mountain, Settings, Store, TicketCheck, User, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../Auth/UserAuth.js';
import { toast } from 'sonner';

export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar pathname={pathname} />
        <SidebarInset className="bg-muted/40">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Adventure Booking Admin</h1>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
          <main className="lg:w-[83vw] w-full flex-1  overflow-y-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AdminSidebar({ pathname }) {

  const dispatch = useDispatch();
  // read current user from redux store
  const user = useSelector((state) => state.user?.user);
  // admin roles come from the user object under `admin.adminRole` in this app
  const roles = Array.isArray(user?.admin?.adminRole) ? user.admin.adminRole : [];

  // If roles array is empty, treat as super-admin and allow access to all tabs
  const isSuperAdmin = roles.length === 0;

  // map logical tabs to allowed roles
  const roleAccess = {
    Dashboard: [], // visible to all admin types (handled separately)
    Locations: [], // general
    Adventures: ['Instructor'],
    Bookings: ['Hotel', 'Instructor'],
    Admins: ['Admin'], // only visible to super-admins by default
    Users: ['User'],
    Instructor: ['Instructor'],
    Stores: [],
    Hotels: ['Hotel'],
    Events: [],
    'Achievement Rules': [],
    'Tickets & Support': ['User'],
    'Terms & Condition': [],
    'User Declaration': [],
    'Website Settings': [],
    Sponsors: [],
  };

  const canSee = (tabKey) => {
    if (isSuperAdmin) return true;
    const allowed = roleAccess[tabKey];
    if (!allowed || allowed.length === 0) return true; // default allow if not restricted
    return roles.some((r) => allowed.includes(r));
  };
  const handleLogout = async () => {
    await userLogout(dispatch).then(() => {
      window.location.reload();
    }).catch((error) => {
      toast.error("Logout failed. Please try again.");
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center justify-center border-b px-6">
        <div className="flex items-center justify-center gap-2 font-semibold">
          <Mountain className="h-6 w-6" />
          <span>Adventure Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                  <Link to="/admin">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other sidebar groups with Link components instead of <a> tags */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {canSee('Locations') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/locations"}>
                    <Link to="/admin/locations">
                      <Compass className="h-4 w-4" />
                      <span>Locations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Adventures') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/adventures"}>
                    <Link to="/admin/adventures">
                      <Compass className="h-4 w-4" />
                      <span>Adventures</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Bookings') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/bookings"}>
                    <Link to="/admin/bookings">
                      <BookOpen className="h-4 w-4" />
                      <span>Bookings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Admins') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/manager"}>
                    <Link to="/admin/manager">
                      <User className="h-4 w-4" />
                      <span>Admins</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Users') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/users"}>
                    <Link to="/admin/users">
                      <User className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Instructor') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/instructors"}>
                    <Link to="/admin/instructors">
                      <User className="h-4 w-4" />
                      <span>Instructor</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Stores') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/store"}>
                    <Link to="/admin/store">
                      <Store className="h-4 w-4" />
                      <span>Stores</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Hotels') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/hotels"}>
                    <Link to="/admin/hotels">
                      <Hotel className="h-4 w-4" />
                      <span>Hotels</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Events') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/events"}>
                    <Link to="/admin/events">
                      <Hotel className="h-4 w-4" />
                      <span>Events</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Achievement Rules') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/achievement-rules"}>
                    <Link to="/admin/achievement-rules">
                      <Award className="h-4 w-4" />
                      <span>Achievement Rules</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Tickets & Support') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/tickets"}>
                    <Link to="/admin/tickets">
                      <TicketCheck className="h-4 w-4" />
                      <span>Tickets & Support</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Terms & Condition') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/terms"}>
                    <Link to="/admin/terms">
                      <FileCheck className="h-4 w-4" />
                      <span>Terms & Condition</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('User Declaration') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/declaration"}>
                    <Link to="/admin/declaration">
                      <ClipboardCheck className="h-4 w-4" />
                      <span>User Declaration</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Website Settings') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/website-settings"}>
                    <Link to="/admin/website-settings">
                      <Settings className="h-4 w-4" />
                      <span>Website Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canSee('Sponsors') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/sponsors"}>
                    <Link to="/admin/sponsors">
                      <Settings className="h-4 w-4" />
                      <span>Sponsors</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}