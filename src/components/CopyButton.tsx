import React from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"

export const CopyButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      size="small"
      onClick={onClick}
      content={<CopySvg />}
      style={{
        backgroundColor: "transparent",
        minWidth: "0",
        paddingLeft: "0",
        paddingRight: "0",
        marginRight: "6px",
      }}
    />
  )
}

const CopySvg = () => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7992 14.44V14.44C14.8545 14.44 15.7101 13.5845 15.7101 12.5291V5.32004C15.7101 4.06083 14.6893 3.04004 13.4301 3.04004H7.00965C6.16362 3.04004 5.47778 3.72588 5.47778 4.57191V4.57191"
        stroke="#161518"
        strokeWidth="0.76"
        strokeLinejoin="round"
      />
      <rect
        x="3.80005"
        y="5.19385"
        width="9.6989"
        height="11.4"
        rx="1.52"
        stroke="#161518"
        strokeWidth="1.52"
        strokeLinejoin="round"
      />
    </svg>
  )
}
