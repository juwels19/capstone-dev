import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Task() {
    const router = useRouter();

    const { id } = router.query;

    return (
        <Box>
            <h1>This is task {id} </h1>
        </Box>
    );
}