import { Box, Flex, Text } from "@chakra-ui/react";

export default function NoSessions() {
    return (
        <Box bg="gray.200" borderRadius="md" px="3%" py="2%" my="1%">
            <Flex>
                <Text>No working sessions logged. Start your first one by clicking the start button in the timer above! ✨</Text>
            </Flex>
        </Box>
    );
}