import { createFileRoute, useRouter } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { CreatePost, CurrentUser, ListPosts } from "../data/home.actions"

const getPostsFn = createServerFn({ method: "GET" }).handler(async () => {
  const [posts, user] = await Promise.all([
    ListPosts.invoke(),
    CurrentUser.invoke(),
  ])

  return { posts, user }
})

const createPostFn = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    await CreatePost.invoke(data)
    return {}
  })

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getPostsFn(),
})

function Home() {
  const router = useRouter()
  const { posts, user } = Route.useLoaderData()
  const [content, setContent] = useState("")
  const [_isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await createPostFn({ data: content })
      await router.invalidate()
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <small className="example-label">TanStack Start Example</small>
      <h1>Posts</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="What's on your mind?"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
        {" • "}
        <small>Post as: {user ? user.name : "(new user)"}</small>
      </form>

      <hr />

      {posts.length === 0 ? (
        <h2 className="no-posts">No posts yet</h2>
      ) : (
        <div>
          {posts.map((post) => (
            <article key={post.id}>
              <small>From {post.from.name}</small>
              <p>{post.content}</p>
              <small>
                {new Date(post.createdAt).toISOString()} • ID: {post.id}
              </small>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
