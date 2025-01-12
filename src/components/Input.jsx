import styled, { css } from 'styled-components';
import { pretendard_medium, TextSizeM, TextSizeS } from '../GlobalStyle';

const STATES = {
	default: css`
		border: 0.125rem solid var(--neutral-50, #babec1);
	`,
	success: css`
		border: 0.125rem solid var(--success-main, #3bb143);
		background-color: var(--success-surface, #f7f7f7);
	`,
	warning: css`
		border: 0.125rem solid var(--warning-main, #f5a623);
		background-color: var(--warning-surface, #fff9f2);
	`,
	danger: css`
		border: 0.125rem solid var(--danger-main, #d0021b);
		background-color: var(--danger-surface, #fff4f2);
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

	position: relative;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	width: 100%;
`;

const StyledLabel = styled.label`
	${TextSizeS}
`;

const StyledInput = styled.input`
	${(props) => props.stateStyle}

	${TextSizeM}

	padding: 0.5rem 1rem;
	border-radius: var(--rounded-sm, 0.5rem);
	&:focus {
		outline: none;
		border: 0.125rem solid var(--primary-main, #d9983e);
	}
	&:disabled {
		outline: none;
		background: var(--neutral-50, #babec1);
		opacity: 0.5;
	}
`;

const StyledMessage = styled.p`
	${(props) => props.messageStyle}

	${TextSizeS}

  margin: 0;
`;
