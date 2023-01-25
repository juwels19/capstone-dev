import { Button, ButtonGroup, Card, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useRouter } from 'next/router'

export default function Landing() {

    const router = useRouter();

    return (
        <div>
            <main>
                <div className="flex h-screen justify-center items-center">
                    <Card size="lg" colorScheme="gray" variant="filled" align="center" justify="center">
                        <CardBody>
                            <Text className="font-bold">
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
                </div>
            </main>
        </div>
    );
}