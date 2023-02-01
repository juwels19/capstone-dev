import { SmallAddIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import { Select, CreatableSelect } from "chakra-react-select";
import Task from "../src/components/Task";
import NoTasks from "@components/NoTasks";

import prisma from "@prisma/index";

export default function Tasklist(props) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [taskName, setTaskName] = useState("");
    const [courseSelected, setCourseSelected] = useState(null);
    const [effort, setEffort] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [courseOptions, setCourseOptions] = useState(props.courses);
    const [tasks, setTasks] = useState(props.tasks)

    useEffect(() => {
        setTaskName("")
        setEffort(0)
        setDueDate("")
        setCourseSelected(null)
    }, [isOpen])

    const effortOptions = [
        {value: 1, label: "1 (0-2 hours)"},
        {value: 2, label: "2 (2-4 hours)"},
        {value: 3, label: "3 (4-6 hours)"},
        {value: 4, label: "4 (6-8 hours)"},
        {value: 5, label: "5 (8+ hours)"},
    ];

    const postCreateCourse = async (newCourseName, userId) => {
        let body = {
            courseName: newCourseName,
            userId: userId,
        }
        //TODO add error handling here
        await fetch("/api/courses/new", {method: "POST", body: JSON.stringify(body)})
    }

    const handleCreateCourse = async (newCourseName, userId) => {
        setIsLoading(true);
        //TODO add error handling here
        const newCourse = {
            label: newCourseName,
            value: newCourseName
        }
        await postCreateCourse(newCourseName, userId)
        setCourseOptions((previousOptions) => [...previousOptions, newCourse])
        setIsLoading(false);

        setCourseSelected(newCourse)
    }
    
    const handleCreateTaskSubmit = async (event) => {
        event.preventDefault();
        if (taskName, effort, !isNaN(Date.parse(dueDate))) {
            // Data is valid for task creation
            let body = {
                taskName: taskName,
                courseName: courseSelected,
                effort: effort,
                dueDate: dueDate,
                userId: props.userId
            }

            const newTaskRes = await fetch("/api/tasks/new", {method: "POST", body: JSON.stringify(body)})
            let resBody = await newTaskRes.json()

            console.log(resBody)

            setTasks((previousTasks) => [...previousTasks, resBody])
            toast({
                position: "top-right",
                title: "Task Creation Successful!",
                status: "success",
                duration: 3000,
                isClosable: true
            });
            onClose();
        } else {
            toast({
                position: "top-middle",
                title: "Task Creation Unsuccessful",
                description: "Please make sure all required fields are entered.",
                status: "error",
                duration: 3000,
                isClosable: true
            });
        }
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
                        <form method="POST"
                              action="api/task/new"
                              >
                            <FormControl isRequired>
                                <FormLabel fontWeight="bold">Task Name</FormLabel>
                                <Input 
                                    width="100%" 
                                    variant="outline" 
                                    bg="white" 
                                    placeholder="Enter a task name"
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                            </ FormControl>
                            <FormControl mt="2%">
                                <FormLabel fontWeight="bold">Assign Course</FormLabel>
                                <FormHelperText mb="1%">Assigning a course helps keep your tasks organized. We recommend assigning a course to a task.</FormHelperText>
                                <CreatableSelect 
                                    placeholder="Select a course or type to create a new one..." 
                                    size="md"
                                    isClearable
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    options={courseOptions}
                                    onCreateOption={(value) => handleCreateCourse(value, props.userId)}
                                    onChange={(newValue) => setCourseSelected(newValue)}
                                    value={courseSelected}
                                />
                            </FormControl>
                            <FormControl mt="2%" isRequired>
                                <FormLabel fontWeight="bold">Effort</FormLabel>
                                <FormHelperText mb="1%">To help you start estimating time and effort, select a range that you think fits best.</FormHelperText>
                                <Select 
                                    placeholder="Select effort..." 
                                    size="md"
                                    options={effortOptions}
                                    onChange={(e) => setEffort(e.value)}
                                />
                            </FormControl>
                            <FormControl mt="2%" isRequired>
                                <FormLabel fontWeight="bold">Due Date</FormLabel>
                                <Input 
                                    width="100%"
                                    variant="outline"
                                    bg="white"
                                    type="datetime-local"
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </FormControl>
                            <ButtonGroup sz="md" mt="5%" minWidth="100%">
                                <Button colorScheme="gray" onClick={onClose} width="100%">
                                    Cancel
                                </Button>
                                <Button colorScheme="green" 
                                        width="100%" 
                                        type="submit"
                                        onClick={handleCreateTaskSubmit}>
                                    Create Task
                                </Button>
                            </ButtonGroup>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex pt="50px" minWidth="max-content">
                <Text as="b">
                    Tag
                </Text>
                <Text as="b">
                    Due Date
                </Text>
                <Text as="b">
                    Predicted Effort
                </Text>
                <Text as="b">
                    Estimated Time
                </Text>
                <Text as="b">
                    Actual Time
                </Text>
            </Flex>
            {tasks.length === 0 && <NoTasks />}
            {tasks.length > 0 && tasks.map((task) => (
                <Task task={task} />))}
            
        </Box>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    console.log("session=getServerSideProps(context) in login: ", session)

    // Get the courses associated with this user
    const courses = await prisma.course.findMany({where: {userId: session.id}})
    var courseNames = [];
    for (const course of courses) {
        courseNames.push({
            value: course.courseName,
            label: course.courseName
        });
    }

    // Get the tasks associated with this user
    const tasks = await prisma.task.findMany({where: {userId: session.id}})
    console.log(tasks)

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
            courses: courseNames,
            tasks: tasks,
            userId: session.id
        }
    };
}