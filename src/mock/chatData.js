const chatData = {
	_id: ObjectId('678472be2ab98b1c64e9496a'),
	chat_id: 1,
	messages: [
		{
			role: 'user',
			content: "I've lived in Seoul for a long time.",
			grammar_feedback:
				'주어진 문장은 문법적으로 정확합니다. \n' +
				'\n' +
				'.주어진 문장은 현재 완료 시제를 사용하고 있어 과거부터 시작되어 지금까지 계속되어 온 특정 행동이나 상태를 나타내고 있습니다. "have lived"는 "살았다"라는 동사의 현재 완료형이며, "in Seoul"은 곳을 나타내는 부사구로 쓰였습니다. 추가로 "for a long time"은 오랜 시간 동안 이라는 시간을 나타내는 구문입니다.',
		},
		{
			role: 'assistant',
			content: "That's great! What do you enjoy most about living in Seoul?",
		},
		{
			role: 'user',
			content: "I've lived in Seoul for a long time.",
			grammar_feedback:
				'주어진 문장은 문법적으로 정확합니다. \n' +
				'\n' +
				`"I've lived in Seoul for a long time."은 현재 완료형을 사용한 문장으로, 과거에 시작된 행동이 현재까지 지속되고 있는 상황을 나타내는데 사용됩니다.`,
		},
		{
			role: 'assistant',
			content: "That's great! How do you like living in Seoul?",
		},
	],
};

export default chatData;
