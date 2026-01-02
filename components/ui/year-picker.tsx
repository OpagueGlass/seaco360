"use client"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

const DEFAULT_MIN_YEAR = 1950
const CURRENT_YEAR = new Date().getFullYear()

export interface YearPickerProps {
  value?: number
  onChange?: (year: number) => void
  minYear?: number
  maxYear?: number
  placeholder?: string
  className?: string
  disabled?: boolean
}

/**
 * A year-only date picker component built with shadcn/ui.
 * Displays a grid of years organized by decades for easy navigation.
 *
 * @example
 * ```tsx
 * const [year, setYear] = React.useState<number>()
 *
 * <YearPicker
 *   value={year}
 *   onChange={setYear}
 *   placeholder="Select year"
 * />
 * ```
 */
export function YearPicker({
  value,
  onChange,
  minYear = DEFAULT_MIN_YEAR,
  maxYear = CURRENT_YEAR,
  placeholder = "Select year",
  className,
  disabled = false,
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [decadeStart, setDecadeStart] = React.useState(() => {
    const currentYear = value || Math.min(maxYear, CURRENT_YEAR)
    return Math.floor(currentYear / 10) * 10
  })

  // Generate 12 years: 1 from previous decade, 10 from current, 1 from next
  const years = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i)
  }, [decadeStart])

  const handlePreviousDecade = () => {
    setDecadeStart((prev) => prev - 10)
  }

  const handleNextDecade = () => {
    setDecadeStart((prev) => prev + 10)
  }

  const handleYearSelect = (year: number) => {
    onChange?.(year)
    setOpen(false)
  }

  const effectiveMaxYear = Math.min(maxYear, CURRENT_YEAR)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn("w-[200px] justify-between text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <span className="flex items-center">
            {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
            {value ? value : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3" align="start">
        <div className="flex items-center justify-between mb-3">
            
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={handlePreviousDecade}
            disabled={decadeStart < minYear}
            aria-label="Previous decade"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {decadeStart} - {decadeStart + 9}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={handleNextDecade}
            disabled={decadeStart + 10 > effectiveMaxYear}
            aria-label="Next decade"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2" role="listbox" aria-label="Select year">
          {years.map((year) => {
            const isOutOfRange = year < minYear || year > effectiveMaxYear
            const isSelected = value === year

            return (
              <Button
                key={year}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                role="option"
                aria-selected={isSelected}
                className={cn("h-9", isOutOfRange && "text-muted-foreground opacity-50 pointer-events-none")}
                onClick={() => handleYearSelect(year)}
                disabled={isOutOfRange}
              >
                {year}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
