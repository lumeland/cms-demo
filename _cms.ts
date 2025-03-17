import lumeCMS from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import GitHubStorage from "cms/storage/github.ts";

const username = Deno.env.get("USERNAME")!;
const password = Deno.env.get("PASSWORD")!;

const cms = lumeCMS({
  auth: {
    method: "basic",
    users: {
      [username]: password,
    },
  },
});

// Register GitHub storage
cms.storage(
  "gh",
  new GitHubStorage({
    client: new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") }),
    owner: "oscarotero",
    repo: "test",
  }),
);

// Configure an upload folder
cms.upload("uploads", "gh:uploads");

// Configure collection
cms.collection(
  "posts",
  "gh:*.md",
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

export default cms;
