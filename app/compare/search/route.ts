import prisma from "@/lib/server/prisma"
import { LLMStatus, Prisma } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams
    const query = searchParams.get("query") || ""
    const exclude = searchParams.get("exclude") || ""

    const idsToExclude = exclude
      ? exclude.split(",").map(Number).filter(Boolean)
      : []

    const results = await prisma.lLM.findMany({
      where: {
        status: LLMStatus.approved,
        id: {
          notIn: idsToExclude
        },
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            sourceDescription: {
              contains: query,
              mode: "insensitive"
            }
          },
          {
            fields: {
              some: {
                metaProperty: {
                  name: {
                    contains: query,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        ].filter(Boolean) as Array<Prisma.LLMWhereInput>
      },
      take: 10,
      include: {
        fields: {
          include: {
            metaProperty: true
          }
        }
      }
    })

    return Response.json(results)
  } catch (err) {
    console.error(err)

    return Response.json([])
  }
}

export const dynamic = "force-dynamic"
