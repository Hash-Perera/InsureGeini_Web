import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Paperclip,
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
    name: "shadcn",
    email: "m@example.com",
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
      title: "Users",
      url: "",
      icon: Bot,
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
      icon: Bot,
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
      icon: BookOpen,
      items: [
        {
          title: "Reviews Dashboard",
          url: "/admin/feedback",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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
