"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AddUserDialog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State untuk mengontrol modal

  const base_url = "http://127.0.0.1:8000/api";
  const url = `${base_url}/user`;
  const authorization = "Bearer 3|uI7zw1mYimbDXouVu7P6g8RHYi4vjU4udR2PLCSc21483a17";

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [date_of_birth, setDob] = useState<Date>();
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    const formattedDate = date_of_birth ? date_of_birth.toISOString().split("T")[0] : null;

    const userData = { fullname, phone, date_of_birth: formattedDate, gender, email, password };

    try {
      const response = await axios.post(url, userData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authorization,
        },
        withCredentials: true,
      });

      setMessage(response.data.message);
      setMessageType("success");

      setTimeout(() => setIsOpen(false), 500);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='default' onClick={() => setIsOpen(true)}>
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        {message && (
          <Alert variant={messageType === "error" ? "destructive" : "default"} className='mb-4'>
            {messageType === "error" ? <AlertCircle className='h-4 w-4 text-red-500' /> : <CheckCircle className='h-4 w-4 text-green-500' />}
            <AlertTitle>{messageType === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fullname' className='text-right'>
              Fullname
            </Label>
            <Input id='fullname' className='col-span-3' onChange={(e) => setFullname(e.target.value)} value={fullname} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='phone' className='text-right'>
              Phone
            </Label>
            <Input id='phone' className='col-span-3' onChange={(e) => setPhone(e.target.value)} value={phone} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='date_of_birth' className='text-right'>
              Date of birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-[280px] justify-start text-left font-normal", !date_of_birth && "text-muted-foreground")}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date_of_birth ? format(date_of_birth, "PPP") : <span>Pick your birthday</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar mode='single' selected={date_of_birth} onSelect={setDob} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right'>Gender</Label>
            <RadioGroup defaultValue={gender} className='flex' onValueChange={(value) => setGender(value)}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='male' id='male' />
                <Label htmlFor='male'>Male</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='female' id='female' />
                <Label htmlFor='female'>Female</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <hr className='py-2' />

        <div className='grid gap-4 pt-2'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <Input id='email' className='col-span-3' onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='password' className='text-right'>
              Password
            </Label>
            <Input id='password' className='col-span-3' type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
        </div>

        <DialogFooter>
          <Button type='submit' onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save new user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
