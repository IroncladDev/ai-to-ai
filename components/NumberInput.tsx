import { parseAbbrNumber } from "@/lib/numbers"
import { AlertTriangleIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { Input } from "./ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const NumberInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string
    onChange: (value: { abbr: string; value: number }) => void
    required?: boolean
    className?: string
  }
>(({ value, onChange, required, className }, ref) => {
  const [inputValue, setInputValue] = useState(value)

  const isValid = parseAbbrNumber(inputValue).success

  useEffect(() => {
    if (isValid) {
      const { value } = parseAbbrNumber(inputValue) as {
        success: true
        value: number
      }

      onChange({ abbr: inputValue, value })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, inputValue])

  return (
    <Container>
      <Input
        type="string"
        value={inputValue}
        onChange={e =>
          setInputValue(e.target.value.replace(/[^0-9.KMBT%]/g, ""))
        }
        className={className}
        ref={ref}
        required={required}
      />

      {!isValid && (
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertButton>
              <AlertTriangleIcon className="w-4 h-4" />
            </AlertButton>
          </TooltipTrigger>
          <TooltipContent align="center" side="right">
            Invalid abbreviated number value
          </TooltipContent>
        </Tooltip>
      )}
    </Container>
  )
})
NumberInput.displayName = "NumberInput"

const { Container, AlertButton } = {
  Container: styled("div", {
    base: "flex basis-[33px] shrink-0 w-full grow relative items-center"
  }),
  AlertButton: styled("button", {
    base: "absolute right-2 text-amber-500 bg-amber-500/15 hover:bg-amber-500/25 hover:text-amber-400 p-1 rounded-md"
  })
}

export default NumberInput
