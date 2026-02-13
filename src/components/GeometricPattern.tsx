export function GeometricPattern() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-[0.15]"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-dashed"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        </pattern>
        <pattern
          id="grid-dashed-2"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
          x="40"
          y="40"
        >
          <path
            d="M 0 60 L 60 60 60 0"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            strokeDasharray="3 6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-dashed)" />
      <rect width="100%" height="100%" fill="url(#grid-dashed-2)" />
    </svg>
  );
}
