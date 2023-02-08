import { Center, Button, ButtonGroup, Card, CardBody, CardFooter, Text } from "@chakra-ui/react";
import Image from "next/image";
import timelyLogo from "../public/timely_logo.png";
import { useRouter } from 'next/router'

export default function Home() {

    const router = useRouter();

    return (
            <Center height="calc(100vh)">
              <Card size="lg" colorScheme="gray" variant="filled" align="center" justify="center">
                  <CardBody>
                      <Image src={timelyLogo} alt="timely logo"/>
                      <Text className="font-bold" mt="2%">
                          Manage, understand, and improve your time management skills through self-monitoring
                      </Text>
                  </CardBody>
                  <CardFooter>
                      <ButtonGroup colorScheme="blue" size="lg" gap="100">
                          <Button width="200px" onClick={() => router.push("/login")}>
                              Login
                          </Button>
                          <Button width="200px" onClick={() => router.push("/signup")}>
                              Signup
                          </Button>
                      </ButtonGroup>
                  </CardFooter>
              </Card>
            </Center>
    );
}