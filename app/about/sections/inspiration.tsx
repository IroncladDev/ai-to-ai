import Text from "@/components/ui/text"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"

export default function Inspiration() {
  return (
    <Container
      style={{
        backgroundImage: gr.merge(
          gr.radial(
            "circle at 0% 50%",
            tokens.colors.accent.dimmest + "45",
            tokens.colors.accent.dimmest + "15 20%",
            tokens.colors.transparent + " 50%",
            tokens.colors.transparent
          ),
          gr.radial(
            "circle at 100% 50%",
            tokens.colors.accent.dimmest + "45",
            tokens.colors.accent.dimmest + "15 20%",
            tokens.colors.transparent + " 50%",
            tokens.colors.transparent
          ),
          gr.linear(
            0,
            tokens.colors.root,
            tokens.colors.root + " 30%",
            tokens.colors.accent.dimmest + "15",
            tokens.colors.accent.dimmest + "45",
            tokens.colors.accent.dimmest + "15",
            tokens.colors.root + " 70%",
            tokens.colors.root
          )
        )
      }}
    >
      <Content>
        <Text size="h1" weight="bold" center className="leading-tight">
          Inspiration
        </Text>
        <Text multiline paragraph color="dimmer" size="lg">
          <a
            href="https://x.com/amasad"
            target="_blank"
            className="text-accent"
          >
            Amjad Masad
          </a>{" "}
          wanted a way to compare different LLMs, somewhat like AKC&apos;s{" "}
          <a
            href="https://www.akc.org/compare-breeds/"
            target="_blank"
            className="text-accent"
          >
            dog breed comparison
          </a>{" "}
          tool.
        </Text>
        <Text multiline paragraph color="dimmer" size="lg">
          After some brainstorming, I decided to build a system similar to{" "}
          <a
            href="https://help.twitter.com/en/using-x/community-notes"
            target="_blank"
            className="text-accent"
          >
            Community Notes
          </a>{" "}
          where community approval was required to ensure accurate information
          and prevent abuse/spam.
        </Text>
        <Text multiline paragraph color="dimmer" size="lg">
          The UI design approach I took was heavily inspired by{" "}
          <a href="https://raycast.com" target="_blank" className="text-accent">
            Raycast
          </a>
          .
        </Text>
      </Content>
    </Container>
  )
}

const { Container, Content } = {
  Container: styled("div", {
    base: "flex flex-col grow border-t-2 border-default justify-center items-center min-h-screen"
  }),
  Content: styled("div", {
    base: "flex flex-col gap-4 p-4"
  })
}
