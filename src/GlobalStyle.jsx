import styled, { createGlobalStyle, css } from 'styled-components';

// css`` 사용법 예시:
// import {pretendard_light} from '@/GlobalStyle';
// const SampleStyle = styled.div`
//   ${pretendard_light}
// `

export const pretendard_thin = css`
	font-weight: 100;
	font-style: normal;
`;
export const pretendard_extralight = css`
	font-weight: 200;
	font-style: normal;
`;
export const pretendard_light = css`
	font-weight: 300;
	font-style: normal;
`;
export const pretendard_regular = css`
	font-weight: 400;
	font-style: normal;
`;
export const pretendard_medium = css`
	font-weight: 500;
	font-style: normal;
`;
export const pretendard_semibold = css`
	font-weight: 600;
	font-style: normal;
`;
export const pretendard_bold = css`
	font-weight: 700;
	font-style: normal;
`;
export const pretendard_extrabold = css`
	font-weight: 800;
	font-style: normal;
`;
export const pretendard_black = css`
	font-weight: 900;
	font-style: normal;
`;

export const TextSizeXL = css`
	font-size: 1.5rem;
	line-height: 1.75rem;
`;
export const TextSizeL = css`
	font-size: 1.25rem;
	line-height: 1.5rem;
`;
export const TextSizeM = css`
	font-size: 1rem;
	line-height: 1.25rem;
`;
export const TextSizeS = css`
	font-size: 0.75rem;
	line-height: 1rem;
`;

export const display1 = styled.p`
	${pretendard_bold}
	font-size: 4.5rem;
	line-height: 5.5rem;
	letter-spacing: -2.2%;
`;

export const display2 = styled.p`
	${pretendard_bold}
	font-size: 3.75rem;
	line-height: 4.625rem;
	letter-spacing: -2.2%;
`;

export const display3 = styled.p`
	${pretendard_bold}
	font-size: 3.125rem;
	line-height: 3.875rem;
	letter-spacing: -2.2%;
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --neutral-10: #FFFFFF;
    --neutral-20: #EBF0F4;
    --neutral-30: #E4E9EC;
    --neutral-40: #D8DCE0;
    --neutral-50: #BABEC1;
    --neutral-60: #989B9D;
    --neutral-70: #717375;
    --neutral-80: #5D5F61;
    --neutral-90: #3D3F40;
    --neutral-100: #0A0A0A;

    --primary-main:#D9983E;
    --primary-surface:#F9DFBA;
    --primary-border:#E6AA5A;
    --primary-hover:#BF8133;
    --primary-pressed:#976D29;
    --primary-focus:#d9983e33;

    --secondary-main:#FBFCF6;
    --secondary-surface:#F6F7EE;
    --secondary-border:#EDEFE1;
    --secondary-hover:#D8DAC4;
    --secondary-pressed:#CDD0B6;
    --secondary-focus:#FBFCF633;

    --success-border:#b8dbca;
    --success-hober:#367a59;
    --success-main:#43936c;
    --success-pressed:#20573d;
    --success-surface:#f7f7f7;

    --warning-border:#eeceb0;
    --warning-hober:#bf6919;
    --warning-main:#cd7b2e;
    --warning-pressed:#734011;
    --warning-surface:#fff9f2;

    --danger-border:#eeb4b0;
    --danger-hober:#bd251c;
    --danger-main:#cb3a31;
    --danger-pressed:#731912;
    --danger-surface:#fff4f2;

    --info-border:#b1c5f6;
    --info-hober:#114cd6;
    --info-main:#3267e3;
    --info-pressed:#11317d;
    --info-surface:#f0f3ff;

    --rounded-sm:0.5rem;
    --rounded-md:1rem;
    --rounded-lg:1.5rem;
    --rounded-xl:2rem;
    --rounded-full:100rem;
  }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 16px;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
    font-weight: 300;
    font-family: 'pretendard', 'Source Sans Pro', sans-serif;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: inherit;
  }

  // 이하 텍스트 스타일

  h1 {
    ${pretendard_medium}
    font-size: 2.625rem;
    line-height: 3.25rem;
    letter-spacing: -2.2%;
    color:var(--neutral-100)
  }
  h2 {
    ${pretendard_medium}
    font-size: 2.25rem;
    line-height: 2.75rem;
    letter-spacing: -2.2%;
    color:var(--neutral-100)
  }
  h3 {
    ${pretendard_medium}
    font-size: 1.75rem;
    line-height: 2.125rem;
    letter-spacing: -2.1%;
    color:var(--neutral-100)
  }
  h4 {
    ${pretendard_medium}
    font-size: 1.5rem;
    line-height: 1.875rem;
    letter-spacing: -1.9%;
    color:var(--neutral-100)
  }
  h5 {
    ${pretendard_medium}
    font-size: 1.25rem;
    line-height: 1.5rem;
    letter-spacing: -1.7%;
    color:var(--neutral-100)
  }
  h6 {
    ${pretendard_medium}
    font-size: 1.125rem;
    line-height: 1.375rem;
    letter-spacing: -1.4%;
    color:var(--neutral-100)
  }
  
  p {
    ${pretendard_medium}
    ${TextSizeM}
    color:var(--neutral-100)
  }
  

`;

export default GlobalStyle;
