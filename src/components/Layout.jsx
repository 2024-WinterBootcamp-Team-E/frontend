import styled, { css } from 'styled-components';
import Header from '@/components/Header';
const ISLANDING = {
	default: `
	  background-color: var(--secondary-main);
	`,
	landing: `
	  background-image: url('/LandingBackground.jpg');
	  background-size: cover;
	`,
};

const Layout = ({ isLanding = 'default', children }) => {
	const landingstyle = ISLANDING[isLanding];
	return (
		<LayoutWrapper $landingstyle={landingstyle}>
			<Header />
			<ContentWrapper>{children}</ContentWrapper>
		</LayoutWrapper>
	);
};

export default Layout;

const LayoutWrapper = styled.div`
	${(props) => props.$landingstyle}
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: var(--secondary-main);
`;

const ContentWrapper = styled.main`
	flex-grow: 1; /* 남은 공간을 차지 */
	display: flex;
	flex-direction: column;
`;

// 사용법
// const Page = () => {
// 	return (
// 		<Layout>
// 			<Component1 />
// 			<Component2 />
//       <Component3 />
//       ...
// 		</Layout>
// 	);
// };
