import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";

export function TableDemo({ datas, loading = false }) {
  const tableContent = useMemo(() => {
    if (loading) return <LoadingRow colSpan={8} />;
    if (!datas?.length) return <NoDataRow colSpan={8} />;

    return datas.map((data, index) => <UserRow key={data.id} data={data} index={index} />);
  }, [datas, loading]);

  return (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>No.</TableHead>
          <TableHead>Fullname</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Date of Birth</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Block Status</TableHead>
          <TableHead>Created Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{tableContent}</TableBody>
      {!loading && datas?.length > 0 && (
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{datas.length}</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

/** ✅ Komponen untuk Baris Loading */
function LoadingRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className='text-center py-4'>
        <div className='flex justify-center gap-3'>
          <div className='animate-spin h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full'></div>
          <span className='animate-pulse text-gray-700'>Loading users...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** ✅ Komponen untuk Baris No Data */
function NoDataRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className='text-center py-4 text-gray-500'>
        No users found
      </TableCell>
    </TableRow>
  );
}

/** ✅ Komponen untuk Setiap Baris User */
function UserRow({ data, index }) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{index + 1}</TableCell>
      <TableCell>{data.fullname}</TableCell>
      <TableCell>{data.phone}</TableCell>
      <TableCell>{data.date_of_birth}</TableCell>
      <TableCell>{data.gender}</TableCell>
      <TableCell>{filterStatus(data.is_active, "a")}</TableCell>
      <TableCell>{filterStatus(data.blocked, "b")}</TableCell>
      <TableCell>{formatDate(data.created_at)}</TableCell>
    </TableRow>
  );
}

/** ✅ Helper function untuk memformat status */
function filterStatus(status, type) {
  if (status === 1) {
    return type === "a" ? "Active" : "Blocked";
  }
  return "Open";
}

/** ✅ Helper function untuk memformat tanggal */
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(date));
}
