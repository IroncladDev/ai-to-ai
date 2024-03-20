import { Input } from "@/components/ui/input"
import Text from "@/components/ui/text"
import { useQuery } from "@tanstack/react-query"
import { useCombobox } from "downshift"
import { Hexagon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { LLMWithMetadata } from "./state"

export default function LLMSearch({
  llms,
  setLLMs,
  ...props
}: {
  llms: Array<LLMWithMetadata>
  setLLMs: (llms: Array<LLMWithMetadata>) => void
} & Omit<React.ComponentProps<typeof Input>, "size">) {
  const [search, setSearch] = useState("")

  const { data: results } = useQuery<Array<LLMWithMetadata>>({
    queryKey: ["llmCompareSearch", search],
    queryFn: async () => {
      const searchUrl = new URL("/compare/search", window.location.href)

      if (search) searchUrl.searchParams.set("query", search)

      if (llms.length > 0)
        searchUrl.searchParams.set("exclude", llms.map(x => x.id).join(","))

      const res = await fetch(searchUrl)

      return await res.json()
    }
  })

  const sortSelected = (llm: LLMWithMetadata) =>
    llms.some(x => x.id === llm.id) ? 1 : -1

  const items = results?.sort((a, b) => sortSelected(b) - sortSelected(a)) || []

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    reset
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0,
    onInputValueChange: ({ inputValue }) => {
      if (typeof inputValue === "string") setSearch(inputValue)
    },
    itemToString: item => (item ? item.name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        if (llms.some(x => x.id === selectedItem.id)) {
          setLLMs(llms.filter(x => x.id !== selectedItem.id))
        } else {
          setLLMs([...llms, selectedItem])
        }
        setInputValue("")
        reset()
      }
    }
  })

  return (
    <Search>
      <Input {...getInputProps(props)} />
      <DownshiftPopover hidden={!isOpen}>
        <ItemsContainer visible={items.length > 0} {...getMenuProps()}>
          {items.map((item, index) => (
            <Item
              key={index}
              highlighted={highlightedIndex === index}
              {...getItemProps({ item, index })}
            >
              <ItemInfo>
                <ItemIcon selected={llms.some(x => x.id === item.id)} />
                <Text color="dimmer">{item.name}</Text>
              </ItemInfo>
              <Text color="dimmest">{item.fields.length} fields</Text>
            </Item>
          ))}
        </ItemsContainer>

        {items.length === 0 && (
          <EmptyState>
            <Text color="dimmer">No results</Text>
          </EmptyState>
        )}
      </DownshiftPopover>
    </Search>
  )
}

const {
  Search,
  DownshiftPopover,
  ItemsContainer,
  Item,
  ItemInfo,
  ItemIcon,
  EmptyState
} = {
  Search: styled("div", {
    base: "flex relative basis-0 w-full min-w-0 grow"
  }),
  DownshiftPopover: styled("div", {
    base: "w-full rounded-lg border-2 border-outline-dimmer/75 absolute top-12 left-0 bg-default z-10 shadow-lg"
  }),
  ItemsContainer: styled("ul", {
    base: "flex-col hidden",
    variants: {
      visible: {
        true: "flex"
      }
    }
  }),
  Item: styled("li", {
    base: "flex gap-2 justify-between p-2 first:rounded-t-md last:rounded-b-md",
    variants: {
      highlighted: {
        true: "bg-higher"
      }
    }
  }),
  ItemInfo: styled("div", {
    base: "flex gap-2 items-center"
  }),
  ItemIcon: styled(Hexagon, {
    base: "w-4 h-4",
    variants: {
      selected: {
        true: "text-accent-dimmer fill-accent-dimmest/50",
        false: "text-foreground-dimmest"
      }
    }
  }),
  EmptyState: styled("div", {
    base: "flex justify-center items-center p-4"
  })
}
