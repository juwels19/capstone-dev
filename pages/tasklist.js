import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Select, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import Task from "../src/components/Task";
import taskData from "../src/mock_tasks.json";

export default function Tasklist() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    function onModalClose() {
        toast({
            position: "top-middle",
            title: "Task Created Successfully!",
            status: "success",
            duration: 3000,
            isClosable: true
        });
        onClose();
    }

    return (
        <Box px="5%">   
            <Flex pt="2%">
                <Heading as="h1" size="2xl">
                    Task List
                </Heading>
                <Spacer/>
                <ButtonGroup>
                    <Button rightIcon={<SmallAddIcon />}
                            size="md" 
                            colorScheme="teal"
                            onClick={onOpen}>
                        Create Task
                    </Button>
                    <Button size="md"
                            colorScheme="red"
                            onClick={() => signOut({callbackUrl: "/landing"})}
                            >
                                Logout
                    </Button>
                </ButtonGroup>
            </Flex>
            <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Create New Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel fontWeight="bold">Task Name</FormLabel>
                            <Input 
                                width="100%" 
                                variant="outline" 
                                bg="white" 
                                placeholder="Enter a task name"
                            />
                        </ FormControl>
                        <FormControl mt="2%">
                            <FormLabel fontWeight="bold">Assign Course</FormLabel>
                            <FormHelperText>Assigning a course helps keep your tasks organized. We recommend assigning a course to a task.</FormHelperText>
                            <Select placeholder="Select a course..." mt="1%" w="50%">

                            </Select>
                        </FormControl>
                        <FormControl mt="2%" isRequired>
                            <FormLabel fontWeight="bold">Effort</FormLabel>
                            <FormHelperText>To help you start estimating time and effort, select a range that you think fits best.</FormHelperText>
                            <Select placeholder="Select effort..." mt="1%" w="50%">

                            </Select>
                        </FormControl>
                        <FormControl mt="2%" isRequired>
                            <FormLabel fontWeight="bold">Due Date</FormLabel>
                        </FormControl>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={onClose} width="100%">
                                Cancel
                            </Button>
                            <Button colorScheme="green" width="100%" onClick={onModalClose}>
                                Create Task
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex pt="50px" minWidth="max-content">
                <Text as="b">
                    Mark Completed
                </Text>
                <Text as="b">
                    Task Name
                </Text>
                <Text as="b">
                    Tag
                </Text>
                <Text as="b">
                    Due Date
                </Text>
                <Text as="b">
                    Effort Rating
                </Text>
                <Text as="b">
                    Estimated Time
                </Text>
                <Text as="b">
                    Actual Time
                </Text>
            </Flex>
            {taskData.map((task) => (
                <Task task={task} />
            ))}
        </Box>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    console.log("session=getServerSideProps(context) in login: ", session)
    
    if (session) {
        return {
            redirect: {
              destination: '/tasklist',
              permanent: false,
            },
          };
    }
    return {
        redirect: {
            destination: "/login",
            permanent: false
        },
        props: {}
    };
}