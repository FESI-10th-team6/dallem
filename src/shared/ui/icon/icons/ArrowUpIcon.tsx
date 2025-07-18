import { IconProps } from '../IconType';

export const ArrowUpIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#1F2937"
      d="M12.274 8.975a.824.824 0 0 0-1.131 0l-5.779 5.46c-.542.511-.18 1.423.566 1.423h11.557c.746 0 1.108-.912.566-1.424l-5.779-5.459Z"
    />
  </svg>
);
