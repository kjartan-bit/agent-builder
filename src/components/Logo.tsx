export default function Logo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/11sightapplogo.png"
      alt="11Sight"
      className={className}
      style={{ height: 64, width: "auto", display: "block", ...style }}
    />
  );
}
