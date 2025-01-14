import styled from 'styled-components';
import Header from '@/components/Header';

const Layout = ({ children }) => {
	return (
		<LayoutWrapper>
			<Header />
			<ContentWrapper>{children}</ContentWrapper>
		</LayoutWrapper>
	);
};

export default Layout;

const LayoutWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const ContentWrapper = styled.main`
	flex: 1; /* 남은 공간을 차지 */
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
