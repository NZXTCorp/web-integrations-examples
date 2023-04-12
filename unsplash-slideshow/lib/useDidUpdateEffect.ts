import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export default function useDidUpdateEffect(
  fn: EffectCallback,
  inputs: DependencyList | undefined
) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) return fn();
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
