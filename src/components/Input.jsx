import styled, { css } from 'styled-components';
import { pretendard_medium, TextSizeM, TextSizeS } from '../GlobalStyle';

const STATES = {
	default: css`
		background-color: var(--neutral-10, #ffffff);
		border: 0.125rem solid var(--neutral-50, #babec1);
	`,
	success: css`
		background-color: var(--success-surface, #f7f7f7);
		border: 0.125rem solid var(--success-main, #3bb143);
	`,
	warning: css`
		background-color: var(--warning-surface, #fff9f2);
		border: 0.125rem solid var(--warning-main, #f5a623);
	`,
	danger: css`
		background-color: var(--danger-surface, #fff4f2);
		border: 0.125rem solid var(--danger-main, #d0021b);
	`,
};

const MESSAGES = {
	default: css`
		color: var(--neutral-60, #989b9d);
	`,
	success: css`
		color: var(--success-main, #3bb143);
	`,
	warning: css`
		color: var(--warning-main, #f5a623);
	`,
	danger: css`
		color: var(--danger-main, #d0021b);
	`,
};

const Input = ({
	type = 'text',
	isLabel = true,
	label = 'label',
	placeholder = 'placeholder',
	message = 'helper text',
	state,
	disabled = false,
	onChange,
}) => {
	const stateStyle = STATES[state];
	const messageStyle = MESSAGES[state];

	return (
		<StyledInputWrapper>
			{isLabel && <StyledLabel htmlFor={label}>{label}</StyledLabel>}
			<StyledInput
				id={label}
				type={type}
				placeholder={placeholder}
				stateStyle={stateStyle}
				disabled={disabled}
				onChange={onChange}
			/>
			{state !== 'default' && <StyledMessage messageStyle={messageStyle}>{message}</StyledMessage>}
		</StyledInputWrapper>
	);
};
export default Input;

const StyledInputWrapper = styled.div`
	${pretendard_medium}

	align-items: start;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	height: 2rem;
	justify-content: center;
	margin: 0;
	padding: 0;
	width: 100%;
`;

const StyledLabel = styled.label`
	${TextSizeS}
`;

const StyledInput = styled.input`
	${(props) => props.stateStyle}
	${TextSizeM}

	border-radius: var(--rounded-sm, 0.5rem);
	height: 100%;
	margin: 0;
	padding: 0.5rem 1rem;
	width: 100%;

	&:disabled {
		background: var(--neutral-50, #babec1);
		opacity: 0.5;
		outline: none;
	}

	&:focus {
		border: 0.125rem solid var(--primary-main, #d9983e);
		outline: none;
	}
`;

const StyledMessage = styled.p`
	${(props) => props.messageStyle}
	${TextSizeS}

	margin: 0;
`;
