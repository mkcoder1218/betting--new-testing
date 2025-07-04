import { SVGProps } from "react"
interface isSmallProp {
  isSmall?: boolean;
}
type CombinedProps = SVGProps<SVGSVGElement> & isSmallProp;
export const CarRacing = (props: CombinedProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    height={props.isSmall ? 10 : 20}
    viewBox="0 0 110 35.8"
    data-svg-id="MotorRacingSVG"
    className="fill-current"
  >
    <g>
      <path
        className="st0"
        d="M97.6,16.2c0,0-0.2-2.7-12.6-5.3c-12.3-2.6-12.4-2-12.4-2s9,1.7,0,2.9c0,0-13.4-7.6-16.7-9l1-1c0,0-12.8-4.4-33.8,0.5l0,0.6L10.1,9.3c0,0-3.1-0.2-0.1-1.4c0,0-6.1,0.6-7.7,2.5l0,5.5l0,1.6c0,0-2.5,0.9-2.2,2.6c0.3,1.7,0.7,3.3,0.7,3.3l0.5,0.3l0.2,2.1c0,0,4.5,2.2,8.6,2.6l0.4-1.4c0,0-0.6-8.9,8.2-8.4c6.6,0.4,8.4,8,8.4,8l0,2.9l0.1,0.6l44.6,0.2l0-1.9l0-0.6c0,0,0.5-9.1,9.8-9.4c9.3-0.3,8.9,9.6,8.9,9.6l0.2,1.4c0,0,6.8,1.2,8.5-2.7c0,0-0.2-2,0.4-3.3C99.7,23.5,101.2,17.7,97.6,16.2z M29.8,10.7c0,0-3.6-7.5,10.7-7.2l1.2,8L29.8,10.7z M65.9,12.9L45,11.8l-1.7-8.1c11.4-0.8,23,8.8,23,8.8L65.9,12.9z"
      ></path>
      <circle className="st0" cx="18.7" cy="27.8" r="8"></circle>
      <circle className="st0" cx="81.4" cy="28" r="8"></circle>
    </g>
  </svg>
);