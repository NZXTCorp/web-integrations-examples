import React from 'react'
import { css } from '@emotion/css'
import { PRIVACY_CONTENT, PRIVACY_FOOTER, PRIVACY_HEADER } from '../lib/privacy'
import { MarkdownRenderer } from '../Components/MarkdownRenderer'

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding-left: 20vw;
    padding-right: 20vw;
    text-align: left;
    font-weight: 400;
    line-height: 1.75;

    a {
      text-decoration: underline;
    }

    p {
      font-size: 1rem;
      margin: 0.75rem;
    }

    ul {
      margin-left: 3rem;
    }
  `,

  header: css`
    width: 100%;
    text-align: center;
  `,

  footer: css`
    width: 100%;
    text-align: center;
    padding-bottom: 5vh;
  `,
}

const Privacy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{PRIVACY_HEADER}</h1>
      <br />
      <MarkdownRenderer content={PRIVACY_CONTENT} />
      <br />
      <h1 className={styles.footer}>
        <MarkdownRenderer content={PRIVACY_FOOTER} />
      </h1>
    </div>
  )
}

export default Privacy
