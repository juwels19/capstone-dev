import { Box, Button, Card, CardBody, CardHeader, Center, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from 'next/router'

export default function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleClick = () => setShow(!show);

    const toast = useToast();
    const router = useRouter();
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signIn("credentials", {email: email, password: password, redirect: false}).then(
            ({ok}) => {
                if (ok) {
                    router.push("/tasklist")
                } else {
                    toast({
                        position: "top-middle",
                        title: "Login Failed",
                        description: "The email and/or password entered is incorrect.",
                        status: "error",
                        duration: 3000,
                        isClosable: true
                    });
                }
            }
        );
    }

    return (
        <Center height="calc(100vh)">
            <Card size="lg" colorScheme="gray" variant="filled" align="left" justify="center">
                <CardHeader>
                    <Heading>
                        Login
                    </Heading>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <FormControl isRequired>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <Input 
                                type="email" 
                                width="100%" 
                                variant="outline" 
                                bg="white" 
                                marginBottom="20px"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormLabel>
                                Password
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    bg="white"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Button type="submit" width="100%" colorScheme="blue" size="md" marginTop="20px">
                                Login
                            </Button>
                        </FormControl>
                    </form>
                    <Box align="center" paddingTop="20px">
                        <Text fontSize="xs">
                            Don't have an account?
                        </Text>
                        <Link as={NextLink} href="/signup" fontSize="xs" color="blue.600">
                            SIGN UP HERE
                        </Link>
                    </Box>
                </CardBody>
            </Card>
        </Center>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);    
    if (session) {
        return {
            redirect: {
              destination: '/tasklist',
              permanent: false,
            },
          };
    }
    return {
        props: {}
    };
}