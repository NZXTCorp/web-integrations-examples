import type { NextApiRequest, NextApiResponse } from "next";
import { requestImage } from "../../lib/unsplash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { query, page } = req.query;

  if (!query || !page) {
    res.status(400).json({ error: "Missing query or page" });
    return;
  }

  if (typeof query !== "string" || typeof page !== "string") {
    res.status(400).json({ error: "Query must be a string" });
    return;
  }

  return requestImage(query, page)
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    });
}
