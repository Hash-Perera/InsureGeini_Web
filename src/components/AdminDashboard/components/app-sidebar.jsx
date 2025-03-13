import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Paperclip,
  CircleGauge,
  Users,
  FileText,
  MessageSquareCode,
} from "lucide-react";

import { NavMain } from "@/components/AdminDashboard/components/nav-main";
import { NavUser } from "@/components/AdminDashboard/components/nav-user";
import { TeamSwitcher } from "@/components/AdminDashboard/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "InsureGeni",
    email: "admin.admin.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "InsureGeni",
      logo: GalleryVerticalEnd,
      plan: "Admin",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: CircleGauge,
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
        },
      ],
    },
    {
      title: "Users",
      url: "",
      icon: Users,
      items: [
        {
          title: "Staff",
          url: "/admin/staff",
        },
        {
          title: "Clients",
          url: "/admin/clients",
        },
      ],
    },
    {
      title: "Claims",
      url: "",
      icon: Paperclip,
      items: [
        {
          title: "List",
          url: "/admin/claims",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Incident-Reports",
          url: "/admin/reports",
        },
      ],
    },

    {
      title: "Customer Reviews",
      url: "#",
      icon: MessageSquareCode,
      items: [
        {
          title: "Reviews Dashboard",
          url: "/admin/feedback",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
