import { Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import tagData from "../mock_tags.json"

export default function Task(props) {
    const task = props.task;
    return (
        <Box bg="gray.200" borderRadius="md" px="3%" py="2%" my="1%">
            <Flex>
                <Checkbox size="lg" bg="white"></Checkbox>
                <Text as="b" ml="2%" fontSize="xs">
                    {task.taskName}
                </Text>
                <Text>

                </Text>
            </Flex>
        </Box>
    );
}