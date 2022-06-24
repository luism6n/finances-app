import { useEffect, useRef, useState } from "react";

function useSize() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new ResizeObserver((e) => {
      if (!Array.isArray(e) || !e.length) {
        setWidth(null);
        setHeight(null);
        return;
      }

      const r = e[0].contentRect;
      setWidth(r.width);
      setHeight(r.height);
    });

    observer.observe(ref.current);
  }, [ref]);

  return { ref, width, height };
}

export default useSize;
