import cms from "cms/mod.ts";
import { Octokit } from "npm:octokit";
import GitHubStorage from "cms/storage/github.ts";

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

app.field("blocks", {
  tag: "f-blocks",
  jsImport: `lume_cms/components/f-blocks.js`,
  applyChanges(data, changes, field) {
    if (field.name in changes) {
      const value = changes[field.name];

      if (!value && !field.attributes?.required) {
        delete data[field.name];
      } else {
        data[field.name] = value;
      }
    }
  },
});

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
    "blocks: blocks",
    "content: markdown",
  ],
);

Deno.serve({
  port: 8000,
  handler: app.init().fetch,
});
