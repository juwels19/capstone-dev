import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Task from "../src/components/Task";
import taskData from "../src/mock_tasks.json";

export default function Tasklist() {

    return (
        <Box px="5%">
            <Flex pt="2%">
                <Heading as="h1" size="2xl">
                    Task List
                </Heading>
                <Spacer/>
                <Button rightIcon={<SmallAddIcon />} size="md" colorScheme="teal">
                    Create Task
                </Button>
            </Flex>
            <Flex pt="50px" minWidth="max-content">
                <Text as="b">
                    Mark Completed
                </Text>
                <Text as="b">
                    Task Name
                </Text>
                <Text as="b">
                    Tag
                </Text>
                <Text as="b">
                    Due Date
                </Text>
                <Text as="b">
                    Effort Rating
                </Text>
                <Text as="b">
                    Estimated Time
                </Text>
                <Text as="b">
                    Actual Time
                </Text>
            </Flex>
            {taskData.map((task) => (
                <Task task={task} />
            ))}
        </Box>
    );
}