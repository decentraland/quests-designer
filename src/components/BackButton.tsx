import React from "react"
import { Back, Button } from "decentraland-ui"

export const BackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button 
      content={
        <Back />
      }
      onClick={onClick}
      className="back-btn"
    />
  )
}