import { ParsedUrlQuery } from 'querystring'
import { signOut as so } from 'next-auth/react'

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

// ParsedUrlQuery to string starting with ?
export const stringifyQuery = (query: ParsedUrlQuery): string => {
  const keys = Object.keys(query)
  if (keys.length === 0) {
    return ''
  }
  return `?${keys.map(key => `${key}=${query[key]}`).join('&')}`
}

export const signOut = () => {
  if (typeof window !== 'undefined') {
    so()
  }
}
