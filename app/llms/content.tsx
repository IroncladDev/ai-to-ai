"use client"

import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Text from "@/components/ui/text"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { LLMWithRelations, SearchInput } from "../api/search/types"
import LLMItem from "./components/LLMItem"
import LLMOverlay from "./components/LLMOverlay"
import LLMSearchFilter from "./components/LLMSearchFilter"

export default function LLMsPage() {
  const [searchBy, setSearchBy] = useState<SearchInput["searchBy"]>({
    name: true,
    sourceDescription: true,
    fields: true
  })
  const [search, setSearch] = useState<Omit<SearchInput, "searchBy" | "limit">>(
    {
      query: "",
      advanced: false,
      status: "pending",
      skip: 0
    }
  )

  const { data: llms } = useQuery<Array<LLMWithRelations>>({
    queryKey: ["llmSearch", searchBy, search],
    queryFn: async () => {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            searchBy,
            ...search
          })
        })
          .then(res => res.json())
          .catch(err => ({
            success: false,
            error: (err as Error).message
          }))

        if (res.success) {
          return res.data
        } else {
          return []
        }
      } catch (err) {
        console.error(err)

        return []
      }
    },
    placeholderData: keepPreviousData
  })

  return (
    <Container>
      <Content>
        <Header>
          <Text size="h2" weight="bold">
            LLMs
          </Text>
          <HeaderLinks>
            <HeadLink href="/">Home</HeadLink>
            <div className="px-2 h-full">
              <Button size="sm" asChild>
                <HeadLink href="/submit">
                  <PlusIcon className="w-4 h-4" />
                  <Text size="xs">Submit an LLM</Text>
                </HeadLink>
              </Button>
            </div>
          </HeaderLinks>
        </Header>
        <SearchContainer>
          <Input
            placeholder="Search"
            value={search.query}
            onChange={e => setSearch({ ...search, query: e.target.value })}
          />
          <LLMSearchFilter
            search={search}
            searchBy={searchBy}
            setSearch={setSearch}
            setSearchBy={setSearchBy}
          />
        </SearchContainer>
        {(llms || []).map((llm, i) => (
          <LLMItem query={search.query} key={i} llm={llm} />
        ))}
      </Content>
      <LLMOverlay />
    </Container>
  )
}

const { Content, SearchContainer, Header, HeaderLinks, HeadLink } = {
  Content: styled("div", {
    base: "flex flex-col gap-4 max-w-3xl self-center min-h-screen h-full w-full p-4"
  }),
  SearchContainer: styled("div", {
    base: "flex items-center w-full gap-4 justify-between"
  }),
  Header: styled("div", {
    base: "flex items-center gap-4 justify-between pb-4 border-b-2 border-outline-dimmest"
  }),
  HeaderLinks: styled("div", {
    base: "flex items-center gap-4"
  }),
  HeadLink: styled(Link, {
    base: "text-accent-dimmer"
  })
}
