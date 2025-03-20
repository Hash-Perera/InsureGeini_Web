import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AdminDashboard/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import axiosInstance from "@/hooks/axios";

function AdminLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 403) {
        console.log("Session Expired");
        setIsOpen(true);
      }
      return Promise.reject(error);
    }
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SessionEndAlert isOpen={isOpen} setIsOpen={setIsOpen} />
      <SidebarInset>
        <header className="flex h-16 w-full shrink-0 overflow-x-hidden items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.map((name, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  const isFirst = index === 0;
                  return (
                    <React.Fragment key={routeTo}>
                      <BreadcrumbItem>
                        {isFirst ? (
                          <BreadcrumbLink>{name}</BreadcrumbLink>
                        ) : isLast ? (
                          <BreadcrumbPage>{name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={routeTo}>{name}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* Content */}
        <div className="flex flex-col flex-1 w-full gap-4 p-4 overflow-x-hidden ">
          <Outlet />

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}

export default AdminLayout;

const SessionEndAlert = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <AlertDialog
      isOpen={isOpen}
      open={isOpen}
      onOpenChange={() => setIsOpen(!isOpen)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center ">
            Your Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center ">
            Your session has been expired. Please login again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter
          className={"w-full items-center flex sm:justify-center"}
        >
          <AlertDialogAction
            className="flex items-center sm:justify-center w-fit"
            onClick={handleConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
