// NavMain.jsx
"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAdminContext } from "@/contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export function NavMain({ items }) {
  const { setActivePage, setActiveChildPage, activePage, activeChildPage } =
    useAdminContext();
  const navigate = useNavigate();

  const handleSetActivePage = (page) => {
    setActivePage(page);
  };

  const handleSetActiveChildPage = (page) => {
    setActiveChildPage(page);
  };

  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    handleSetActivePage(item.title);
                    handleSetActiveChildPage(item.items?.[0]?.title);
                    handleNavigation(item?.items?.[0]?.url);
                  }}
                >
                  {item.icon && <item.icon />}
                  <span
                    className={clsx(
                      "ml-2",
                      activePage === item.title && "font-semibold"
                    )}
                  >
                    {item.title}
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        onClick={() => {
                          handleSetActivePage(item.title);
                          handleSetActiveChildPage(subItem.title);
                          handleNavigation(subItem.url);
                        }}
                      >
                        <span
                          className={clsx(
                            activeChildPage === subItem.title && "font-semibold"
                          )}
                        >
                          {subItem.title}
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
