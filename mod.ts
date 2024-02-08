import cms from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import GitHubStorage from "cms/src/storage/github.ts";

const app = cms();

// Register GitHub storage
app.storage(
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

Deno.serve({
  port: 8000,
  handler: app.init().fetch,
});
