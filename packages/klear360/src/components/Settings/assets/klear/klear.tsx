/**
 * Placeholder wordmark. Swap the paths here for the real Klear artwork.
 */
const KlearLogo = (): React.ReactElement => {
  return (
    <svg
      width="116"
      height="24"
      viewBox="0 0 116 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="logo">
        <rect x="0" y="2" width="20" height="20" rx="5" fill="#003F5B" />
        <path
          d="M5.6 6.8H8V11.6L12.4 6.8H15.5L10.6 12L15.8 17.2H12.7L8 12.4V17.2H5.6V6.8Z"
          fill="#FFFFFF"
        />
        <text
          x="27"
          y="17"
          fill="#192839"
          fontFamily="Inter, Roboto, sans-serif"
          fontSize="17"
          fontWeight="600"
          letterSpacing="-0.3"
        >
          Klear
        </text>
      </g>
    </svg>
  );
};

export default KlearLogo;
