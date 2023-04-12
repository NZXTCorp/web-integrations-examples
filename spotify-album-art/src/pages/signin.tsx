import { css } from "@emotion/css";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    line-height: 2rem;
    a {
      text-decoration: underline;
    }
  `,
};

export default function SignIn({ error }: { error: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!error) return;
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  if (!error) return <></>;

  return (
    <div className={styles.container}>
      <h2>Unable to log in.</h2>
      <p>
        You will be redirected to the home page. If you are not redirected,{" "}
        <Link href="/" onClick={() => router.push("/")}>
          click here
        </Link>
      </p>
    </div>
  );
}

SignIn.getInitialProps = (ctx: NextPageContext) => {
  const { query } = ctx;
  const error = !!query.error;
  return { error };
};
