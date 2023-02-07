import { Box, Button, ButtonGroup, Checkbox, Flex, Spacer, Text } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Task(props) {
    const task = props.task;
    console.log(task)
    return (
        <Box bg="gray.200" borderRadius="md" px="3%" py="2%" my="1%" key={`${task.id}-${task.userId}-${task.courseId}`}>
            <Flex>
                <Checkbox size="lg" bg="white" iconColor="gray.200"></Checkbox>
                <Text as="b" ml="2%" fontSize="xs">
                    {task.taskName}
                </Text>
                <Spacer />
                <ButtonGroup>
                    <Link href={`/task/${task.id}`}>
                        <Button 
                            rightIcon={<ChevronRightIcon boxSize="1.5em"/>} 
                            size="md" 
                            colorScheme="blue"
                            >
                            Open Task
                        </Button>
                    </Link>
                </ButtonGroup>
            </Flex>
        </Box>
    );
}