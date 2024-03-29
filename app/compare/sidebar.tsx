import OverflowScroll from "@/components/overflow"
import { useCurrentUser } from "@/components/providers/CurrentUserProvider"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { UserRole } from "@prisma/client"
import { Hexagon, PlusIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { styled } from "react-tailwind-variants"
import LLMSearch from "./search"
import { useCompareState } from "./state"

export default function Sidebar() {
  const currentUser = useCurrentUser()
  const {
    llms,
    sidebar: open,
    setLLMs,
    setSidebar: setOpen
  } = useCompareState()

  return (
    <Container>
      <Content>
        <Header>
          <LLMSearch
            llms={llms}
            setLLMs={setLLMs}
            placeholder="Find an LLM..."
            id="llm-sidebar-search"
          />
          {open && (
            <Button
              size="icon"
              onClick={() => setOpen(false)}
              variant="ghost"
              className="bg-root md:hidden"
              aria-label="Close Sidebar"
            >
              <XIcon className="text-foreground-dimmer w-4 h-4" />
            </Button>
          )}
        </Header>

        <OverflowScroll>
          {llms.length > 0 ? (
            <SelectedLLMs>
              {llms.map(llm => (
                <SelectedLLM key={llm.id}>
                  <SelectedLLMName>
                    <Hexagon className="w-4 h-4 text-accent-dimmer fill-accent-dimmest/50" />
                    <Text color="dimmer">{llm.name}</Text>
                  </SelectedLLMName>
                  <RemoveSelectedLLMButton
                    onClick={() => {
                      setLLMs(llms.filter(l => l.id !== llm.id))
                    }}
                  >
                    <XIcon className="w-4 h-4" />
                  </RemoveSelectedLLMButton>
                </SelectedLLM>
              ))}
              <Button asChild className="mt-2">
                <label htmlFor="llm-sidebar-search">
                  <PlusIcon />
                  <Text>Add another LLM</Text>
                </label>
              </Button>
            </SelectedLLMs>
          ) : (
            <EmptyContainer>
              <Text color="dimmest">No LLMs selected</Text>
              <Button asChild>
                <label htmlFor="llm-sidebar-search">
                  <PlusIcon className="w-4 h-4" />
                  <Text color="dimmer">Find an LLM</Text>
                </label>
              </Button>
            </EmptyContainer>
          )}
        </OverflowScroll>
      </Content>
      <Footer>
        <FooterSection>
          <Text weight="bold" size="lg">
            AI to AI
          </Text>
          <Text multiline color="dimmer">
            Create beautiful side-by-side LLM Comparisons
          </Text>
        </FooterSection>
        <FooterSection>
          <FooterLinks>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink
              href="/contribute"
              hidden={
                currentUser?.role === "contributor" ||
                currentUser?.role === "admin"
              }
            >
              Contribute
            </FooterLink>
            <FooterLink href="/login" hidden={!!currentUser}>
              Log In
            </FooterLink>
            <FooterLink
              href="/llms"
              hidden={
                !currentUser ||
                (currentUser?.role !== UserRole.admin &&
                  currentUser?.role !== UserRole.contributor)
              }
            >
              LLMs
            </FooterLink>
            <FooterLink
              href="/submit"
              hidden={
                !currentUser ||
                (currentUser?.role !== UserRole.admin &&
                  currentUser?.role !== UserRole.contributor)
              }
            >
              Submit an LLM
            </FooterLink>
            <FooterLink
              href="/admin"
              hidden={!currentUser || currentUser?.role !== UserRole.admin}
            >
              Admin
            </FooterLink>
            <FooterLink
              href="https://github.com/IroncladDev/ai-to-ai"
              target="_blank"
            >
              Github
            </FooterLink>
          </FooterLinks>
        </FooterSection>
        <FooterSection>
          <Text color="dimmest">
            &copy;{" "}
            <a
              href="https://connerow.dev"
              target="_blank"
              className="text-accent-dimmer"
            >
              IroncladDev
            </a>{" "}
            2024
            {new Date().getFullYear() > 2024
              ? "-" + new Date().getFullYear()
              : ""}
          </Text>
        </FooterSection>
      </Footer>
    </Container>
  )
}

const {
  Header,
  Content,
  Footer,
  FooterSection,
  FooterLinks,
  FooterLink,
  Container,
  SelectedLLMs,
  SelectedLLM,
  SelectedLLMName,
  RemoveSelectedLLMButton,
  EmptyContainer
} = {
  Header: styled("div", {
    base: "flex items-center gap-2"
  }),
  Content: styled("div", {
    base: "flex flex-col gap-4 p-4 grow"
  }),
  Footer: styled("footer", {
    base: "flex flex-col divide-y divide-outline-dimmer px-4 bg-default/50 border-t-2 border-outline-dimmest"
  }),
  FooterSection: styled("div", {
    base: "flex flex-col gap-2 py-4"
  }),
  FooterLinks: styled("div", {
    base: "flex gap-4 items-center justify-center w-full"
  }),
  FooterLink: styled(Link, {
    base: "text-accent-dimmer text-sm"
  }),
  Container: styled("div", {
    base: "flex flex-col grow"
  }),
  SelectedLLMs: styled("div", {
    base: "flex flex-col gap-2"
  }),
  SelectedLLM: styled("div", {
    base: "flex gap-2 items-center border-2 bg-default/50 border-outline-dimmest/50 rounded-md text-foreground-dimmer"
  }),
  SelectedLLMName: styled("div", {
    base: "flex gap-2 items-center p-2 grow h-full"
  }),
  RemoveSelectedLLMButton: styled("button", {
    base: "p-2 h-full"
  }),
  EmptyContainer: styled("div", {
    base: "flex flex-col gap-4 p-4 items-center justify-center grow w-full border-2 border-dashed border-outline-dimmest rounded-lg"
  })
}
