import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const totalJokesCount = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * totalJokesCount);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }
  return json({ randomJoke });
};

export default () => {
  const data = useLoaderData();
  return (
    <div>
      <p>Here's a random joke:</p>
      <h3>{data.joke.name}</h3>
      <p>{data.joke.content}</p>
    </div>
  );
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">There are no jokes to display.</div>
    );
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return <div className="error-container">Sorry an error happened.</div>;
}
