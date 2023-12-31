import React from "react"

import { Button } from "decentraland-ui/dist/components/Button/Button"

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      size="small"
      onClick={onClick}
      content={<TrashSvg />}
      style={{
        backgroundColor: "transparent",
        minWidth: "0px",
      }}
    />
  )
}

const TrashSvg = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 12C7.5 12.4125 7.1625 12.75 6.75 12.75C6.3375 12.75 6 12.4125 6 12V9C6 8.5875 6.3375 8.25 6.75 8.25C7.1625 8.25 7.5 8.5875 7.5 9V12ZM12 12C12 12.4125 11.6625 12.75 11.25 12.75C10.8375 12.75 10.5 12.4125 10.5 12V9C10.5 8.5875 10.8375 8.25 11.25 8.25C11.6625 8.25 12 8.5875 12 9V12ZM13.5 14.25C13.5 14.6632 13.164 15 12.75 15H5.25C4.836 15 4.5 14.6632 4.5 14.25V6H13.5V14.25ZM7.5 3.246C7.5 3.12975 7.6605 3 7.875 3H10.125C10.3395 3 10.5 3.12975 10.5 3.246V4.5H7.5V3.246ZM15.75 4.5H15H12V3.246C12 2.283 11.1593 1.5 10.125 1.5H7.875C6.84075 1.5 6 2.283 6 3.246V4.5H3H2.25C1.8375 4.5 1.5 4.8375 1.5 5.25C1.5 5.6625 1.8375 6 2.25 6H3V14.25C3 15.4905 4.0095 16.5 5.25 16.5H12.75C13.9905 16.5 15 15.4905 15 14.25V6H15.75C16.1625 6 16.5 5.6625 16.5 5.25C16.5 4.8375 16.1625 4.5 15.75 4.5Z"
        fill="#161518"
      />
    </svg>
  )
}
