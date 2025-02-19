"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { AddUserDialog } from "@/components/users/add-user-dialog";
import { AppSidebar } from "@/components/app-sidebar";
import { TableDemo } from "@/components/table-demo";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "Bearer 3|uI7zw1mYimbDXouVu7P6g8RHYi4vjU4udR2PLCSc21483a17";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Kolom tabel di-memoisasi untuk menghindari re-render yang tidak perlu
  const userColumn = useMemo(
    () => ["No.", "Fullname", "Username", "Email", "Phone", "Date of Birth", "Gender", "Status", "Block Status", "Created Date", "Action"],
    []
  );

  // Fetch data dengan useCallback untuk menghindari pembuatan ulang fungsi
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${API_AUTH_TOKEN}`,
        },
      });

      if (response.data.status === "success") {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Error: " + err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Komponen Statistik untuk tampilan lebih clean
  function StatCard({ title, value }) {
    return (
      <div className='rounded-xl bg-muted/50 p-5'>
        <div className='text-gray-500 text-xl'>{title}</div>
        <div className='text-3xl font-bold'>{value}</div>
      </div>
    );
  }

  // Komponen Loading UI
  function LoadingState() {
    return (
      <div className='flex justify-center items-center h-40'>
        <p className='text-gray-500'>Loading users...</p>
      </div>
    );
  }

  // Komponen Error Handling UI
  function ErrorState({ message, retry }) {
    return (
      <div className='flex flex-col items-center justify-center h-40 gap-4'>
        <p className='text-red-500'>{message}</p>
        <Button onClick={retry} variant='outline'>
          Retry
        </Button>
      </div>
    );
  }

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
          {/* Statistik Users */}
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <StatCard title='Total Users' value={users.length} />
          </div>

          {/* Content Area */}
          <div className='bg-white min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
            <div className='w-full mb-5 flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>User Management</h2>
              <AddUserDialog />
            </div>

            {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={fetchUsers} /> : <TableDemo datas={users} column={userColumn} />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
