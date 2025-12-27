import { Vla } from "vla"
import { PostsService } from "./posts.service"
import { SessionService } from "./session.service"

export class CreatePost extends Vla.Action {
  postsService = this.inject(PostsService)

  async handle(content: string) {
    await this.postsService.create(content)
  }
}

export class ListPosts extends Vla.Action {
  postsService = this.inject(PostsService)

  async handle() {
    const posts = await this.postsService.list()
    return posts
  }
}

export class CurrentUser extends Vla.Action {
  session = this.inject(SessionService)

  async handle() {
    const user = await this.session.currentSession()
    return user
  }
}
