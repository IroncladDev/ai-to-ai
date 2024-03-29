"use client"

import { Container } from "@/components/container"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { User, VoteStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, GithubIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { updatePendingContributor } from "./actions/update-pending-contributor"

export default function AdminPage({ waitlist }: { waitlist: Array<User> }) {
  const [users, setUsers] = useState(waitlist)

  return (
    <Container>
      <Navbar />
      <Content>
        <Text size="h2" weight="bold" center>
          Contributor Waitlist
        </Text>
        <Text multiline color="dimmer" center className="self-center max-w-md">
          Users who have signed up for to be a contributor. Approving or
          rejecting a user will send them an email. Avoid rejecting users unless
          they have malicious projects on their Github account.
        </Text>
        <UserContainer>
          {users.map((user, i) => (
            <UserRow key={i} user={user} setUsers={setUsers} />
          ))}
        </UserContainer>
      </Content>
    </Container>
  )
}

const UserRow = ({
  user,
  setUsers
}: {
  user: User
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) => {
  const submit = async (status: VoteStatus) => {
    const res = await updatePendingContributor({
      status,
      userId: user.id
    })

    if (res.success) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } else {
      alert(res.message)
    }
  }

  return (
    <UserRowContainer>
      <UserRowStart>
        <Button asChild variant="highlight" size="sm">
          <a href={"https://github.com/" + user.handle} target="_blank">
            <GithubIcon size={16} />
            <Text>{user.handle}</Text>
            <ExternalLink size={16} />
          </a>
        </Button>
        <Text color="dimmest">
          Updated {formatDistanceToNow(user.updatedAt)} ago
        </Text>
      </UserRowStart>
      <Button
        onClick={() => submit(VoteStatus.approve)}
        variant="highlight"
        size="sm"
      >
        Approve
      </Button>
      <Button
        type="button"
        onClick={() => submit(VoteStatus.reject)}
        variant="outline"
        size="sm"
      >
        Reject
      </Button>
    </UserRowContainer>
  )
}

const { Content, UserRowContainer, UserRowStart, UserContainer } = {
  Content: styled("div", {
    base: "flex flex-col gap-2 max-w-2xl self-center h-full w-full py-8"
  }),
  UserRowContainer: styled("div", {
    base: "flex gap-2 items-center py-2"
  }),
  UserRowStart: styled("div", {
    base: "flex grow items-center gap-2"
  }),
  UserContainer: styled("div", {
    base: "flex flex-col grow divide-y divide-outline-dimmest"
  })
}
