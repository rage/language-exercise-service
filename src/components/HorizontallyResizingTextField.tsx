import React, { useState, useRef, useEffect, InputHTMLAttributes } from "react"
import { css, cx } from "@emotion/css"

interface HorizontoallyResizingTextFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const HorizontoallyResizingTextField: React.FC<
  HorizontoallyResizingTextFieldProps
> = ({ onChange, style, value: propValue, className, ...props }) => {
  const [inputValue, setInputValue] = useState(propValue?.toString() || "")
  const spanRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth
      inputRef.current.style.width = `${width + 20}px`
    }
  }, [inputValue])

  useEffect(() => {
    if (propValue !== undefined) {
      setInputValue(propValue.toString())
    }
  }, [propValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    onChange?.(e)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={cx(className)}
        style={{ ...style }}
        {...props}
      />
      <span
        ref={spanRef}
        className={css`
          visibility: hidden;
          position: absolute;
          white-space: pre;
          font-size: 16px;
          font-family: inherit;
        `}
      >
        {inputValue}
      </span>
    </>
  )
}

export default HorizontoallyResizingTextField
