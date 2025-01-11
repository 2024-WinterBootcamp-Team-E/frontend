import styled, { css } from 'styled-components';
import { pretendard_medium } from '../GlobalStyle';

const VARIENTS = {
	default: css`
		background: transparent;
		color: var(--neutral-100, #000000);
		&:hover {
			color: var(--neutral-90, #3d3f40);
		}
		&:focus {
			color: var(--neutral-80, #5d5f61);
		}
		&:active {
			color: var(--neutral-70, #717375);
		}
	`,
	black: css`
		background: var(--neutral-100, #000000);
		color: var(--neutral-10, #ffffff);
		&:hover {
			background: var(--neutral-90, #3d3f40);
		}
		&:focus {
			background: var(--neutral-80, #5d5f61);
		}
		&:active {
			background: var(--neutral-70, #717375);
		}
	`,
};

const ROUNDEDS = {
	none: css`
		border-radius: 0;
	`,
	sm: css`
		border-radius: var(--rounded-sm, 8px);
	`,
	md: css`
		border-radius: var(--rounded-md, 16px);
	`,
	lg: css`
		border-radius: var(--rounded-lg, 24px);
	`,
	xl: css`
		border-radius: var(--rounded-xl, 32px);
	`,
	full: css`
		border-radius: var(--rounded-full, 9999px);
	`,
};

const PADDINGS = {
	none: css`
		padding: 0;
	`,
	sm: css`
		padding: 8px 16px;
	`,
	md: css`
		padding: 16px 16px;
	`,
	lg: css`
		padding: 16px 32px;
	`,
	xl: css`
		padding: 32px 32px;
	`,
};

const BORDERS = {
	transparent: css`
		border: none;
	`,
	black: css`
		border: 2px solid var(--neutral-100, #000000);
	`,
	primary: css`
		border: 2px solid var(--primary-border, #976d29);
	`,
	secondary: css`
		border: 2px solid var(--secondary-border, #edefe1);
	`,
	info: css`
		border: 2px solid var(--info-border, #b1c5f6);
	`,
	success: css`
		border: 2px solid var(--success-border, #b8dbca);
	`,
	warning: css`
		border: 2px solid var(--warning-border, #eeceb0);
	`,
	danger: css`
		border: 2px solid var(--danger-border, #eeb4b0);
	`,
};

const Button = ({
	disabled,
	varient = 'defalt',
	rounded = 'none',
	padding = 'sm',
	border = 'transparent',
	onClick,
	children,
}) => {
	const varientStyle = VARIENTS[varient];
	const roundedStyle = ROUNDEDS[rounded];
	const paddingStyle = PADDINGS[padding];
	const borderStyle = BORDERS[border];

	return (
		<StyledButton
			disabled={disabled}
			varientStyle={varientStyle}
			roundedStyle={roundedStyle}
			paddingStyle={paddingStyle}
			borderStyle={borderStyle}
			onClick={onClick}
		>
			{children}
		</StyledButton>
	);
};

const StyledButton = styled.button`
	${(props) => props.varientStyle}
	${(props) => props.roundedStyle}
	${(props) => props.paddingStyle}
	${(props) => props.borderStyle}

	margin: 0;
	cursor: pointer;
	${pretendard_medium}

	&:disabled {
		cursor: default;
		opacity: 0.5;
		background: var(--neutral-50, #babec1);
	}
`;

export default Button;
