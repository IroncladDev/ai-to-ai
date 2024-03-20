import NumberInput from "@/components/NumberInput"
import { Button } from "@/components/ui/button"
import { Input as InputComponent } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import Text from "@/components/ui/text"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { MetaProperty, MetaPropertyType } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useCombobox } from "downshift"
import { FileMinus2, FilePlus2, XIcon } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import { styled } from "react-tailwind-variants"
import { MetaField } from "../content"

export function MetaFieldRow({
  onChange,
  onDelete,
  metadata,
  field: { value, name, type, property, note }
}: {
  onChange: (args: Partial<MetaField>) => void
  onDelete: () => void
  metadata: Array<MetaField>
  field: MetaField
}) {
  const valueRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLButtonElement>(null)
  const selectValueRef = useRef<HTMLButtonElement>(null)
  const noteRef = useRef<HTMLInputElement>(null)
  const numberInputRef = useRef<HTMLInputElement>(null)

  const { data: results } = useQuery<Array<MetaProperty>>({
    queryKey: ["metadataProperties", name],
    queryFn: async () => {
      const res = await fetch(
        "/api/meta-search?query=" + encodeURIComponent(name)
      )

      return await res.json()
    }
  })

  const items = useMemo(() => {
    const customResult: MetaProperty = {
      id: 0,
      name,
      type,
      useCount: 0,
      createdAt: new Date()
    }

    const filteredResults = results?.filter(
      x => !metadata.some(y => y.property?.id === x.id)
    )

    if (filteredResults && name.length > 2) {
      if (filteredResults.some(r => r.name === name)) return filteredResults

      if (property?.name === name) {
        return filteredResults
      } else {
        return [...filteredResults, customResult]
      }
    } else if (filteredResults) {
      return filteredResults
    } else if (name.length > 2) {
      return [customResult]
    }

    return []
  }, [results, name, metadata, property, type])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items,
    defaultHighlightedIndex: 0,
    inputValue: name,
    onInputValueChange: ({ inputValue }) => {
      onChange({
        name: (inputValue || "")
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
          .replace(/[^\w_]|_/g, match => (match === "_" ? "_" : ""))
          .replace(/_+/g, "_")
      })
    },
    itemToString: item => (item ? item.name : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        if (selectedItem.id === 0) {
          onChange({
            name,
            type: selectedItem.type,
            property: null
          })
          selectRef.current?.focus()
        } else {
          onChange({
            name: selectedItem.name,
            type: selectedItem.type,
            property: selectedItem
          })

          if (selectedItem.type === MetaPropertyType.Boolean) {
            selectValueRef.current?.focus()
          } else if (selectedItem.type === MetaPropertyType.Number) {
            numberInputRef.current?.focus()
          } else {
            valueRef.current?.focus()
          }
        }
      }
    }
  })

  const handleValueChange = (v: MetaPropertyType) => {
    if (property) return

    onChange({
      type: v,
      value:
        v === MetaPropertyType.Boolean
          ? Boolean(value)
          : v === MetaPropertyType.Number
            ? Number(value) || 0
            : String(value)
    })
  }

  useEffect(() => {
    if (typeof note === "string" && noteRef.current) {
      noteRef.current.focus()
    }
  }, [note, noteRef])

  return (
    <>
      <MetaFieldContainer>
        <InputContainer group>
          <Input
            {...getInputProps({ value: name })}
            placeholder="key_name"
            required
            groupItem
          />
          {typeof note === "string" ? null : (
            <Tooltip>
              <TooltipTrigger asChild>
                <AddNoteButton
                  type="button"
                  onClick={() => onChange({ note: "" })}
                >
                  <FilePlus2 className="w-4 h-4" />
                </AddNoteButton>
              </TooltipTrigger>
              <TooltipContent side="right">Add note</TooltipContent>
            </Tooltip>
          )}
        </InputContainer>
        <DownshiftPopover hidden={!isOpen}>
          <ItemsContainer visible={items?.length > 0} {...getMenuProps()}>
            {items.map((item, index) => (
              <Item
                key={index}
                highlighted={highlightedIndex === index}
                {...getItemProps({ item, index })}
              >
                {item.id === 0 ? (
                  <Text size="sm">Create &quot;{item.name}&quot;</Text>
                ) : (
                  <>
                    <Text size="sm">{item.name}</Text>
                    <Text color="dimmer" size="sm">
                      {item.type}
                    </Text>
                    <Text color="dimmest" size="sm">
                      +{item.useCount}
                    </Text>
                  </>
                )}
              </Item>
            ))}
          </ItemsContainer>
          <DownshiftEmpty visible={items?.length === 0}>
            <Text color="dimmer">No results.</Text>
          </DownshiftEmpty>
        </DownshiftPopover>
        <InputContainer>
          <Select
            value={property ? property.type : type}
            disabled={!!property}
            onValueChange={handleValueChange}
          >
            <SelectTypeTrigger ref={selectRef}>
              <SelectValue placeholder="type" />
            </SelectTypeTrigger>
            <SelectContent>
              <SelectItem value={MetaPropertyType.String}>String</SelectItem>
              <SelectItem value={MetaPropertyType.Number}>Number</SelectItem>
              <SelectItem value={MetaPropertyType.Boolean}>Boolean</SelectItem>
            </SelectContent>
          </Select>
        </InputContainer>
        <InputContainer>
          <Select
            value={value ? "true" : "false"}
            onValueChange={value => onChange({ value: value === "true" })}
            required
          >
            <SelectTypeTrigger
              ref={selectValueRef}
              hidden={type !== MetaPropertyType.Boolean}
            >
              <SelectValue placeholder="true" />
            </SelectTypeTrigger>
            <SelectContent>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={String(value)}
            ref={valueRef}
            onChange={e =>
              onChange({
                value: e.target.value
              })
            }
            hidden={type !== MetaPropertyType.String}
            placeholder="value"
            required
          />
          <NumberValueInput
            value={String(value)}
            onChange={({ value }) => onChange({ value })}
            ref={numberInputRef}
            required
            hidden={type !== MetaPropertyType.Number}
          />
        </InputContainer>
        <Button
          className="border border-outline-dimmest rounded-none h-full"
          size="icon"
          type="button"
          onClick={onDelete}
        >
          <XIcon className="w-4 h-4 text-foreground-dimmer" />
        </Button>
      </MetaFieldContainer>
      {typeof note === "string" && (
        <NoteContainer>
          <NoteContent>
            <NoteInput
              value={note}
              onChange={e => onChange({ note: e.target.value })}
              ref={noteRef}
              placeholder="Add note..."
            />
            <RemoveNoteButton
              size="icon"
              type="button"
              onClick={() => onChange({ note: undefined })}
            >
              <FileMinus2 className="w-4 h-4 text-foreground-dimmest" />
            </RemoveNoteButton>
          </NoteContent>
        </NoteContainer>
      )}
    </>
  )
}

