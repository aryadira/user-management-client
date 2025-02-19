"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const AUTH_TOKEN = "Bearer 3|uI7zw1mYimbDXouVu7P6g8RHYi4vjU4udR2PLCSc21483a17";

// ✅ Custom Hook untuk handle logic form & API request
const useAddUser = () => {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    date_of_birth: null,
    gender: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const router = useRouter();

  // ✅ Fungsi untuk menangani perubahan input secara dinamis
  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }, []);

  // ✅ Fungsi untuk menangani perubahan tanggal
  const handleDateChange = useCallback((date) => {
    setForm((prev) => ({ ...prev, date_of_birth: date }));
  }, []);

  // ✅ Submit data ke API
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const formattedDate = form.date_of_birth ? form.date_of_birth.toISOString().split("T")[0] : null;
      const userData = { ...form, date_of_birth: formattedDate };

      const response = await axios.post(`${API_BASE_URL}/user`, userData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: AUTH_TOKEN,
        },
        withCredentials: true,
      });

      setMessage(response.data.message);
      setMessageType("success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [form]);

  return {
    form,
    loading,
    message,
    messageType,
    handleChange,
    handleDateChange,
    handleSubmit,
  };
};

// ✅ Komponen Utama
export function AddUserDialog() {
  const { form, loading, message, messageType, handleChange, handleDateChange, handleSubmit } = useAddUser();
  const [isOpen, setIsOpen] = useState(false);

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
          <FormField id='fullname' label='Fullname' value={form.fullname} onChange={handleChange} />
          <FormField id='phone' label='Phone' value={form.phone} onChange={handleChange} />

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='date_of_birth' className='text-right'>
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn("w-[280px] justify-start text-left font-normal", !form.date_of_birth && "text-muted-foreground")}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {form.date_of_birth ? format(form.date_of_birth, "PPP") : <span>Pick your birthday</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar mode='single' selected={form.date_of_birth} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <GenderField gender={form.gender} onChange={handleChange} />

          <FormField id='email' label='Email' value={form.email} onChange={handleChange} />
          <FormField id='password' label='Password' type='password' value={form.password} onChange={handleChange} />
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

// ✅ Komponen Reusable untuk Input Field
const FormField = ({ id, label, type = "text", value, onChange }) => (
  <div className='grid grid-cols-4 items-center gap-4'>
    <Label htmlFor={id} className='text-right'>
      {label}
    </Label>
    <Input id={id} className='col-span-3' type={type} value={value} onChange={onChange} />
  </div>
);

// ✅ Komponen Reusable untuk Gender Selection
const GenderField = ({ gender, onChange }) => (
  <div className='grid grid-cols-4 items-center gap-4'>
    <Label className='text-right'>Gender</Label>
    <RadioGroup defaultValue={gender} className='flex' onValueChange={(value) => onChange({ target: { id: "gender", value } })}>
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
);
