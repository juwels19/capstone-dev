import { Box, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";

export default function Login() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <main>
            <div className="flex h-screen justify-center items-center">
                <Card size="lg" colorScheme="gray" variant="filled" align="left" justify="center">
                    <CardHeader>
                        <Heading>
                            Login
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <FormControl>
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
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Button width="100%" colorScheme="blue" size="md" marginTop="20px">
                                Login
                            </Button>
                        </FormControl>
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
            </div>
        </main>
    );
}