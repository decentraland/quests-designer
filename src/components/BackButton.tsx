import React from "react"

import { Back } from "decentraland-ui/dist/components/Back/Back"
import { Button } from "decentraland-ui/dist/components/Button/Button"

export const BackButton = ({ onClick }: { onClick: () => void }) => {
  return <Button content={<Back />} onClick={onClick} className="back-btn" />
}
