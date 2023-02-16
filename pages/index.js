import { Center, Button, ButtonGroup, Card, CardBody, CardFooter, Text, VStack} from "@chakra-ui/react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import timeifyLogo from "public/timeify.svg"
import { useRouter } from 'next/router'

export default function Home() {

    const router = useRouter();

    return (
            <Center h="80vh">
              <Card size="lg" variant="ghost" align="center" justify="center">
                  <CardBody>
                      <Image src={timeifyLogo} alt="timeify logo"/>
                  </CardBody>
                  <CardFooter>
                    <VStack>
                      <Text align="center" as="b" mb="5%">
                          Manage, understand, and improve your time management skills through self-monitoring
                      </Text>
                      <ButtonGroup colorScheme="blue" size="lg" gap="100">
                          <Button width="200px" onClick={() => router.push("/login")}>
                              Login
                          </Button>
                          <Button width="200px" onClick={() => router.push("/signup")}>
                              Signup
                          </Button>
                      </ButtonGroup>
                    </VStack>
                  </CardFooter>
              </Card>
            </Center>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/tasklist",
                permanent: false
            }
          };
    }
    return {
        props: {}
    };
}