import cms from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import { GhDataStorage, GhFileStorage } from "cms/src/storage/github.ts";
import { basicAuth } from "hono/middleware.ts";

const app = cms({
  middlewares: [
    basicAuth({
      username: Deno.env.get("USERNAME")!,
      password: Deno.env.get("PASSWORD")!,
    }),
  ],
});

const octokit = new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") });

// Create a new storage for the data
app.data(
  "fs",
  new GhDataStorage({
    client: octokit,
    owner: "oscarotero",
    repo: "test",
  }),
);

// Create a new storage for the uploads
app.files(
  "uploads",
  new GhFileStorage({
    client: octokit,
    owner: "oscarotero",
    repo: "test",
    path: "uploads",
  }),
);

app.collection(
  "posts",
  "fs",
  [
    "title: text",
    {
      name: "summary",
      type: "textarea",
      attributes: {
        required: true,
      },
    },
    "tags: list",
    "draft: checkbox",
    "show_toc: checkbox",
    "content: markdown",
  ],
);

app.serve();
