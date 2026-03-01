"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  Upload,
  User2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const mainNavItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Practice Tests",
    icon: FileText,
    href: "/practice",
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: "/materials",
  },
  {
    title: "Tutoring",
    icon: MessageSquare,
    href: "/tutoring",
  },
]

const recentCourses = [
  {
    title: "AP Calculus",
    href: "/dashboard/ap-calc-ab",
  },
  {
    title: "AP World History",
    href: "/courses/world-history",
  },
  {
    title: "AP Statistics",
    href: "/courses/statistics",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span className="font-serif text-xl font-bold">AP Study</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 p-2">
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator />

            <SidebarGroup>
              <SidebarGroupLabel>Recent Courses</SidebarGroupLabel>
              <SidebarMenu>
                {recentCourses.map((course) => (
                  <SidebarMenuItem key={course.title}>
                    <SidebarMenuButton asChild isActive={pathname === course.href}>
                      <Link href={course.href} className="flex items-center gap-3">
                        <Star className="h-4 w-4" />
                        <span>{course.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground"
                  >
                    <Upload className="h-4 w-4" />
                    Add New Course
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile" className="flex items-center gap-3">
                <User2 className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

