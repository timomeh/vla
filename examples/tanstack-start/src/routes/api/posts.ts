import { createFileRoute } from "@tanstack/react-router"
import { ListPosts } from "../../data/home.actions"

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await ListPosts.invoke()
        return Response.json({ data: posts })
      },
    },
  },
})
