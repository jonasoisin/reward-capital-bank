"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateProfile, changePassword } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

// ── Edit profile ──────────────────────────────────────────────────────────────

const profileSchema = z.object({
  phone:   z.string().optional(),
  address: z.string().optional(),
});

function EditProfileSection({ user }: { user: User }) {
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [saved,   setSaved]     = useState(false);
  const [error,   setError]     = useState<string | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { phone: user.phone ?? "", address: user.address ?? "" },
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setSaving(true);
    setError(null);
    const result = await updateProfile(data);
    setSaving(false);
    if ("error" in result) { setError(result.error ?? "An error occurred"); return; }
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!editing) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-15 font-semibold text-gray-800">Personal Information</h3>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-12 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          >
            <Pencil size={12} /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: "First Name",     value: user.firstName },
            { label: "Last Name",      value: user.lastName },
            { label: "Email",          value: user.email },
            { label: "Date of Birth",  value: user.dateOfBirth || "—" },
            { label: "Phone",          value: user.phone || "—" },
            { label: "Address",        value: user.address || "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="eyebrow mb-0.5">{label}</p>
              <p className="text-14 font-medium text-gray-900 break-all">{value}</p>
            </div>
          ))}
        </div>
        {saved && (
          <p className="flex items-center gap-1.5 text-12 text-green-600">
            <Check size={12} /> Profile updated
          </p>
        )}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-15 font-semibold text-gray-800">Edit Profile</h3>
          <button type="button" onClick={() => setEditing(false)}
            className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        {error && <p className="text-12 text-red-500">{error}</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-13 font-medium text-gray-700">Phone</FormLabel>
              <FormControl><Input placeholder="+1 555 000 0000" className="input-class" {...field} /></FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-13 font-medium text-gray-700">Address</FormLabel>
              <FormControl><Input placeholder="Street, City, State" className="input-class" {...field} /></FormControl>
              <FormMessage className="text-12 text-red-500" />
            </FormItem>
          )} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="payment-transfer_btn">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

// ── Change password ───────────────────────────────────────────────────────────

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword:     z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ChangePasswordSection() {
  const [open,   setOpen]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState(false);
  const [error,  setError]  = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setSaving(true);
    setError(null);
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword:     data.newPassword,
    });
    setSaving(false);
    if ("error" in result) { setError(result.error ?? "An error occurred"); return; }
    setDone(true);
    setOpen(false);
    form.reset();
    setTimeout(() => setDone(false), 4000);
  };

  if (!open) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-15 font-semibold text-gray-800">Password</h3>
            <p className="text-13 text-gray-500">Change your account password</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-12 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          >
            Change
          </button>
        </div>
        {done && (
          <p className="flex items-center gap-1.5 text-12 text-green-600">
            <Check size={12} /> Password changed successfully
          </p>
        )}
      </div>
    );
  }

  const PasswordInput = ({
    name,
    label,
    show,
    toggle,
  }: {
    name: "currentPassword" | "newPassword" | "confirmPassword";
    label: string;
    show: boolean;
    toggle: () => void;
  }) => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-13 font-medium text-gray-700">{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Input type={show ? "text" : "password"} className="input-class pr-9" {...field} />
            <button type="button" onClick={toggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormControl>
        <FormMessage className="text-12 text-red-500" />
      </FormItem>
    )} />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-15 font-semibold text-gray-800">Change Password</h3>
          <button type="button" onClick={() => { setOpen(false); setError(null); }}
            className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        {error && <p className="text-12 text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
        <PasswordInput name="currentPassword" label="Current Password" show={showCurrent} toggle={() => setShowCurrent(p => !p)} />
        <PasswordInput name="newPassword"     label="New Password"     show={showNew}     toggle={() => setShowNew(p => !p)} />
        <PasswordInput name="confirmPassword" label="Confirm Password" show={showNew}     toggle={() => setShowNew(p => !p)} />
        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="payment-transfer_btn">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Updating…</> : "Update Password"}
          </Button>
          <Button type="button" variant="outline" onClick={() => { setOpen(false); setError(null); }}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}

// ── Composed profile form ─────────────────────────────────────────────────────

export default function ProfileForm({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-gray-200 p-6">
        <EditProfileSection user={user} />
      </div>
      <div className="rounded-xl border border-gray-200 p-6">
        <ChangePasswordSection />
      </div>
    </div>
  );
}
