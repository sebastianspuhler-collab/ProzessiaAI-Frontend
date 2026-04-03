import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

export function OnboardingBanner({ id, text }: { id: string; text: string }) {
  const storageKey = `prozessia_hint_dismissed_${id}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) setVisible(true);
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(storageKey, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mx-7 mt-5 mb-0 flex items-start gap-2.5 bg-[#F0F9FF] border border-[#BAE6FD] rounded-[8px] px-3.5 py-2.5">
      <Info size={14} className="text-[#0284C7] mt-0.5 shrink-0" />
      <p className="text-[13px] text-[#0369A1] flex-1 leading-relaxed">{text}</p>
      <button onClick={dismiss} className="text-[#7DD3FC] hover:text-[#0284C7] shrink-0 mt-0.5">
        <X size={13} />
      </button>
    </div>
  );
}
