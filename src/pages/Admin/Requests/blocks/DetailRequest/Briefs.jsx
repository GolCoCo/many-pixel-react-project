import React from 'react';
import { Text } from '@components/Text';
import { Box } from '@components/Box';
import { questionEnums } from '@constants/enums';
import { useQuery } from '@apollo/client';
import { CHOICE } from '@graphql/queries/choice';
import processString from 'react-process-string';
import { textWithUrlConfig } from '@constants/utils';

const Choice = ({ b, n }) => {
    const { loading, data } = useQuery(CHOICE, { variables: { id: b.answer } });
    if (loading) return <div></div>;

    const { Choice } = data;

    if (!Choice) return <div></div>;

    const { label } = Choice;
    const choice = {
        ...b,
        answer: label,
    };

    return <TextAnswer b={choice} n={n} />;
};

const TextAnswer = ({ b, n }) => {
    return (
        <Box $d="flex" $my="8">
            <Text $pr="2" $textVariant="P4" $colorScheme="primary">
                {`${n + 1}. `}
            </Text>
            <Box>
                <Text $textVariant="P4" $colorScheme="primary">
                    {`Q: ${b.question}`}
                </Text>
                <Text $textVariant="P4" $colorScheme="primary" $whiteSpace="pre-line">
                    A: {b.answerType === questionEnums.FREE_TEXT.value ? processString(textWithUrlConfig)(b.answer) : b.answer}
                </Text>
            </Box>
        </Box>
    );
};

const Answer = ({ b, n }) => {
    const answerTypeMap = {
        [questionEnums.RADIO.value]: () => <Choice b={b} n={n} />,
        [questionEnums.DROPDOWN.value]: () => <Choice b={b} n={n} />,
        [questionEnums.SINGLE_TEXT.value]: () => <TextAnswer b={b} n={n} />,
        [questionEnums.MULTIPLE_TEXT.value]: () => <TextAnswer b={b} n={n} />,
        [questionEnums.FREE_TEXT.value]: () => <TextAnswer b={b} n={n} />,
    };

    const AnswerComponent = answerTypeMap[b.answerType] || (() => <TextAnswer b={b} n={n} />);
    return <AnswerComponent />;
};

export const Briefs = ({ brief }) => {
    return brief.map((b, i) => <Answer b={b} n={i} key={i} />);
};
