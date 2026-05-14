import Image from "next/image";
import { User } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  status: string;
  statusColor: string;
  technician?: {
    name: string;
    role: string;
  };
  image?: string;
  className?: string;
}

export function ServiceCard({ 
  title, 
  description, 
  status, 
  statusColor,
  technician,
  image,
  className = "" 
}: ServiceCardProps) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] border border-[#f1f5f9] ${className}`}>
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${statusColor}`}>
          {status}
        </span>
      </div>

      {/* Service Info */}
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-[#0f172a] mb-2">{title}</h3>
        <p className="text-[13px] text-[#64748b]">{description}</p>
      </div>

      {/* Technician Info */}
      {technician && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#ede9fe]">
            <User size={16} className="text-[#4338ca]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#0f172a]">{technician.name}</p>
            <p className="text-[11px] text-[#64748b]">{technician.role}</p>
          </div>
        </div>
      )}

      {/* Service Image */}
      {image && (
        <div className="rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={192}
            className="w-full h-24 object-cover"
          />
        </div>
      )}
    </div>
  );
}
