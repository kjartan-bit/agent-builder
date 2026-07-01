export default function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 92 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="M Sight"
      className={className}
      style={{ height: 28, width: "auto", display: "block", ...style }}
    >
      {/* Green circle */}
      <circle cx="18" cy="18" r="18" fill="#4CAF50" />

      {/* White M — filled letter shape */}
      <path
        fill="white"
        d="M 8 27 L 8 9 L 11 9 L 18 18 L 25 9 L 28 9 L 28 27 L 25 27 L 25 15 L 18 24 L 11 15 L 11 27 Z"
      />

      {/* SIGHT text */}
      <text
        x="38"
        y="25"
        fill="#4CAF50"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="500"
        fontSize="14"
        letterSpacing="0.5"
      >
        SIGHT
      </text>
    </svg>
  );
}
