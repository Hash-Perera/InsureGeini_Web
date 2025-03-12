import * as React from "react";
import { ChevronsUpDown, Plus, LogOut, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center justify-center rounded-lg aspect-square size-8 text-sidebar-primary-foreground">
                <img
                  src={"/images/logo.jpeg"}
                  alt={"logo"}
                  className="size-8"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">
                  {activeTeam.name}
                </span>
                <span className="text-xs truncate">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-400">
              Account
            </DropdownMenuLabel>

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex items-center justify-center border rounded-sm size-6">
                <User2 className="size-4 shrink-0" />
              </div>
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleSignOut}>
              <div className="flex items-center justify-center bg-white border rounded-md size-6 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950">
                <LogOut className="size-4" />
              </div>
              <div className="font-medium text-neutral-500 dark:text-neutral-400">
                Signout
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
