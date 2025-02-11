"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AddUserDialog } from "@/components/add-user-dialog";
import { AppSidebar } from "@/components/app-sidebar";
import { TableDemo } from "@/components/table-demo";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const base_url = "http://127.0.0.1:8000/api";
  const endpoint = "user";
  const authorization = "Bearer 3|uI7zw1mYimbDXouVu7P6g8RHYi4vjU4udR2PLCSc21483a17";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${base_url}/${endpoint}`, {
          headers: {
            Accept: "application/json",
            Authorization: authorization,
          },
        });

        if (response.data.status === "success") {
          setUsers(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch data");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className='rounded-xl bg-muted/50 p-5'>
                <div className='text-gray-500 text-xl'>Total Users</div>
                <div className='text-3xl font-bold'>{users.length}</div>
              </div>
            ))}
          </div>
          <div className='bg-white min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
            <div className='w-full mb-5'>
              <AddUserDialog />
            </div>
            <TableDemo datas={users} loading={loading} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
