import { SmallAddIcon, ChevronRightIcon } from "@chakra-ui/icons";
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
import Task from "../src/components/Task"; // TODO: remove once table is working
import Table from "@components/Table";
import NoTasks from "@components/NoTasks";

import Link from "next/link";
import prisma from "@prisma/index";
import EditTaskModal from "@components/EditTaskModal";
import DeleteTaskModal from "@components/DeleteTaskModal";

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

            updateTasks("Creation")
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

    const updateTasks = async (event) => {
        const fetchRes = await fetch(`/api/tasks/fetch/${props.userId}`, {method: "GET"})

        if (fetchRes.ok) {
            const body = await fetchRes.json()
            setTasks(body.body);
            toast({
                position: "top-right",
                title: `Task ${event} Successful!`,
                status: "success",
                duration: 3000,
                isClosable: true
            });
        }
    }

    const COLUMNS = [
        {
            Header: '',
            accessor: 'taskName',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                        {`${value}`}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Course',
            accessor: 'course.courseName',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {`${value}`}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Due Date',
            accessor: 'dueDate',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {`${value}`}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Predicted Effort',
            accessor: 'effortRating',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {`${value}`}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Estimated Time',
            accessor: 'completionTimeEstimate',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {`${value}`}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Actual Time',
            accessor: 'actual_time',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {`${value}`}
                    </Text>
                </>
                );
            },
        },
         {
            Header: '',
            accessor: 'id',
            width: 180,
            minWidth: 180,
            maxWidth: 180,
            Cell: ({ value }) => {
                return (
                <>
                    <Link href={`/task/${value}`}>
                        <Button 
                            rightIcon={<ChevronRightIcon boxSize="1.5em"/>} 
                            size="md" 
                            colorScheme="blue">
                            Open Task
                        </Button>
                    </Link>
                </>
                );
            },
        },
        {
            Header: '',
            accessor: (row) => row,
            id: 'editColumn',
            width: 20,
            minWidth: 20,
            maxWidth: 20,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                    <EditTaskModal
                        task={value} 
                        updateTaskHandler={updateTasks}
                        courseOptions={courseOptions}
                        handleCreateCourse={handleCreateCourse}
                    />
                </>
                );
            },
        },
        {
            Header: '',
            accessor: (row) => row,
            id: 'deleteColumn',
            width: 20,
            minWidth: 20,
            maxWidth: 20,
            Cell: ({ value }) => {
                return (
                <>
                    <DeleteTaskModal
                        task={value} 
                        updateTaskHandler={updateTasks}
                        courseOptions={courseOptions}
                        handleCreateCourse={handleCreateCourse}
                    />
                </>
                );
            },
        },
    ]

    return (
        <Box px="5%">   
            <Flex pt="5%">
                <Heading as="h1" size="2xl">
                    {props.userfirstName.charAt(0).toUpperCase() + props.userfirstName.substring(1).toLowerCase()}'s Task List
                </Heading>
                <Spacer/>
                <ButtonGroup ml="2%">
                    <Button rightIcon={<SmallAddIcon boxSize="1.5em"/>}
                            size="md" 
                            colorScheme="teal"
                            onClick={onOpen}>
                        Create Task
                    </Button>
                    <Button size="md"
                            colorScheme="red"
                            onClick={() => signOut({callbackUrl: "/"})}
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
                    </ModalBody>
                </ModalContent>
            </Modal>
            {
                tasks.length === 0 
                ? <NoTasks />
                : (
                    <Box padding="3% 0 0 0">
                        <Table 
                            columns={COLUMNS} 
                            data={tasks}
                            borderSpacing='0 15px'

                        />
                    </Box>
                )
            }
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
    const tasks = await prisma.task.findMany({where: {userId: session.id}, include: {course: true}})
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
            userId: session.id,
            userfirstName: session.firstName
        }
    };
}