import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createPost } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;
type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

const NewPost = () => {
  const errors = useActionData();
  return (
    <>
      <h2>create a new post</h2>
      <Form method="post">
        <p>
          <label>
            Post Title: {""}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input type="text" name="title" className={inputClassName}></input>
          </label>
        </p>
        <p>
          <label>
            Post slug: {""}
            {errors?.slug ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input type="text" name="slug" className={inputClassName}></input>
          </label>
        </p>
        <p>
          <label htmlFor="markdown">create markdown: </label>
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
          <br />
          <textarea
            id="markdown"
            name="markdown"
            rows={20}
            className={`${inputClassName} font-mono`}
          />
        </p>

        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          create post
        </button>
      </Form>
    </>
  );
};

export default NewPost;
