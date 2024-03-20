import { LLMWithMetadata } from "@/app/compare/state"
import { Brain, Hexagon, Play, Volume2 } from "lucide-react"
import { styled } from "react-tailwind-variants"

export default function LLMIcon({
  llm,
  ...props
}: { llm: LLMWithMetadata } & React.ComponentPropsWithoutRef<
  typeof IconWrapper
>) {
  let icon: React.ReactNode = <Hexagon />

  // Hardcoded value for use case temporarily
  let useCase =
    llm.fields.find(
      x =>
        x.metaProperty.name === "use_case" || x.metaProperty.name === "usecase"
    )?.value || null

  if (useCase === null) {
    /* no-op */
  } else if (/multimodal/i.test(useCase)) {
    icon = <Brain />
  } else if (/video/i.test(useCase)) {
    icon = <Play />
  } else if (/audio/i.test(useCase)) {
    icon = <Volume2 />
  }

  // TODO: Add more icons and checks for stuff like "recognition"

  return (
    <IconWrapper asChild {...props}>
      {icon}
    </IconWrapper>
  )
}

const IconWrapper = styled("div", {
  base: "text-accent-dimmer",
  variants: {
    color: {
      accent: "text-accent-dimmer",
      default: "text-foreground",
      dimmer: "text-foreground-dimmer",
      dimmest: "text-foreground-dimmest"
    },
    size: {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12"
    }
  },
  defaultVariants: {
    color: "accent",
    size: "md"
  }
})
