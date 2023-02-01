import { Box, Flex, Text } from "@chakra-ui/react";

export default function NoTasks() {
    return (
        <Box bg="gray.200" borderRadius="md" px="3%" py="2%" my="1%">
            <Flex>
                <Text>Nothing to see here yet! Add your first task by clicking the "Create Task" button in the top right corner!</Text>
            </Flex>
        </Box>
    );
}