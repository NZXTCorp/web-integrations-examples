import { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cx } from '@emotion/css'

const styles = {
  button: css`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 50px;
    width: 400px;
    font-size: 0.9rem;
    border: none;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: rgb(115, 21, 229);
    padding: 1rem 1rem;
    border-radius: 0.2rem;
    color: white;
    transition: all 0.2s ease-in-out;

    :hover {
      background-color: rgb(94, 11, 203);
    }

    .button:active {
      background-color: #2b6cb0;
    }
  `,
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={cx(styles.button, className)} {...props}>
      {children}
    </button>
  )
}

export default Button