const {
  Input,
  NoteInput,
  RemoveNoteButton,
  NoteContainer,
  NoteContent,
  AddNoteButton,
  MetaFieldContainer,
  InputContainer,
  SelectTypeTrigger,
  DownshiftPopover,
  DownshiftEmpty,
  ItemsContainer,
  Item,
  NumberValueInput
} = {
  MetaFieldContainer: styled("div", {
    base: "flex items-center w-full relative border-x first:border-t last:border-b border-outline-dimmest"
  }),
  InputContainer: styled("div", {
    base: "grow shrink-0 basis-0 w-full !inline-block relative",
    variants: {
      group: {
        true: "group"
      }
    }
  }),
  DownshiftPopover: styled("div", {
    base: "w-full max-w-xs rounded-lg border-2 border-outline-dimmer absolute top-12 left-0 bg-default z-10 shadow-lg z-30"
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
    base: "flex gap-2 justify-between px-2 py-1 first:rounded-t-md last:rounded-b-md",
    variants: {
      highlighted: {
        true: "bg-higher"
      }
    }
  }),
  DownshiftEmpty: styled("div", {
    base: "gap-2 p-2 items-center justify-center hidden",
    variants: {
      visible: {
        true: "flex"
      }
    }
  }),
  NoteContainer: styled("div", {
    base: "flex w-full border-y border-l border-outline-dimmest"
  }),
  NoteContent: styled("div", {
    base: "flex justify-start h-6 relative w-[calc(100%/3+32px/3*2)] border-x border-outline-dimmest"
  }),
  Input: styled(InputComponent, {
    base: "grow shrink-0 basis-0 rounded-none border",
    variants: {
      groupItem: {
        true: "group/item"
      },
      hidden: {
        true: "hidden"
      }
    }
  }),
  SelectTypeTrigger: styled(SelectTrigger, {
    base: "grow shrink-0 basis-0 rounded-none border w-full",
    variants: {
      hidden: {
        true: "hidden"
      }
    }
  }),
  AddNoteButton: styled("button", {
    base: "absolute right-2 top-1/2 -translate-y-1/2 flex p-1 rounded text-foreground-dimmest hidden group-focus-within:block z-10"
  }),
  NoteInput: styled(InputComponent, {
    base: "grow shrink-0 basis-0 rounded-none border h-full text-xs text-foreground-dimmer border-0 outline outline-outline-dimmest focus:outline-accent-dimmer z-20"
  }),
  RemoveNoteButton: styled(Button, {
    base: "rounded-none h-full z-10 border-r border-l-2 border-y-0 hover:border-outline-dimmest"
  }),
  NumberValueInput: styled(NumberInput, {
    base: "border rounded-none grow shrink-0 basis-0 w-full",
    variants: {
      hidden: {
        true: "hidden"
      }
    }
  })
}
