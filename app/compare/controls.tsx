import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Text from "@/components/ui/text"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  MenuIcon
} from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { FieldSort, FilterType, filterOptions, useCompareState } from "./state"

const sortLabels: Record<FieldSort, string> = {
  "alpha-asc": "Alphabetical (A-Z)",
  "alpha-desc": "Alphabetical (Z-A)",
  "value-asc": "Value (Low-High)",
  "value-desc": "Value (High-Low)",
  default: "Unsorted"
}

export default function Controls() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const {
    view,
    sort,
    filter,
    setFilterValue,
    sidebar,
    setSidebar,
    setView,
    setSort
  } = useCompareState(
    ({
      view,
      sort,
      filter,
      setFilterValue,
      sidebar,
      setSidebar,
      setView,
      setSort
    }) => ({
      view,
      sort,
      filter,
      setFilterValue,
      sidebar,
      setSidebar,
      setView,
      setSort
    })
  )

  return (
    <ControlsContainer>
      <SidebarButton
        size="icon"
        onClick={() => setSidebar(!sidebar)}
        aria-label="Open Sidebar"
      >
        <MenuIcon className="w-4 h-4 text-foreground-dimmer" />
      </SidebarButton>
      <ControlItem className="max-sm:hidden">
        <Text weight="medium" color="dimmest" size="xs">
          View
        </Text>
        <OptionsContainer>
          <OptionButton
            selected={view === "list"}
            onClick={() => setView("list")}
          >
            <ListIcon size={16} />
            <Text size="xs" color="inherit">
              List
            </Text>
          </OptionButton>
          <OptionButton
            selected={view === "grid"}
            onClick={() => setView("grid")}
          >
            <GridIcon size={16} />
            <Text size="xs" color="inherit">
              Grid
            </Text>
          </OptionButton>
        </OptionsContainer>
      </ControlItem>
      <ControlItem>
        <Text weight="medium" color="dimmest" size="xs">
          Filter
        </Text>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" aria-label="Filter">
              <FilterIcon className="w-4 h-4 text-foreground-dimmer" />
              <Text size="xs" color="dimmer">
                ({filter.length})
              </Text>
              {isFilterOpen ? (
                <ChevronDownIcon className="w-4 h-4 text-foreground-dimmer" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-foreground-dimmer" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2" align="start">
            {Object.entries(filterOptions).map(([key, label], i) => (
              <label key={i} className="flex gap-2 items-center">
                <Checkbox
                  checked={filter.includes(key as FilterType)}
                  onCheckedChange={checked =>
                    setFilterValue(key as FilterType, Boolean(checked))
                  }
                />
                <Text size="xs">{label}</Text>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </ControlItem>
      <ControlItem>
        <Text weight="medium" color="dimmest" size="xs">
          Sort
        </Text>
        <Select
          value={sort}
          onValueChange={value => setSort(value as FieldSort)}
        >
          <SelectTrigger small aria-label="Sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sortLabels).map(([key, label], i) => (
              <SelectItem value={key} key={i}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ControlItem>
    </ControlsContainer>
  )
}

const {
  ControlsContainer,
  SidebarButton,
  ControlItem,
  OptionsContainer,
  OptionButton
} = {
  ControlsContainer: styled("div", {
    base: "flex gap-8 max-sm:gap-4 p-4 max-sm:overflow-x-auto max-w-screen max-sm:w-screen bg-root/50 border-b-2 border-outline-dimmest justify-center relative"
  }),
  SidebarButton: styled(Button, {
    base: "md:hidden shrink-0 self-center absolute left-4"
  }),
  ControlItem: styled("div", {
    base: "flex flex-col gap-1 h-full justify-between"
  }),
  OptionsContainer: styled("div", {
    base: "flex gap-2"
  }),
  OptionButton: styled("button", {
    base: "py-1.5 px-2 rounded-md hover:bg-highest flex gap-1 items-center",
    variants: {
      selected: {
        true: "bg-higher text-foreground",
        false: "text-foreground-dimmer"
      }
    }
  })
}
