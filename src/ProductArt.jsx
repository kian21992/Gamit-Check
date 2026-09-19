import { useId } from "react";

// Lightweight vector placeholders give the wireframe a visual identity.
// They are category illustrations, not an item-image upload feature.
export default function ProductArt({ type, className = "" }) {
  const id = useId().replace(/:/g, "");
  const dark = "#34423f";
  const green = "#788a70";
  let drawing;
  switch (type) {
    case "headphones":
      drawing = (
        <g transform="rotate(-13 120 90)">
          <path
            d="M71 103V78a49 49 0 0 1 98 0v25"
            fill="none"
            stroke="#3a4540"
            strokeWidth="17"
          />
          <path
            d="M75 77a45 45 0 0 1 90 0"
            fill="none"
            stroke="#96a18c"
            strokeWidth="10"
          />
          <rect x="59" y="84" width="29" height="53" rx="13" fill="#3e4940" />
          <rect x="63" y="87" width="17" height="46" rx="8" fill="#75816b" />
          <rect x="152" y="84" width="29" height="53" rx="13" fill="#3e4940" />
          <rect x="161" y="88" width="17" height="45" rx="8" fill="#75816b" />
          <path
            d="M157 97v26M83 97v26"
            stroke="#202d28"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      );
      break;
    case "basketball":
      drawing = (
        <g transform="rotate(-17 120 88)">
          <circle cx="120" cy="88" r="53" fill="#c88049" />
          <circle cx="120" cy="88" r="53" fill={`url(#${id}-ball)`} />
          <g stroke="#684a33" strokeWidth="2.2" fill="none">
            <path d="M68 88h104M120 35v106M86 47c42 18 42 64 0 82M154 47c-42 18-42 64 0 82" />
          </g>
          <path
            d="M91 54a44 44 0 0 1 31-11"
            stroke="#e4a673"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="99"
            y="84"
            fill="#593c29"
            fontSize="10"
            fontWeight="700"
            fontFamily="Georgia"
            transform="rotate(15 115 85)"
          >
            SPALDING
          </text>
        </g>
      );
      break;
    case "backpack":
      drawing = (
        <g transform="rotate(8 120 90)">
          <path
            d="M103 47V34q17-15 34 0v13"
            stroke="#674837"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="M83 61q-18 43-10 70M155 62q20 41 12 69"
            stroke="#84766e"
            strokeWidth="10"
            fill="none"
          />
          <path
            d="M78 67q0-28 42-29 42 1 42 29l6 70q-47 17-96 0Z"
            fill="#9c8b7d"
          />
          <path d="M78 68q42 13 84 0l-2-10q-40-27-79 0Z" fill="#b4a293" />
          <path
            d="M88 106q32-8 64 0v32q-32 8-64 0Z"
            fill="#b6a294"
            stroke="#8b7767"
            strokeWidth="1"
          />
          <path d="M87 108h66" stroke="#6e6055" strokeWidth="2" />
          <rect x="112" y="75" width="17" height="13" rx="2" fill="#e3d9c9" />
          <path d="M115 79h11m-11 3h8" stroke="#87735d" strokeWidth="1" />
          <path
            d="M91 63v27m58-27v27"
            stroke="#765942"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="M83 131V79" stroke="#d4c4b5" strokeWidth="2" opacity=".6" />
        </g>
      );
      break;
    case "camera":
      drawing = (
        <g transform="rotate(-10 120 90)">
          <path
            d="M65 67q-6-15 4-23"
            stroke="#766e61"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M177 71q15 19 2 45"
            stroke="#766e61"
            strokeWidth="5"
            fill="none"
          />
          <rect x="60" y="57" width="121" height="76" rx="10" fill="#414644" />
          <path d="M60 70V62q0-9 10-9h100q11 0 11 11v9Z" fill="#b7b9ae" />
          <path d="m109 57 6-13h30l7 13" fill="#c2c3b9" />
          <rect x="70" y="48" width="22" height="7" rx="3" fill="#6c7169" />
          <rect x="69" y="82" width="19" height="44" rx="4" fill="#303735" />
          <circle cx="130" cy="96" r="32" fill="#b6b9ae" />
          <circle cx="130" cy="96" r="27" fill="#303a38" />
          <circle cx="130" cy="96" r="20" fill="#556762" />
          <circle cx="130" cy="96" r="14" fill="#253a37" />
          <circle cx="125" cy="91" r="6" fill="#8ca9a0" opacity=".7" />
          <rect x="158" y="60" width="14" height="8" rx="2" fill="#e2e1d7" />
          <text x="96" y="68" fill="#474f48" fontSize="5" fontWeight="700">
            FUJIFILM
          </text>
        </g>
      );
      break;
    case "gamepad":
      drawing = (
        <g>
          <path
            d="M82 62q-14 1-20 20l-12 39q-2 20 15 19 7 0 25-24h60q18 24 25 24 17 1 15-19l-12-39q-6-19-20-20Z"
            fill="#edece4"
            stroke="#c2c5ba"
            strokeWidth="2"
          />
          <path d="M96 67h48l-4 35h-40Z" fill={dark} />
          <path
            d="M75 78v21m-10-10h21"
            stroke={dark}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <g fill="#6c8070">
            <circle cx="162" cy="77" r="4" />
            <circle cx="172" cy="87" r="4" />
            <circle cx="152" cy="87" r="4" />
            <circle cx="162" cy="97" r="4" />
          </g>
          <circle cx="99" cy="108" r="11" fill={dark} />
          <circle cx="141" cy="108" r="11" fill={dark} />
        </g>
      );
      break;
    case "shoe":
      drawing = (
        <g transform="rotate(-8 120 90)">
          <path
            d="m55 105 13-40 26 13 28-8 18 27 41 14q15 5 13 20H49v-18Z"
            fill="#c6c5b8"
          />
          <path d="m75 80 20 13 27-8 19 21 38 10H58" fill="#718376" />
          <path
            d="m100 85 28 6m-22 2 29 6m-24 2 31 6"
            stroke="#f5f1e5"
            strokeWidth="4"
          />
          <path d="M49 128h146v12H50Z" fill="#f4efe2" stroke="#c5c1b3" />
          <path
            d="m90 113 10-18 10 18 11-17"
            stroke="#e5e6dc"
            strokeWidth="6"
            fill="none"
          />
        </g>
      );
      break;
    case "book":
      drawing = (
        <g transform="rotate(-13 120 90)">
          <rect x="78" y="33" width="88" height="116" rx="5" fill="#768b72" />
          <path d="M85 34v114" stroke="#51654f" strokeWidth="5" />
          <rect x="96" y="49" width="51" height="34" rx="2" fill="#f1eadb" />
          <path
            d="M106 60h31m-31 7h24m-24 7h28"
            stroke="#aaa898"
            strokeWidth="2"
          />
          <path d="M159 36v110" stroke="#d1cabb" strokeWidth="3" />
          <path d="M87 144h72" stroke="#ebe3d4" strokeWidth="5" />
        </g>
      );
      break;
    case "laptop":
      drawing = (
        <g>
          <rect x="62" y="40" width="119" height="84" rx="6" fill={dark} />
          <rect x="69" y="47" width="105" height="68" rx="2" fill="#a6b8a2" />
          <path d="M70 97q39-53 104-20v37H70Z" fill="#768e78" />
          <path d="M62 124 43 141h157l-19-17" fill="#adb5a9" />
          <path d="M43 141q2 6 9 6h139q7 0 9-6" fill="#737f73" />
          <path d="M104 128h35l5 8h-45Z" fill="#d4d8ce" />
        </g>
      );
      break;
    case "shirt":
      drawing = (
        <g>
          <path
            d="m91 39-33 17-18 33 28 16 15-23v67h75V82l15 23 28-16-18-33-33-17q-30 28-59 0Z"
            fill="#84957c"
          />
          <path
            d="M91 39q29 38 59 0"
            stroke="#52684f"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M89 142h61M60 60l13 18m107-18-13 18"
            stroke="#aab5a0"
            strokeWidth="2"
          />
        </g>
      );
      break;
    case "bottle":
      drawing = (
        <g transform="rotate(10 120 90)">
          <rect x="103" y="29" width="34" height="20" rx="5" fill={dark} />
          <path
            d="M106 45q-17 7-17 21v73q0 13 31 13t31-13V66q0-14-17-21Z"
            fill="#819487"
          />
          <path
            d="M100 68v62"
            stroke="#b4c3b5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M110 97q10-15 20 0-10 17-20 0Z"
            stroke="#dce3d7"
            strokeWidth="2"
            fill="none"
          />
        </g>
      );
      break;
    case "watch":
      drawing = (
        <g transform="rotate(16 120 90)">
          <rect x="104" y="16" width="32" height="148" rx="9" fill="#776f5e" />
          <rect x="92" y="59" width="57" height="63" rx="14" fill="#b8bba9" />
          <rect x="100" y="67" width="41" height="47" rx="8" fill="#384a40" />
          <path
            d="M121 75v18l10 6"
            stroke="#dfe4cc"
            strokeWidth="3"
            fill="none"
          />
          <rect x="148" y="78" width="5" height="13" rx="2" fill="#858f7c" />
        </g>
      );
      break;
    case "glasses":
      drawing = (
        <g transform="rotate(-9 120 90)">
          <path
            d="m57 88 17-39h23m86 39-12-39h-24"
            stroke="#625347"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M47 82h60v32q-26 25-55-1Zm86 0h60l-5 31q-29 26-55 1Z"
            fill="#637066"
            stroke="#51473c"
            strokeWidth="6"
          />
          <path
            d="M107 87q13-10 26 0"
            stroke="#51473c"
            strokeWidth="6"
            fill="none"
          />
          <path
            d="m59 87 32 30m58-30 28 27"
            stroke="#96a79a"
            strokeWidth="9"
            opacity=".5"
          />
        </g>
      );
      break;
    case "racket":
      drawing = (
        <g transform="rotate(28 120 90)">
          <ellipse
            cx="120"
            cy="65"
            rx="34"
            ry="43"
            fill="#edf0e6"
            stroke="#567262"
            strokeWidth="5"
          />
          <path d="M120 108v32" stroke="#687c70" strokeWidth="5" />
          <path
            d="M120 140v27"
            stroke={dark}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M102 30v69m12-76v84m12-84v84m12-77v69M88 46h64M87 58h66M87 70h66M90 82h60M97 94h46"
            stroke="#b5bdac"
            strokeWidth="1"
          />
        </g>
      );
      break;
    case "umbrella":
      drawing = (
        <g transform="rotate(12 120 90)">
          <path
            d="M52 84a68 58 0 0 1 136 0q-17-15-34 0-17-15-34 0-17-15-34 0-17-15-34 0Z"
            fill="#82917b"
          />
          <path
            d="M120 28q-28 15-34 56m34-56q28 15 34 56m-34 0v61q0 18 17 13 9-3 8-13"
            stroke="#3f5546"
            strokeWidth="3"
            fill="none"
          />
        </g>
      );
      break;
    case "console":
      drawing = (
        <g transform="rotate(-8 120 90)">
          <rect x="43" y="54" width="156" height="85" rx="19" fill="#789784" />
          <rect x="70" y="54" width="100" height="85" fill={dark} />
          <rect x="77" y="62" width="86" height="68" fill="#b8c6a5" />
          <path d="m80 120 24-37 21 19 18-25 20 44" fill="#829c7b" />
          <circle cx="57" cy="75" r="7" fill={dark} />
          <circle cx="184" cy="115" r="7" fill={dark} />
          <path
            d="M56 99v15m-7-8h14M184 74v15m-7-8h14"
            stroke={dark}
            strokeWidth="3"
          />
        </g>
      );
      break;
    case "keyboard":
      drawing = (
        <g transform="rotate(-10 120 90)">
          <rect x="37" y="59" width="166" height="80" rx="7" fill="#728171" />
          <rect x="42" y="64" width="156" height="68" rx="4" fill="#b5bdad" />
          {Array.from({ length: 36 }, (_, i) => (
            <rect
              key={i}
              x={48 + (i % 12) * 12}
              y={70 + Math.floor(i / 12) * 14}
              width="9"
              height="10"
              rx="2"
              fill={i % 7 === 0 ? "#7e947d" : "#e6e6d9"}
            />
          ))}
          <rect x="85" y="114" width="64" height="10" rx="2" fill="#e6e6d9" />
        </g>
      );
      break;
    case "mat":
      drawing = (
        <g transform="rotate(-15 120 90)">
          <path d="M62 57h108v82H62Z" fill="#92a38a" />
          <ellipse cx="62" cy="98" rx="25" ry="41" fill="#6c8066" />
          <ellipse cx="62" cy="98" rx="16" ry="30" fill="#adbaa3" />
          <ellipse cx="62" cy="98" rx="8" ry="17" fill="#73886b" />
          <path d="M143 60v76" stroke="#d5dac8" strokeWidth="10" />
        </g>
      );
      break;
    case "pencilcase":
      drawing = (
        <g transform="rotate(-12 120 90)">
          <rect x="44" y="66" width="152" height="64" rx="20" fill="#99a28b" />
          <path d="M48 83h144" stroke="#4c624b" strokeWidth="3" />
          <path
            d="m178 83 8 13"
            stroke="#d3d9c4"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="104" y="97" width="33" height="17" rx="2" fill="#e3e3d4" />
        </g>
      );
      break;
    case "calculator":
      drawing = (
        <g transform="rotate(-9 120 90)">
          <rect x="82" y="29" width="77" height="129" rx="9" fill={dark} />
          <rect x="91" y="41" width="58" height="30" rx="3" fill="#b3c3a0" />
          {Array.from({ length: 20 }, (_, i) => (
            <rect
              key={i}
              x={91 + (i % 4) * 15}
              y={81 + Math.floor(i / 4) * 14}
              width="10"
              height="9"
              rx="2"
              fill={i % 4 === 3 ? "#94a58b" : "#d7dbce"}
            />
          ))}
        </g>
      );
      break;
    case "speaker":
      drawing = (
        <g transform="rotate(-12 120 90)">
          <rect x="74" y="38" width="92" height="113" rx="26" fill="#738673" />
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d={`M83 ${60 + i * 10}h73`}
              stroke="#4d6855"
              strokeWidth="2"
              strokeDasharray="2 3"
            />
          ))}
          <rect x="107" y="84" width="28" height="22" rx="3" fill="#c6bc9b" />
          <text x="112" y="99" fontSize="10" fontWeight="bold" fill="#51674e">
            JBL
          </text>
        </g>
      );
      break;
    default:
      drawing = (
        <g transform="rotate(-13 120 90)">
          <rect x="84" y="35" width="75" height="116" rx="13" fill="#647b66" />
          <path
            d="M92 48v88"
            stroke="#91a38a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="108" y="44" width="27" height="5" rx="2" fill="#344b38" />
          <g fill="#d8e5c8">
            <circle cx="108" cy="124" r="2" />
            <circle cx="117" cy="124" r="2" />
            <circle cx="126" cy="124" r="2" />
            <circle cx="135" cy="124" r="2" />
          </g>
          <path
            d="m123 70-9 18h12l-8 18"
            stroke="#c6d2b9"
            strokeWidth="3"
            fill="none"
          />
        </g>
      );
  }
  return (
    <svg
      className={`product-art ${className}`}
      viewBox="0 0 240 180"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-ball`} cx=".32" cy=".25" r=".8">
          <stop stopColor="#e6aa71" stopOpacity=".65" />
          <stop offset="1" stopColor="#925025" stopOpacity=".4" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop stopColor="#364337" stopOpacity=".14" />
          <stop offset="1" stopColor="#364337" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="151" rx="72" ry="12" fill={`url(#${id}-shadow)`} />
      {drawing}
    </svg>
  );
}
