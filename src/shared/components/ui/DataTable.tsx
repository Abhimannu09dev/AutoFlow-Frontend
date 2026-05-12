"use client";

import { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  renderCell?: (key: string, value: any, row: Record<string, any>) => ReactNode;
  className?: string;
}

export function DataTable({ columns, data, renderCell, className = "" }: DataTableProps) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white border border-[#f1f5f9] ${className}`}>
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f9fc] border-b border-[#f1f5f9]">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b] ${
              column.align === "center" ? "text-center" : 
              column.align === "right" ? "text-right" : "text-left"
            } ${column.width || "col-span-2"}`}
          >
            {column.label}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="divide-y divide-[#f1f5f9]">
        {data.map((row, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#f8f9fc] transition-colors">
            {columns.map((column) => (
              <div
                key={column.key}
                className={`text-[13px] ${
                  column.align === "center" ? "text-center" : 
                  column.align === "right" ? "text-right" : "text-left"
                } ${column.width || "col-span-2"}`}
              >
                {renderCell ? renderCell(column.key, row[column.key], row) : row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}