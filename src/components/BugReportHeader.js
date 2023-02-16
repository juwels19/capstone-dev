import { Stack, Text, Center } from "@chakra-ui/react";

export default function BugReportHeader() {
    return (
        <>
            <Center width="100%" height="70px" backgroundColor="#EDF2F7">
                <Stack align="center">
                    <Text textStyle="caption-bold"> 
                    Found a bug? Report it here!
                    </Text>
                    <Text color="#0B64CC" textStyle="caption-bold">
                        🐞{" "}
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScEgjWvrHAC_dGn0Xc2NCl9GVv4fS5ZImhkwlyQ6F4p4km5eA/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer">
                            Bug Report Form
                        </a>
                        {" "}🐞
                    </Text>
                </Stack>
            </Center>
      </>
    );
}