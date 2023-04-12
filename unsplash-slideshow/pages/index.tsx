import Head from "next/head";
import { NextPageContext } from "next";
import { requestImage } from "../lib/unsplash";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import useDidUpdateEffect from "../lib/useDidUpdateEffect";
import { useRouter } from "next/router";

type image = {
  urls: { [key: string]: string };
};

export default function Home({
  query,
  results,
  viewstate,
  time,
  totalPages,
}: {
  query?: string;
  results: image[];
  viewstate?: number;
  time: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [images, setImages] = useState<image[]>(results);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(2);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (images.length) return;
    setImages(results);
  }, [results, images]);

  const loader = ({ src }: { src: string }) => {
    return src + `w=${viewstate}&h=${viewstate}&fit=crop`;
  };

  const submit = (e: any) => {
    e.preventDefault();
    let query = "";
    for (let i = 0; i < e.target.length; i++) {
      let input = e.target[i];
      if (input.value) {
        query += `${input.name}=${input.value}&`;
      }
    }
    router.push({ pathname: `/`, query });
  };

  const getImages = async () => {
    try {
      console.log(`Fetching images... ${page}}`);
      const response = await fetch(`/api/images?query=${query}&page=${page}`);
      if (response.status !== 200) {
        setError(true);
        return;
      }

      const { results, total_pages, error } = await response.json();
      if (error) {
        setError(true);
        return;
      }

      setPage((page) => (page === total_pages ? 1 : page + 1));
      setImages((images) => images.concat(results));
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImageIndex === images.length || images.length === 0) {
        setCurrentImageIndex(0);
      } else {
        setCurrentImageIndex((currentIndex) => {
          return currentIndex + 1;
        });
      }
    }, time);
    return () => clearInterval(interval);
  }, [currentImageIndex, images]);

  useEffect(() => {
    if (page > totalPages) return;
    if (currentImageIndex === images.length - 1) {
      getImages();
    }
  }, [currentImageIndex]);

  const photo = images[currentImageIndex];

  const HeadElement = () => {
    return (
      <Head>
        <title>Unsplash Slideshow</title>
        <meta name="description" content="Slideshow for Unsplash" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    );
  };

  if (!query && viewstate) {
    return (
      <>
        <HeadElement />
        <div className={styles.main}>
          <h1 className={styles.configureSlideshow}>Configure slideshow</h1>
        </div>
      </>
    );
  }

  if (!viewstate) {
    return (
      <>
        <HeadElement />
        <div className={styles.main}>
          <h1 className={styles.header}>Search for images</h1>
          <form className={styles.form} action="/" onSubmit={submit}>
            <label htmlFor="query">Query</label>
            <input defaultValue={"puppy"} type="text" name="query" />
            <label htmlFor="t">Time (seconds)</label>
            <input defaultValue={5} type="number" name="t" />
            <label htmlFor="viewstate">Viewstate</label>
            <input defaultValue={640} type="text" name="viewstate" />
            <input type="submit" />
          </form>
        </div>
      </>
    );
  }

  if (photo && viewstate) {
    return (
      <>
        <HeadElement />
        <Image
          loader={loader}
          alt=""
          width={viewstate || 320}
          height={viewstate || 320}
          src={photo?.urls.regular}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeadElement />
        <div className={styles.main}>
          <h1 className={styles.header}>Unable to load images</h1>
        </div>
      </>
    );
  }
}

export async function getServerSideProps({
  req,
  query: nextQuery,
}: NextPageContext) {
  let { query: q, viewstate: v, t } = nextQuery;

  // if missing viewstate, redirect to default page

  let results = [];
  let totalPages = 0;

  let query = parseWithDefault(q, "");
  let viewstate = parseInt(parseWithDefault(v, undefined));
  let time = parseInt(parseWithDefault(t, "5")) * 1000;
  if (query && viewstate) {
    let response = await requestImage(query, 1);
    results = response.results;
    totalPages = response.total_pages;
    console.log(results);
  }
  console.log({
    results,
    query,
    viewstate,
    time,
    totalPages,
  });

  return {
    props: {
      results,
      query,
      viewstate,
      time,
      totalPages,
    },
  };
}

const parseWithDefault = (
  query: string | string[] | undefined,
  defaultValue: any
) => {
  if (query === undefined || query === null || query === "")
    return defaultValue;
  if (Array.isArray(query)) return query[0];
  return query;
};
