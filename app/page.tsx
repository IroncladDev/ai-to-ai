"use client"

import { Container } from "@/components/container"
import gr from "@/lib/gradients"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"
import Selector from "./home/selector"

export default function Page() {
  return (
    <Content
      style={{
        background: gr.merge(
          gr.radial(
            "circle at 75% 110%",
            tokens.colors.default,
            tokens.colors.default + " 25%",
            tokens.colors.transparent + " 70%",
            tokens.colors.transparent
          )
        )
      }}
    >
      <SelectorContainer>
        <Selector />
      </SelectorContainer>
    </Content>
  )
}

const { Content, SelectorContainer } = {
  Content: styled(Container, {
    base: "flex flex-row h-screen"
  }),
  SelectorContainer: styled("div", {
    base: "flex flex-col items-center justify-center grow p-4"
  })
}
