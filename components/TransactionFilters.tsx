"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "./ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";

export default function TransactionFilters() {
  const router     = useRouter();
  const pathname   = usePathname();
  const params     = useSearchParams();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value && value !== "all") {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      sp.delete("page"); // reset to page 1 on filter change
      startTransition(() => router.push(`${pathname}?${sp.toString()}`));
    },
    [params, pathname, router]
  );

  const clearAll = () => {
    startTransition(() => router.push(pathname));
  };

  const hasFilters = params.has("type") || params.has("startDate") || params.has("endDate") || params.has("search");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search by note */}
      <div className="relative min-w-[180px] flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes…"
          defaultValue={params.get("search") ?? ""}
          className="h-9 pl-8 text-13"
          onChange={e => {
            // Debounce via setTimeout
            clearTimeout((window as unknown as { _txnSearchTimer?: ReturnType<typeof setTimeout> })._txnSearchTimer);
            (window as unknown as { _txnSearchTimer?: ReturnType<typeof setTimeout> })._txnSearchTimer =
              setTimeout(() => update("search", e.target.value), 400);
          }}
        />
      </div>

      {/* Type filter */}
      <Select
        defaultValue={params.get("type") ?? "all"}
        onValueChange={v => update("type", v)}
      >
        <SelectTrigger className="h-9 w-[130px] text-13">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="transfer">Transfer</SelectItem>
          <SelectItem value="credit">Credit</SelectItem>
          <SelectItem value="debit">Debit</SelectItem>
        </SelectContent>
      </Select>

      {/* Start date */}
      <Input
        type="date"
        defaultValue={params.get("startDate") ?? ""}
        className="h-9 w-[140px] text-13"
        onChange={e => update("startDate", e.target.value)}
        title="From date"
      />

      {/* End date */}
      <Input
        type="date"
        defaultValue={params.get("endDate") ?? ""}
        className="h-9 w-[140px] text-13"
        onChange={e => update("endDate", e.target.value)}
        title="To date"
      />

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-12 text-gray-500 hover:border-red-200 hover:text-red-500"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}
