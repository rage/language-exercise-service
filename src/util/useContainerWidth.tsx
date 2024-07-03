import { useEffect, useMemo, useRef, useState } from "react"

const useContainerWidth = (): [React.RefObject<HTMLDivElement>, number] => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(Infinity)

  useEffect(() => {
    const currentContainer = containerRef.current
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize: width } = entry.contentBoxSize[0]
        setWidth(width)
      }
    })

    if (currentContainer) {
      resizeObserver.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer)
      }
    }
  }, [])

  const cachedWidth = useMemo(() => width, [width])

  return [containerRef, cachedWidth]
}

export default useContainerWidth
