import cms from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import { GitHubStorage } from "cms/src/storage/github.ts";
import { basicAuth } from "hono/middleware.ts";

const app = cms({
  middlewares: [
    basicAuth({
      username: Deno.env.get("USERNAME")!,
      password: Deno.env.get("PASSWORD")!,
    }),
  ],
});

// Register GitHub storage
app.store(
  "gh",
  new GitHubStorage({
    client: new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") }),
    owner: "oscarotero",
    repo: "test",
  }),
);

// Configure an upload folder
app.upload("uploads", "gh:uploads");

// Configure a collection
app.collection(
  "posts",
  "gh",
  [
    "title: text",
    {
      name: "summary",
      type: "textarea",
      attributes: {
        required: true,
      },
    },
    {
      name: "image",
      type: "file",
      uploads: "uploads",
      attributes: {
        accept: "image/*",
      },
    },
    "tags: list",
    "draft: checkbox",
    "show_toc: checkbox",
    "content: markdown",
  ],
);

app.serve();
