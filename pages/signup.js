import { Box, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";

export default function Signup() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
        <main>
            <div className="flex h-screen justify-center items-center">
                <Card size="lg" colorScheme="gray" variant="filled" align="left" justify="center">
                    <CardHeader>
                        <Heading>
                            Signup
                        </Heading>
                    </CardHeader>
                    <CardBody>
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
                                    marginBottom="20px"
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormLabel>
                                Confirm Password
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    bg="white"
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Button width="100%" colorScheme="blue" size="md" marginTop="20px">
                                Signup
                            </Button>
                        </FormControl>
                        <Box align="center" paddingTop="20px">
                            <Text fontSize="xs">
                                Already have an account?
                            </Text>
                            <Link as={NextLink} href="/login" fontSize="xs" color="blue.600">
                                LOGIN HERE
                            </Link>
                        </Box>
                    </CardBody>
                </Card>
            </div>
        </main>
    );
}