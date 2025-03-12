"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="w-8 h-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-blue-600 bg-blue-300 rounded-lg">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-sm leading-tight text-left">
              <span className="font-semibold truncate">{user.name}</span>
              <span className="text-xs truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
