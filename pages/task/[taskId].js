import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function Task(props) {

    return (
        <Box>
            <h1>This is task {props.taskId} </h1>
        </Box>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    const router = useRouter();

    const { taskId } = router.query;

    console.log("session=getServerSideProps(context) in login: ", session)

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            },
            props: {},
          };
    }
    return {
        props: {
            taskId: taskId,
            userId: session.id,
        }
    };
}