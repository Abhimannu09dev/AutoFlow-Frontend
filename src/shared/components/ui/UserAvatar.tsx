interface UserAvatarProps {
  name: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ name, role, size = "md", className = "" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    sm: "size-8 text-[11px]",
    md: "size-10 text-[13px]",
    lg: "size-12 text-[15px]",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`
        ${sizes[size]} 
        flex items-center justify-center rounded-full 
        bg-gradient-to-br from-[#4338ca] to-[#6366f1] 
        font-semibold text-white
      `}>
        {initials}
      </div>
      {role && (
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#0f172a] truncate">{name}</p>
          <p className="text-[11px] text-[#64748b] truncate">{role}</p>
        </div>
      )}
    </div>
  );
}
