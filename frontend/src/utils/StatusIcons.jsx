import { CheckIcon as Check } from '@heroicons/react/24/solid';

export function CheckIcon() {
  return <Check className="w-4 h-4 inline text-gray-300" />;
}

export function CheckDoubleIcon({ color = "gray" }) {
  const colorClass = color === "blue" ? "text-blue-500" : "text-gray-300";
  return (
    <span className={`inline-flex items-center ${colorClass}`}>
      <Check className="w-4 h-4 -mr-1" />
      <Check className="w-4 h-4" />
    </span>
  );
}
