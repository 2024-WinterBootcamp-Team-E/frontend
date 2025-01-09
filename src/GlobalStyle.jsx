import styled, { createGlobalStyle, css } from 'styled-components';

// css`` 사용법 예시:
// import {sunflower_light} from '@/styled'
// const SampleStyle = styled.div`
//   ${sunflower_light}
// `

export const sunflower_light = css`
	font-weight: 300;
	font-style: normal;
`;

export const sunflower_medium = css`
	font-weight: 500;
	font-style: normal;
`;

export const sunflower_bold = css`
	font-weight: 700;
	font-style: normal;
`;

export const L = css`
	font-size: 2rem;
	line-height: 2.5rem;
`;
export const M = css`
	font-size: 1.5rem;
	line-height: 2rem;
`;
export const S = css`
	font-size: 1rem;
	line-height: 1.5rem;
`;

export const display1 = styled.p`
	${sunflower_bold}
	font-size: 4.5rem;
	line-height: 5.5rem;
	letter-spacing: -2.2%;
`;

export const display2 = styled.p`
	${sunflower_bold}
	font-size: 3.75rem;
	line-height: 4.625rem;
	letter-spacing: -2.2%;
`;

export const display3 = styled.p`
	${sunflower_bold}
	font-size: 3.125rem;
	line-height: 3.875rem;
	letter-spacing: -2.2%;
`;

const GlobalStyle = createGlobalStyle`
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
    font-size: 100%;
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
    font-family: 'Sunflower', 'Source Sans Pro', sans-serif;
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
    ${sunflower_medium}
    font-size: 2.625rem;
    line-height: 3.25rem;
    letter-spacing: -2.2%;
  }
  h2 {
    ${sunflower_medium}
    font-size: 2.25rem;
    line-height: 2.75rem;
    letter-spacing: -2.2%;
  }
  h3 {
    ${sunflower_medium}
    font-size: 1.75rem;
    line-height: 2.125rem;
    letter-spacing: -2.1%;
  }
  h4 {
    ${sunflower_medium}
    font-size: 1.5rem;
    line-height: 1.875rem;
    letter-spacing: -1.9%;
  }
  h5 {
    ${sunflower_medium}
    font-size: 1.25rem;
    line-height: 1.5rem;
    letter-spacing: -1.7%;
  }
  h6 {
    ${sunflower_medium}
    font-size: 1.125rem;
    line-height: 1.375rem;
    letter-spacing: -1.4%;
  }
  
`;

export default GlobalStyle;
