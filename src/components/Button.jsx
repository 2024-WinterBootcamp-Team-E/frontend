import styled, { css } from 'styled-components';
import { pretendard_medium } from '@/GlobalStyle';

const VARIENTS = {
	default: css`
		background: transparent;
		color: var(--neutral-100, #0a0a0a);

		&:active {
			color: var(--neutral-70, #717375);
		}

		&:focus {
			color: var(--neutral-80, #5d5f61);
		}

		&:hover {
			color: var(--neutral-90, #3d3f40);
		}
	`,
	black: css`
		background: var(--neutral-100, #0a0a0a);
		color: var(--neutral-10, #ffffff);

		&:active {
			background: var(--neutral-70, #717375);
		}

		&:focus {
			background: var(--neutral-80, #5d5f61);
		}

		&:hover {
			background: var(--neutral-90, #3d3f40);
		}
	`,
	white: css`
		background-color: var(--neutral-10, #ffffff);
		color: var(--netural-100, #0a0a0a);

		&:active {
			background: var(--neutral-40, #d8dce0);
		}

		&:focus {
			background: var(--neutral-30, #e4e9ec);
		}

		&:hover {
			background: var(--neutral-20, #ebf0f4);
		}
	`,
	green: css`
		background-color: var(--success-hober);
		color: var(--netural-10, #ffffff);

		&:active {
			background-color: var(--success-main);
		}

		&:focus {
			background-color: var(--success-hober);
		}

		&:hover {
			background-color: var(--success-pressed);
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
	xs: css`
		padding: 0.5rem;
	`,
	sm: css`
		padding: 0.5rem 1rem;
	`,
	md: css`
		padding: 1rem;
	`,
	lg: css`
		padding: 1rem 2rem;
	`,
	xl: css`
		padding: 2rem;
	`,
	getstarted: css`
		padding: 1.5rem 3.5rem;
	`,
};

const BORDERS = {
	transparent: css`
		border: none;
	`,
	black: css`
		border: 2px solid var(--neutral-100, #0a0a0a);
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
	signin: css`
		border: 1px solid var(--neutral-100, #0a0a0a);
	`,
};

const SIZES = {
	fit: css`
		height: fit-content;
		width: fit-content;
	`,
	full: css`
		height: 100%;
		width: 100%;
	`,
};

const Button = ({
	disabled,
	varient = 'default',
	rounded = 'none',
	padding = 'sm',
	border = 'transparent',
	size = 'fit',
	onClick,
	children,
}) => {
	const varientStyle = VARIENTS[varient];
	const roundedStyle = ROUNDEDS[rounded];
	const paddingStyle = PADDINGS[padding];
	const borderStyle = BORDERS[border];
	const sizeStyle = SIZES[size];

	return (
		<StyledButton
			disabled={disabled}
			$varientStyle={varientStyle}
			$roundedStyle={roundedStyle}
			$paddingStyle={paddingStyle}
			$borderStyle={borderStyle}
			$sizeStyle={sizeStyle}
			onClick={onClick}
		>
			{children}
		</StyledButton>
	);
};

const StyledButton = styled.button`
	${(props) => props.$borderStyle}
	${(props) => props.$paddingStyle}
	${(props) => props.$roundedStyle}
	${(props) => props.$sizeStyle}
	${(props) => props.$varientStyle}
	${pretendard_medium}

	cursor: pointer;
	margin: 0;

	&:disabled {
		background: var(--neutral-50, #babec1);
		cursor: default;
		opacity: 0.5;
	}
`;

export default Button;
