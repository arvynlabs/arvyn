export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="7" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <path
        d="M9 22L16 9l7 13"
        stroke="#FF5A00"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.8 18.2h8.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="9" r="1.6" fill="#FF5A00" />
    </svg>
  );
}
