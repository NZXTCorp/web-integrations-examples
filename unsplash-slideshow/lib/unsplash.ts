const requestImage = async (
  query: string,
  page: string | number
): Promise<{
  results: any[];
  total_pages: number;
  error?: boolean;
}> => {
  const data = {
    results: [],
    total_pages: 0,
  };

  const urlSearchParams = new URLSearchParams({
    client_id: process.env.UNSPLASH_ACCESS_KEY!,
    page: page.toString(),
    per_page: "30",
    query: query,
  });

  const response = await fetch(
    "https://api.unsplash.com/search/photos?" + urlSearchParams
  );

  if (response.status !== 200) {
    console.log(response);
    return { results: [], total_pages: 0, error: true };
  }

  const json = await response.json();
  const { results, total_pages } = json;
  if (!results || !total_pages) return data;

  return { results, total_pages };
};

export { requestImage };
