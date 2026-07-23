import type { CSSProperties } from "react";

const stars = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  x: (index * 37 + 11) % 100,
  y: (index * 61 + 7) % 100,
  size: index % 7 === 0 ? 2 : 1,
  delay: (index % 9) * 0.37,
  duration: 3.6 + (index % 5) * 0.7,
}));

type StarStyle = CSSProperties & {
  "--star-x": string;
  "--star-y": string;
  "--star-size": string;
  "--star-delay": string;
  "--star-duration": string;
};

export function StarBackground() {
  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => {
        const style: StarStyle = {
          "--star-x": `${star.x}%`,
          "--star-y": `${star.y}%`,
          "--star-size": `${star.size}px`,
          "--star-delay": `${star.delay}s`,
          "--star-duration": `${star.duration}s`,
        };

        return <span key={star.id} style={style} />;
      })}
    </div>
  );
}
