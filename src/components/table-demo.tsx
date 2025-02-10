import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function filterStatus(status, type) {
  if (status === 1) {
    if (type === "a") return "Active";
    if (type === "b") return "Blocked";
    return "Disabled";
  }
  return "Unblocked";
}

export function TableDemo({ datas, loading = false }) {
  console.log(datas);

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
      <TableBody>
        {datas.map((data, index) => (
          <TableRow key={data.id}>
            <TableCell className='font-medium'>{index + 1}</TableCell>
            <TableCell>{data.fullname}</TableCell>
            <TableCell>{data.phone}</TableCell>
            <TableCell>{data.date_of_birth}</TableCell>
            <TableCell>{data.gender}</TableCell>
            <TableCell>{filterStatus(data.is_active, "a")}</TableCell>
            <TableCell>{filterStatus(data.blocked, "b")}</TableCell>
            <TableCell>{data.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{datas.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
