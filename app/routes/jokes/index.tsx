import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async () => {
  const totalJokesCount = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * totalJokesCount);
  const [joke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  return json({ joke });
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

export function ErrorBoundary() {
  return <div className="error-container">Sorry an error happened.</div>;
}
