import { SmallAddIcon, ChevronRightIcon, InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Spacer, Tag, Tooltip, Text, useDisclosure, useToast, HStack, Container, Divider } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import { useState, useEffect } from "react";
import { signOut, getSession } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Select, CreatableSelect } from "chakra-react-select";

import prisma from "@prisma/index";
import Table from "@components/Table";
import NoTasks from "@components/tasks/NoTasks";
import CompleteTaskModal from "@components/tasks/CompleteTaskModal";
import EditTaskModal from "@components/tasks/EditTaskModal";
import DeleteTaskModal from "@components/tasks/DeleteTaskModal";
import { calculateDateDifference, getHMSfromDuration } from "src/utils/dateUtils"

import ConfettiExplosion from 'react-confetti-explosion';

export default function Tasklist(props) {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const [taskName, setTaskName] = useState("");
    const [courseSelected, setCourseSelected] = useState(null);
    const [effort, setEffort] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [courseOptions, setCourseOptions] = useState(props.courses);
    const [tasks, setTasks] = useState(props.tasks);

    const [isExploding, setIsExploding] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsExploding(false), 3000);
        return () => clearTimeout(timer);
      }, [isExploding]);

    useEffect(() => {
        setTaskName("")
        setEffort(0)
        setDueDate("")
        setCourseSelected(null)
    }, [isOpen])

    const effortOptions = [
        {value: 1, label: "1 (< 0.5 hours)"},
        {value: 2, label: "2 (0.5-1 hours)"},
        {value: 3, label: "3 (1-3 hours)"},
        {value: 5, label: "5 (3-6 hours)"},
        {value: 8, label: "8 (6-12 hours)"},
        {value: 13, label: "13 (12+ hours)"},
    ];

    const effortValueToLabel = {
        1: "< 0.5 hours",
        2: "0.5 - 1 hours",
        3: "1 - 3 hours",
        5: "3 - 6 hours",
        8: "6 - 12 hours",
        13: "12+ hours"
    }

    const getTimeDisplay = (hours, minutes, seconds) => {
        return (
            hours ? `${hours.toFixed(0)}h ${minutes.toFixed(0)}m` : 
            minutes ? `${minutes.toFixed(0)}m ${seconds.toFixed(0)}s` :
            seconds ? `${seconds.toFixed(0)}s` : "-"
        )
    }

    const calculateSessionTime = (sessions) => {
        var totalDuration = 0;
        for (const session of sessions) {
            totalDuration += session.duration;
        }

        return getTimeDisplay(...getHMSfromDuration(totalDuration));
    }

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
        if (taskName && effort && !isNaN(Date.parse(dueDate)) && courseSelected) {
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

    const completedTasks = tasks.filter((task) => task.completed);
    const activeTasks = tasks.filter((task) => !task.completed);

    const COLUMNS = [
        {
            Header: '',
            id: 'checkbox',
            accessor: (row) => row,
            Cell: ({ value }) => {
                return (
                <>  
                    <CompleteTaskModal
                        task={value}
                        updateTaskHandler={updateTasks}
                        confettiHandler={setIsExploding}
                        getTimeDisplay={getTimeDisplay}
                    />
                </>
                );
            },
        },
        {
            Header: 'Task',
            accessor: 'taskName',
            Cell: ({ value }) => {
                return (
                <>
                    <Text>{`${value}`}</Text>
                </>
                );
            },
        },
        {
            Header: 'Course',
            accessor: 'course',
            Cell: ({ value }) => {
                let bgColor = value.colourCode;
                if ( bgColor === null) {
                    bgColor = "gray.300"
                }
                return (
                <>
                    <Tag backgroundColor={bgColor} textColor="white">
                        <Text fontSize='14px'>{value.courseName}</Text>
                    </Tag>
                </>
                );
            },
        },
        {
            Header: 'Due Date',
            accessor: 'dueDate',
            id: "due_date",
            Cell: ({ value }) => {
                const dateOptions = {
                    timeZone: "UTC",
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
                return (
                <>
                    <Text as="b">
                        {new Date(`${value}`).toLocaleDateString("en-US", dateOptions)}
                    </Text>
                    <Text>
                        {calculateDateDifference(`${value}`)}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Predicted Effort',
            accessor: 'effortRating',
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
            accessor: 'effortRating',
            id: "time_estimate",
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                    {effortValueToLabel[value]}
                    </Text>
                </>
                );
            },
        },
        {
            Header: 'Actual Time',
            accessor: 'sessions',
            Cell: ({ value }) => {
                return (
                <>
                    <Text>
                        {calculateSessionTime(value)}
                    </Text>
                </>
                );
            },
        },
         {
            Header: '',
            accessor: 'id',
            id: 'openTask',
            width: 150,
            minWidth: 150,
            maxWidth: 150,
            Cell: ({ value }) => {
                return (
                <>
                    <Link href={`/task/${value}`}>
                        <Button 
                            rightIcon={<ChevronRightIcon/>} 
                            size="md"
                            colorScheme="blue">
                            <Text fontSize='14px'>Open Task</Text>
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
            width: 15,
            minWidth: 15,
            maxWidth: 15,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                    <EditTaskModal
                        task={value} 
                        updateTaskHandler={updateTasks}
                        courseOptions={courseOptions}
                        handleCreateCourse={handleCreateCourse}
                        isDisabled={value.completed}
                    />
                );
            },
        },
        {
            Header: '',
            accessor: (row) => row,
            id: 'deleteColumn',
            width: 15,
            minWidth: 15,
            maxWidth: 15,
            Cell: ({ value }) => {
                return (
                    <DeleteTaskModal
                        task={value} 
                        updateTaskHandler={updateTasks}
                        courseOptions={courseOptions}
                        handleCreateCourse={handleCreateCourse}
                        isDisabled={false}
                    />
                );
            },
        },
    ]

    return (
        <Container maxW='container.xl'>
            <Flex pt="5%" pb="5%">
                <Heading as="h1" size="2xl">
                    {props.userfirstName.charAt(0).toUpperCase() + props.userfirstName.substring(1).toLowerCase()}&apos;s Task List
                </Heading>
                <Spacer/>
                <ButtonGroup ml="2%" alignItems="center">
                    <Button rightIcon={<SmallAddIcon boxSize="1.5em"/>}
                            size="md" 
                            colorScheme="teal"
                            onClick={onOpen}>
                        Create Task
                    </Button>
                    <a 
                        href="https://docs.google.com/document/d/14Q9OELTXoTvf7YjV_IWmaKr41ze2SHFNFBhw1KKV-i8/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="md"
                                colorScheme="blue"
                                rightIcon={<ExternalLinkIcon />}
                            >
                                Help
                            </Button>
                    </a>
                    <Button size="md"
                            colorScheme="red"
                            onClick={() => signOut({callbackUrl: "/"})}>
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
                        <FormControl mt="2%" isRequired>
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
                            <HStack spacing={0.5}>
                                <FormLabel fontWeight="bold">Estimated Effort</FormLabel>
                                {/* <Tooltip label="This is a test tooltip" >
                                    <InfoIcon />
                                </Tooltip> */}
                            </HStack>
                            
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
                                type="date"
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
            <Heading as="h2" size="lg">
                Active Tasks
            </Heading>
            {isExploding && <ConfettiExplosion force={0.4} duration={2000} particleCount={30} width={600} />}
            {
                activeTasks.length === 0 
                ? <NoTasks />
                : (
                    <>
                        <Table 
                            columns={COLUMNS} 
                            data={activeTasks}
                        />
                    </>
                )
            }
            {completedTasks.length > 0 && (
                <>
                    <Divider mt="2%" />
                    <Heading as="h2" size="lg" mt="2%">
                        Completed Tasks
                    </Heading>
                    <Table 
                        columns={COLUMNS} 
                        data={completedTasks}
                    />
                </>
            )}
        </Container>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);

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
    const tasks = await prisma.task.findMany({
        where: {
            userId: session.id
        }, 
        include: {
            course: true, 
            sessions: {
                select: {
                    duration: true
                }
            }
        },
        orderBy: {
            course: {
                courseName: "desc"
            }
        }
    })

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