import { Vla } from "vla"
import { AppContext } from "./context"
import { PostsService } from "./posts.service"
import { SessionService } from "./session.service"

export class CreatePost extends Vla.Action {
  postsService = this.inject(PostsService)
  appCtx = this.inject(AppContext)

  async handle() {
    const body = this.appCtx.ctx.request.body as Record<string, string>
    const content = body.content || ""
    await this.postsService.create(content)
    this.appCtx.ctx.redirect("/")
  }
}

export class ShowHome extends Vla.Action {
  postsService = this.inject(PostsService)
  session = this.inject(SessionService)
  appCtx = this.inject(AppContext)

  async handle() {
    const posts = await this.postsService.list()
    const user = await this.session.currentSession()

    await this.appCtx.ctx.render("index", { posts, user })
    return posts
  }
}

export class ApiListPosts extends Vla.Action {
  postsService = this.inject(PostsService)
  appCtx = this.inject(AppContext)

  async handle() {
    const posts = await this.postsService.list()
    this.appCtx.ctx.body = { data: posts }
  }
}
