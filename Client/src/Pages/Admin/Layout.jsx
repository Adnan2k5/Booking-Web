// components/admin/AdminLayout.jsx
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
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../../components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { BarChart3, BookOpen, CalendarDays, ClipboardCheck, Compass, FileCheck, Hotel, LifeBuoy, LogOut, Mountain, Settings, ShoppingBag, Store, TicketCheck, User, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../AuthProvider';

export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuth(); //user email and name to be added
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/locations"}>
                  <Link to="/admin/locations">
                    <Compass className="h-4 w-4" />
                    <span>Locations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/adventures"}>
                  <Link to="/admin/adventures">
                    <Compass className="h-4 w-4" />
                    <span>Adventures</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/bookings"}>
                  <Link to="/admin/bookings">
                    <BookOpen className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"}>
                  <Link to="/admin/users">
                    <User className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/instructors"}>
                  <Link to="/admin/instructors">
                    <User className="h-4 w-4" />
                    <span>Instructor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/store"}>
                  <Link to="/admin/store">
                    <Store className="h-4 w-4" />
                    <span>Stores</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/hotels"}>
                  <Link to="/admin/hotels">
                    <Hotel className="h-4 w-4" />
                    <span>Hotels</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/tickets"}>
                  <Link to="/admin/tickets">
                    <TicketCheck className="h-4 w-4" />
                    <span>Tickets & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/terms"}>
                  <Link to="/admin/terms">
                    <FileCheck className="h-4 w-4" />
                    <span>Terms & Condition</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/declaration"}>
                  <Link to="/admin/declaration">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>User Declaration</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Continue with other sidebar groups */}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}