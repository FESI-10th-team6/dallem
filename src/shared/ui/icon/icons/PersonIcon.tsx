import { IconProps } from '../IconType';

export const PersonIcon = ({ size = 16, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle
        cx="8"
        cy="5.334"
        r="2.667"
        fill="#111827"
      />
      <path
        fill="#111827"
        d="M3.559 11.547c.44-1.862 2.289-2.88 4.203-2.88h.476c1.914 0 3.763 1.018 4.203 2.88.086.36.153.738.191 1.121.037.367-.264.666-.632.666H4c-.368 0-.67-.3-.633-.666.038-.383.106-.76.192-1.12Z"
      />
    </svg>
  );
};
