import { Box, Button, Card, CardBody, CardHeader, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";

export default function Signup() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

    const toast = useToast();
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        setConfirmPasswordInvalid(false);
        if (password != confirmPassword) {
            // set error message
            setConfirmPasswordInvalid(true);
            return
        }

        let body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        }

        let signupRes = await fetch("/api/auth/signup", {method: "POST", body: JSON.stringify(body)})
        if (signupRes.ok) {
            // Sign in the user once they create their account
            toast({
                position: "top-middle",
                title: "Signup Successful!",
                status: "success",
                duration: 9000,
                isClosable: true
            });
            signIn("credentials", {email: email, password: password, callbackUrl: "/tasklist"})
        } else {
            let body = await signupRes.json()
            toast({
                position: "top-middle",
                title: "Signup Error",
                description: body.message,
                status: "error",
                duration: 9000,
                isClosable: true
            });
        }
    }

    return (
        <Center height="calc(100vh)">
            <Card size="lg" colorScheme="gray" variant="filled" align="left" justify="center">
                <CardHeader>
                    <Heading>
                        Signup
                    </Heading>
                </CardHeader>
                <CardBody>
                    <form method="post" action="api/auth/signup" onSubmit={handleSubmit}>
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
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>
                                First Name
                            </FormLabel>
                            <Input 
                                type="text" 
                                width="100%" 
                                variant="outline" 
                                bg="white" 
                                marginBottom="20px"
                                placeholder="Enter first name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>
                                Last Name
                            </FormLabel>
                            <Input 
                                type="text" 
                                width="100%" 
                                variant="outline" 
                                bg="white" 
                                marginBottom="20px"
                                placeholder="Enter last name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired>
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
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl 
                            isRequired 
                            isInvalid={confirmPasswordInvalid}
                        >
                            <FormLabel>
                                Confirm Password
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    bg="white"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    isInvalid={confirmPasswordInvalid}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {confirmPasswordInvalid && 
                                <FormErrorMessage >Please make sure passwords match.</FormErrorMessage>
                            }
                        </FormControl>
                        <Button type="submit" width="100%" colorScheme="blue" size="md" marginTop="20px">
                            Signup
                        </Button>
                    </form>
                    <Box align="center" paddingTop="20px">
                        <Text fontSize="xs">
                            Already have an account?
                        </Text>
                        <Link as={NextLink} href="/login" fontSize="xs" color="blue.600">
                            login here
                        </Link>
                    </Box>
                </CardBody>
            </Card>
        </Center>
    );
}