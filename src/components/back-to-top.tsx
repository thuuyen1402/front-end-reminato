import { useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleScroll = () => {
    const scrollCalc = document.documentElement.scrollTop;
    if (scrollCalc > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleScroll);
    return () => {
      window.removeEventListener("scroll", toggleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${isVisible ? 'block' : 'hidden'} fixed bottom-12 right-12 p-3 bg-white shadow rounded`}
    >
      <div className="rounded h-full m-0 text-xl">
        <Icon name="arrow up"  className="text-youtube-primary"></Icon>
      </div>
    </button>
  );
}
