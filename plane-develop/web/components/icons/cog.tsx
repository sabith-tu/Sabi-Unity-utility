import React from "react";

import type { Props } from "./types";

export const CogIcon: React.FC<Props> = ({
  width = "24",
  height = "24",
  color = "rgb(var(--color-text-200))",
  className,
}) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={color}
      d="M11.65 20H8.34998C8.16664 20 8.00414 19.9417 7.86248 19.825C7.72081 19.7083 7.63331 19.5583 7.59998 19.375L7.19998 16.85C6.88331 16.7333 6.54998 16.575 6.19998 16.375C5.84998 16.175 5.54164 15.9667 5.27498 15.75L2.94998 16.825C2.76664 16.9083 2.58331 16.9208 2.39998 16.8625C2.21664 16.8042 2.07498 16.6833 1.97498 16.5L0.324976 13.575C0.224976 13.4083 0.199976 13.2333 0.249976 13.05C0.299976 12.8667 0.399976 12.7167 0.549976 12.6L2.69998 11.025C2.66664 10.875 2.64581 10.7042 2.63748 10.5125C2.62914 10.3208 2.62498 10.15 2.62498 10C2.62498 9.85 2.62914 9.67917 2.63748 9.4875C2.64581 9.29583 2.66664 9.125 2.69998 8.975L0.549976 7.4C0.399976 7.28333 0.299976 7.13333 0.249976 6.95C0.199976 6.76667 0.224976 6.59167 0.324976 6.425L1.97498 3.5C2.07498 3.31667 2.21664 3.19583 2.39998 3.1375C2.58331 3.07917 2.76664 3.09167 2.94998 3.175L5.27498 4.25C5.54164 4.03333 5.84998 3.825 6.19998 3.625C6.54998 3.425 6.88331 3.275 7.19998 3.175L7.59998 0.625C7.63331 0.441667 7.72081 0.291667 7.86248 0.175C8.00414 0.0583333 8.16664 0 8.34998 0H11.65C11.8333 0 11.9958 0.0583333 12.1375 0.175C12.2791 0.291667 12.3666 0.441667 12.4 0.625L12.8 3.15C13.1166 3.26667 13.4541 3.42083 13.8125 3.6125C14.1708 3.80417 14.475 4.01667 14.725 4.25L17.05 3.175C17.2333 3.09167 17.4166 3.07917 17.6 3.1375C17.7833 3.19583 17.925 3.31667 18.025 3.5L19.675 6.4C19.775 6.56667 19.8041 6.74583 19.7625 6.9375C19.7208 7.12917 19.6166 7.28333 19.45 7.4L17.3 8.925C17.3333 9.09167 17.3541 9.27083 17.3625 9.4625C17.3708 9.65417 17.375 9.83333 17.375 10C17.375 10.1667 17.3708 10.3417 17.3625 10.525C17.3541 10.7083 17.3333 10.8833 17.3 11.05L19.45 12.6C19.6 12.7167 19.7 12.8667 19.75 13.05C19.8 13.2333 19.775 13.4083 19.675 13.575L18.025 16.5C17.925 16.6833 17.7833 16.8042 17.6 16.8625C17.4166 16.9208 17.2333 16.9083 17.05 16.825L14.725 15.75C14.4583 15.9667 14.1541 16.1792 13.8125 16.3875C13.4708 16.5958 13.1333 16.75 12.8 16.85L12.4 19.375C12.3666 19.5583 12.2791 19.7083 12.1375 19.825C11.9958 19.9417 11.8333 20 11.65 20ZM9.99998 13.25C10.9 13.25 11.6666 12.9333 12.3 12.3C12.9333 11.6667 13.25 10.9 13.25 10C13.25 9.1 12.9333 8.33333 12.3 7.7C11.6666 7.06667 10.9 6.75 9.99998 6.75C9.09998 6.75 8.33331 7.06667 7.69998 7.7C7.06664 8.33333 6.74998 9.1 6.74998 10C6.74998 10.9 7.06664 11.6667 7.69998 12.3C8.33331 12.9333 9.09998 13.25 9.99998 13.25ZM9.99998 11.75C9.51664 11.75 9.10414 11.5792 8.76248 11.2375C8.42081 10.8958 8.24998 10.4833 8.24998 10C8.24998 9.51667 8.42081 9.10417 8.76248 8.7625C9.10414 8.42083 9.51664 8.25 9.99998 8.25C10.4833 8.25 10.8958 8.42083 11.2375 8.7625C11.5791 9.10417 11.75 9.51667 11.75 10C11.75 10.4833 11.5791 10.8958 11.2375 11.2375C10.8958 11.5792 10.4833 11.75 9.99998 11.75ZM8.89997 18.5H11.1L11.45 15.7C12 15.5667 12.5208 15.3583 13.0125 15.075C13.5041 14.7917 13.95 14.45 14.35 14.05L17 15.2L18 13.4L15.65 11.675C15.7166 11.3917 15.7708 11.1125 15.8125 10.8375C15.8541 10.5625 15.875 10.2833 15.875 10C15.875 9.71667 15.8583 9.4375 15.825 9.1625C15.7916 8.8875 15.7333 8.60833 15.65 8.325L18 6.6L17 4.8L14.35 5.95C13.9666 5.51667 13.5333 5.15417 13.05 4.8625C12.5666 4.57083 12.0333 4.38333 11.45 4.3L11.1 1.5H8.89997L8.54998 4.3C7.98331 4.41667 7.45414 4.61667 6.96248 4.9C6.47081 5.18333 6.03331 5.53333 5.64998 5.95L2.99998 4.8L1.99998 6.6L4.34998 8.325C4.28331 8.60833 4.22914 8.8875 4.18748 9.1625C4.14581 9.4375 4.12498 9.71667 4.12498 10C4.12498 10.2833 4.14581 10.5625 4.18748 10.8375C4.22914 11.1125 4.28331 11.3917 4.34998 11.675L1.99998 13.4L2.99998 15.2L5.64998 14.05C6.04998 14.45 6.49581 14.7917 6.98748 15.075C7.47914 15.3583 7.99998 15.5667 8.54998 15.7L8.89997 18.5Z"
    />
  </svg>
);
