import lumeCMS from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import GitHubStorage from "cms/storage/github.ts";
import blocks from "cms/fields/blocks.ts";

const cms = lumeCMS();

// Register GitHub storage
cms.storage(
  "gh",
  new GitHubStorage({
    client: new Octokit({ auth: Deno.env.get("GITHUB_TOKEN") }),
    owner: "oscarotero",
    repo: "test",
  }),
);

cms.use(blocks());

// Configure an upload folder
cms.upload("uploads", "gh:uploads");

// Configure a collection
cms.collection(
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
    "blocks: blocks",
    "content: markdown",
  ],
);

export default cms;
