import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { EditUserDialog } from "./users/edit-user-dialog";
import { DeleteUserDialog } from "./users/delete-user-dialog";

// ✅ Tipe Props untuk kejelasan
interface TableDemoProps {
  datas: UserData[];
  column: string[];
  loading?: boolean;
}

interface UserData {
  id: number;
  fullname: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  is_active: number;
  is_blocked: number;
  created_at: string;
  user_auth: {
    username: string | null;
    email: string | null;
  };
}

export function TableDemo({ datas, column, loading = false }: TableDemoProps) {
  const [users, setUsers] = useState<UserData[]>([]);

  const tableContent = useMemo(() => {
    if (loading) return <LoadingRow colSpan={column.length} />;
    if (!datas.length) return <NoDataRow colSpan={column.length} />;

    return datas.map((data, index) => <UserRow key={data.id} data={data} index={index} />);
  }, [datas, loading, column.length]);

  return (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
          {column.map((header, i) => (
            <TableHead key={i}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{tableContent}</TableBody>
      {!loading && datas.length > 0 && (
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

// ✅ Komponen Loading
const LoadingRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className='text-center py-4'>
      <div className='flex justify-center gap-3'>
        <div className='animate-spin h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full'></div>
        <span className='animate-pulse text-gray-700'>Loading users...</span>
      </div>
    </TableCell>
  </TableRow>
);

// ✅ Komponen No Data
const NoDataRow = ({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className='text-center py-4 text-gray-500'>
      No users found
    </TableCell>
  </TableRow>
);

// ✅ Komponen User Row
const UserRow = ({ data, index }: { data: UserData; index: number }) => {
  console.log(data);

  return (
    <TableRow>
      <TableCell className='font-medium'>{index + 1}</TableCell>
      <TableCell>{formatEmpty(data.fullname)}</TableCell>
      <TableCell>{formatEmpty(data.user_auth.username)}</TableCell>
      <TableCell>{formatEmpty(data.user_auth.email)}</TableCell>
      <TableCell>{formatEmpty(data.phone)}</TableCell>
      <TableCell>{formatEmpty(data.date_of_birth)}</TableCell>
      <TableCell>{formatEmpty(data.gender)}</TableCell>
      <TableCell>{formatStatus(data.is_active, "a")}</TableCell>
      <TableCell>{formatStatus(data.is_blocked, "b")}</TableCell>
      <TableCell>{formatDate(data.created_at)}</TableCell>
      <TableCell>
        <div className='flex gap-2'>
          <EditUserDialog />
          <DeleteUserDialog id={data.id} onDelete={handleUserDeleted} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const handleUserDeleted = (id: number) => {
  setUsers(users.filter((user) => user.id !== id));
};

// ✅ Helper functions
const formatStatus = (status: number, type: "a" | "b") => {
  return type === "a" ? (status === 1 ? "Active" : "Inactive") : status === 0 ? "Open" : "Blocked";
};

const formatDate = (date: string) => {
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
};

const formatEmpty = (value: string | null) => value ?? "-";
