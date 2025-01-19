import styled from 'styled-components';
import { Check, Question, Exclamation } from '@styled-icons/fa-solid';

const ChatFeedbackAlert = ({ type }) => {
	// Icon 컴포넌트 선택
	const getIcon = () => {
		switch (type) {
			case 'success':
				return <SuccessIcon size='1rem' title='SuccessIcon' />;
			case 'warning':
				return <WarningIcon size='1rem' title='WarningIcon' />;
			case 'danger':
				return <DangerIcon size='1rem' title='DangerIcon' />;
			default:
				return null;
		}
	};

	return (
		<StyledAlertWrapper type={type}>
			{getIcon()}
			<p>alert</p>
		</StyledAlertWrapper>
	);
};

export default ChatFeedbackAlert;

// 스타일링
const SuccessIcon = styled(Check)`
	color: var(--success-main);
`;

const WarningIcon = styled(Question)`
	color: var(--warning-main);
`;

const DangerIcon = styled(Exclamation)`
	color: var(--danger-main);
`;

const StyledAlertWrapper = styled.div`
	align-items: center;
	display: flex;
	gap: 0.5rem;
	p {
		color: ${({ type }) => {
			switch (type) {
				case 'success':
					return 'var(--success-main)';
				case 'warning':
					return 'var(--warning-main)';
				case 'danger':
					return 'var(--danger-main)';
				default:
					return 'inherit'; // 기본 텍스트 색상
			}
		}};
	}
`;
