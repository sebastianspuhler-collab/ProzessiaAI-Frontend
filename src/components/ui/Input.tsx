export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-[#09090B]">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#F7F7F8] border border-[#E4E4E7] rounded-[7px] px-3 py-2 text-[14px] text-[#09090B] placeholder-[#A1A1AA] outline-none focus:border-[#D1D1D6] focus:bg-white transition-all"
      />
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-[#09090B]">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-[#F7F7F8] border border-[#E4E4E7] rounded-[7px] px-3 py-2 text-[14px] text-[#09090B] placeholder-[#A1A1AA] outline-none focus:border-[#D1D1D6] focus:bg-white transition-all resize-none"
      />
    </div>
  );
}
