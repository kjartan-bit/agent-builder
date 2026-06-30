export default function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 94 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="M Sight"
      className={className}
      style={{ height: 30, width: "auto", display: "block", ...style }}
    >
      {/* Circle */}
      <circle cx="18" cy="18" r="18" fill="#4CAF50" />

      {/* White M — bold strokes */}
      <polyline
        points="9,27 9,9 18,21 27,9 27,27"
        fill="none"
        stroke="white"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* SIGHT text */}
      <text
        x="42"
        y="25"
        fill="#263238"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="500"
        fontSize="15"
        letterSpacing="0.8"
      >
        SIGHT
      </text>
    </svg>
  );
}
