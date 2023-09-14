import React from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      content={<CloseSvg />}
      size="small"
      onClick={onClick}
      style={{
        backgroundColor: "transparent",
        minWidth: "0px",
      }}
    />
  )
}

const CloseSvg = () => {
  return (
    <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.88794" y="3.88818" width="24.2998" height="24.2998" rx="5.83196" fill="#ECEBED" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1335 11.9491C20.5129 12.3288 20.5126 12.9443 20.1328 13.3237L13.3228 20.1274C12.943 20.5068 12.3276 20.5065 11.9482 20.1267C11.5688 19.747 11.5691 19.1316 11.9488 18.7521L18.7589 11.9484C19.1386 11.569 19.7541 11.5693 20.1335 11.9491Z"
        fill="#43404A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1335 20.127C19.7541 20.5068 19.1386 20.507 18.7589 20.1276L11.9488 13.3239C11.5691 12.9445 11.5688 12.3291 11.9482 11.9493C12.3276 11.5696 12.943 11.5693 13.3228 11.9487L20.1328 18.7524C20.5126 19.1318 20.5129 19.7472 20.1335 20.127Z"
        fill="#43404A"
      />
    </svg>
  )
}
