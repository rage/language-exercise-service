import React, { useState } from "react"
import styled from "@emotion/styled"

interface CollapsableProps {
  title: string
  children: React.ReactNode
  initiallyExpanded?: boolean
}

const CollapsableContainer = styled.div<{ isExpanded: boolean }>`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  ${(props) => props.isExpanded && "border: 2px solid #ccc;"}
`

const CollapsableHeader = styled.div<{ isExpanded: boolean }>`
  background-color: #f0f0f0;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #e0e0e0;
  }

  &::after {
    content: "${(props) => (props.isExpanded ? "▼" : "▶")}";
    font-size: 12px;
  }
`

const CollapsableContent = styled.div<{ isExpanded: boolean }>`
  padding: 1.5rem;
  display: ${(props) => (props.isExpanded ? "block" : "none")};
`

const Collapsable: React.FC<CollapsableProps> = ({
  title,
  children,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <CollapsableContainer isExpanded={isExpanded}>
      <CollapsableHeader isExpanded={isExpanded} onClick={toggleExpand}>
        {title}
      </CollapsableHeader>
      <CollapsableContent isExpanded={isExpanded}>
        {children}
      </CollapsableContent>
    </CollapsableContainer>
  )
}

export default Collapsable
