import lumeCMS from "cms/mod.ts";
import GitHub from "cms/storage/github.ts";

const username = Deno.env.get("USERNAME")!;
const password = Deno.env.get("PASSWORD")!;
const token = Deno.env.get("GITHUB_TOKEN")!;

const cms = lumeCMS({
  auth: {
    method: "basic",
    users: {
      [username]: password,
    },
  },
});

// Register GitHub storage
cms.storage("gh", GitHub.create("oscarotero/test", token));

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
