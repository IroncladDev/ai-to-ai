"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import * as React from "react"
import { styled } from "react-tailwind-variants"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTriggerBase>,
  React.ComponentPropsWithoutRef<typeof SelectTriggerBase>
>(({ children, ...props }, ref) => (
  <SelectTriggerBase ref={ref} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectTriggerBase>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectTriggerBase = styled(SelectPrimitive.Trigger, {
  base: `flex min-w-36 items-center justify-between border-2 px-4 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-foreground-dimmest [&>span]:line-clamp-1 outline-none`,
  variants: {
    elevated: {
      true: "bg-higher border-outline-dimmer focus:border-accent-dimmer data-[state=open]:border-accent-dimmer",
      false:
        "bg-default border-outline-dimmest focus:border-accent-dimmest data-[state=open]:border-accent-dimmer"
    },
    small: {
      true: "h-8 rounded-md",
      false: "h-10 py-2 rounded-lg"
    }
  }
})

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectScrollButtonBase>,
  React.ComponentPropsWithoutRef<typeof SelectScrollButtonBase>
>((props, ref) => (
  <SelectScrollButtonBase ref={ref} {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectScrollButtonBase>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollButtonBase = styled(SelectPrimitive.ScrollUpButton, {
  base: `flex cursor-default items-center justify-center py-1`
})

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectScrollButtonBase>,
  React.ComponentPropsWithoutRef<typeof SelectScrollButtonBase>
>((props, ref) => (
  <SelectScrollButtonBase ref={ref} {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectScrollButtonBase>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContentBase>,
  React.ComponentPropsWithoutRef<typeof SelectContentBase> & {
    elevated?: boolean
  }
>(({ children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectContentBase ref={ref} position={position} {...props}>
      <SelectScrollUpButton />
      <SelectViewportBase position={position}>{children}</SelectViewportBase>
      <SelectScrollDownButton />
    </SelectContentBase>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectViewportBase = styled(SelectPrimitive.Viewport, {
  base: "p-1",
  variants: {
    position: {
      popper: "h-8 w-full",
      item: "",
      "item-aligned": ""
    }
  },
  defaultVariants: {
    position: "popper"
  }
})

const SelectContentBase = styled(SelectPrimitive.Content, {
  base: "relative z-50 min-w-[8rem] overflow-hidden rounded-lg border-2 text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  variants: {
    elevated: {
      true: "border-accent-dimmer bg-higher",
      false: "border-accent-dimmest bg-default"
    },
    position: {
      popper:
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      item: "",
      "item-aligned": ""
    }
  },
  defaultVariants: {
    position: "popper"
  }
})

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItemBase>,
  React.ComponentPropsWithoutRef<typeof SelectItemBase>
>(({ children, ...props }, ref) => (
  <SelectItemBase ref={ref} {...props}>
    <SelectItemIndicatorContainer>
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectItemIndicatorContainer>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectItemBase>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectItemBase = styled(SelectPrimitive.Item, {
  base: `relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none text-foreground-dimmer focus:bg-highest focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors`
})

const SelectItemIndicatorContainer = styled("span", {
  base: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
})

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue
}
