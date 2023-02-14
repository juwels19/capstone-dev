import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Flex, FormHelperText, Heading, Icon, ModalBody, ModalCloseButton, Stack, Text, useDisclosure } from "@chakra-ui/react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, FormControl, FormLabel, Input, Textarea
} from "@chakra-ui/react"
import { Select } from "chakra-react-select";
import { getSession } from "next-auth/react";
import { FaArrowLeft, FaPlay, FaPause, FaCheck } from "react-icons/fa"
import { HiPlayPause } from "react-icons/hi2";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

import prisma from "@prisma/index";

export default function TaskDetails(props) {

    const task = props.task;
    const router = useRouter();
    const toast = useToast();

    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    const [startDateTime, setStartDateTime] = useState("");
    const [productivityRating, setProductivityRating] = useState(0);
    const [notes, setNotes] = useState("");

    const [sessions, setSessions] = useState(props.sessions);
    const [totalSessionTime, setTotalSessionTime] = useState(0.0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [averageSessionTime, setAverageSessionTime] = useState(0.0);

    const { isOpen: createSessionIsOpen, onOpen: createSessionOnOpen, onClose: createSessionOnClose } = useDisclosure();
    const { isOpen: editSessionIsOpen, onOpen: editSessionOnOpen, onClose: editSessionOnClose } = useDisclosure();
    const { isOpen: deleteSessionIsOpen, onOpen: deleteSessionOnOpen, onClose: deleteSessionOnClose } = useDisclosure();

    useEffect(() => {
        let interval = null;
        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1)
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    useEffect(() => {
        setProductivityRating(0);
        setNotes("")
    }, [createSessionIsOpen])

    useEffect(() => {
        // Use this function to recalculate the metrics for this task
        let numSessions = 0;
        let totalDuration = 0;
        for (let i in sessions) {
            let session = sessions[i]
            numSessions++;
            totalDuration += session.duration;
        }
        totalDuration = (totalDuration / 3600).toFixed(2);
        if (numSessions === 0) {
            setAverageSessionTime(0.0)
        } else {
            let avgSessionTimeHours = (totalDuration / numSessions).toFixed(2);
            setAverageSessionTime(avgSessionTimeHours)
        }
        setTotalSessionTime(totalDuration)
        setTotalSessions(numSessions)
    }, [sessions])

    const handleStopwatchStart = () => {
        setIsActive(true);
        setIsPaused(false);
        setStartDateTime(Date(Date.now()).toString())
    }

    const handleStopwatchPauseResume = () => {
        setIsPaused(!isPaused);
    }

    const handleStopwatchCompletion = () => {
        setIsPaused(true);
        createSessionOnOpen();
    }

    const updateSessions = async () => {
        const fetchRes = await fetch(`/api/sessions/fetch/${props.taskId}`, {method: "GET"})

        if (fetchRes.ok) {
            const body = await fetchRes.json()
            setSessions(body.body);
        }
    }

    const handleWorkingSessionCreation = async () => {
        console.log(productivityRating, notes)
        if (productivityRating === 0 || time === 0) {
            toast({
                position: "top-middle",
                title: "Working Session Creation Unsuccessful",
                description: "Please make sure all required fields are entered.",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        const body = {
            userId: props.userId,
            taskId: props.taskId,
            startDateTime: startDateTime,
            duration: time,
            productivityRating: productivityRating,
            notes: notes
        }

        const sessionCreationRes = await fetch("/api/sessions/new", {method: "POST", body: JSON.stringify(body)});
        
        setIsActive(false);
        setTime(0)
        setNotes("")
        setProductivityRating(0)
        setStartDateTime("")
        createSessionOnClose();
        updateSessions();
        toast({
            position: "top-right",
            title: "Working Session Creation Successful!",
            status: "success",
            duration: 3000,
            isClosable: true
        });
    }

    const handleBackButton = () => {

        if (isActive) {
            toast({
                position: "top-middle",
                title: "Active Working Session!",
                description: "Save your working session before leaving this page!",
                status: "error",
                duration: 6000,
                isClosable: true
            });
        } else {
            router.push("/tasklist")
        }

    }

    const effortValueToLabel = {
        1: "0-2 hours",
        2: "2-4 hours",
        3: "4-6 hours",
        4: "6-8 hours",
        5: "8+ hours",
    }

    const productivityRatingOptions = [
        {value: 1, label: 1},
        {value: 2, label: 2},
        {value: 3, label: 3},
        {value: 4, label: 4},
        {value: 5, label: 5},
    ];

    const calculateDateDifference = (dueDate) => {
        const msInDay = 86400000;
        let currDate = Date.now()
        // Convert the due date string to milliseconds for comparison
        let dueDateNumeric = Date.parse(dueDate)
        const diff = dueDateNumeric - currDate;
        if (diff >= 0) {
            // Due date is more than a day in the future
            const daysAway = Math.floor(diff / msInDay);
            if (daysAway > 1) {
                return `(due in ${daysAway} days)`;
            } else {
                return `(due in ${daysAway} day)`;
            }
        } else {
            const daysAgo = Math.abs(Math.floor(diff / msInDay)) - 1;
            if (daysAgo > 1) {
                return `(was due ${daysAgo} days ago)`
            } else {
                return `(was due ${daysAgo} day ago)`
            }
        }

    }

    return (
        <Box px="5%" pt="2%">
            <Modal size="2xl" isOpen={createSessionIsOpen} onClose={createSessionOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Working Session Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel fontWeight="bold">Working Session Duration (seconds)</FormLabel>
                            <Input 
                                width="50%"
                                isReadOnly
                                variant="outline" 
                                bg="white" 
                                onChange={(e) => setTime(e.target.value)}
                                value={time}
                            />
                        </ FormControl>
                        <FormControl isRequired>
                            <FormLabel mt="2%" fontWeight="bold">Productivity Rating</FormLabel>
                            <FormHelperText mb="1%">Rate how productive you felt your working session was. (DEFINE 1-5 MEANING)</FormHelperText>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a Productivity Rating"
                                options={productivityRatingOptions}
                                onChange={(e) => setProductivityRating(e.value)}
                            />
                        </ FormControl>
                        <FormControl>
                            <FormLabel mt="2%" fontWeight="bold">Notes</FormLabel>
                            <FormHelperText mb="1%">Add any notes or reflections about your working session</FormHelperText>
                            <Textarea onChange={(e) => setNotes(e.target.value)}/>
                        </FormControl>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={createSessionOnClose} width="100%">
                                Cancel
                            </Button>
                            <Button colorScheme="green" 
                                    width="100%" 
                                    type="submit"
                                    onClick={handleWorkingSessionCreation}>
                                Save Working Session
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Button 
                leftIcon={<Icon as={FaArrowLeft} color="black"/>}
                size="md"
                variant="link"
                onClick={handleBackButton}
            >
                <Text color="black">Back to Tasklist</Text>
            </Button>
            <Heading as="h1" size="xl" pt="1%">
                Task Details
            </Heading>
            <Flex mt="2%">
                <Text as="b">Task Name:</Text>
                <Text ml="0.5%">{task.taskName}</Text>
            </Flex>
            <Flex mt="1%">
                <Text as="b">Course:</Text>
                <Text ml="0.5%">{task.course.courseName}</Text>
                <Text as="b" ml="2%">Due Date:</Text>
                <Text ml="0.5%">{new Date(task.dueDate).toDateString()}</Text>
                <Text ml="1%" color="gray.500">{calculateDateDifference(task.dueDate)}</Text>
                <Text as="b" ml="2%">Effort:</Text>
                <Text ml="0.5%">{task.effortRating}</Text>
                <Text as="b" ml="2%">Estimated Time:</Text>
                <Text ml="0.5%">{effortValueToLabel[task.effortRating]}</Text>
            </Flex>
            <Flex mx="1%" mt="3%" justify="space-evenly">
                <Card bg="blue.50" size="lg">
                    <CardHeader>
                        <Text as="b" fontSize="2xl">
                            Metrics
                        </Text>
                    </CardHeader>
                    <CardBody>
                        <Flex>
                            <Stack align="center">
                                <Text align="center" as="b" fontSize="xl">Total Time Spent (hours)</Text>
                                <Text as="b" fontSize="3xl">{totalSessionTime}</Text>
                            </Stack>
                            <Stack align="center" mx="2%">
                                <Text align="center" as="b" fontSize="xl">Number of Sessions</Text>
                                <Text as="b" fontSize="3xl">{totalSessions}</Text>
                            </Stack>
                            <Stack align="center">
                                <Text align="center" as="b" fontSize="xl">Average Session Time (hours)</Text>
                                <Text as="b" fontSize="3xl">{averageSessionTime}</Text>
                            </Stack>
                        </Flex>
                    </CardBody>
                </Card>
                <Card bg="blue.50" size="md" minWidth="25%">
                    <CardHeader>
                        <Text as="b" fontSize="2xl">
                            Stopwatch
                        </Text>
                    </CardHeader>
                    <CardBody  px="4%">
                        <Stack align="center">
                            <Text align="center" as="b" fontSize="4xl">
                                {("0" + Math.floor(time / 3600)).slice(-2)}:
                                {("0" + Math.floor((time / 60) % 60)).slice(-2)}:
                                {("0" + (time % 60)).slice(-2)}
                            </Text>
                            <ButtonGroup>
                                {!isActive && 
                                    <Button size="md" bg="white" aria-label="start-stopwatch" leftIcon={<Icon as={FaPlay}/>}
                                        onClick={handleStopwatchStart}
                                    >Start Timer</Button>
                                }
                                {(isActive && !isPaused) && 
                                    <Button 
                                        size="md" 
                                        bg="white" 
                                        aria-label="stop-stopwatch" 
                                        leftIcon={<Icon as={FaPause}/>}
                                        onClick={handleStopwatchPauseResume}
                                    >Pause Timer</Button>
                                }
                                {(isActive && isPaused) && 
                                    <Button 
                                        size="md" 
                                        bg="white" 
                                        aria-label="stop-stopwatch" 
                                        leftIcon={<Icon as={HiPlayPause} boxSize="1.5em"/>}
                                        onClick={handleStopwatchPauseResume}
                                    >Resume Timer</Button>
                                }
                            </ButtonGroup>
                            {(isActive && isPaused) && 
                                <Button 
                                    size="md" 
                                    bg="green.200" 
                                    aria-label="stop-stopwatch" 
                                    leftIcon={<Icon as={FaCheck}/>}
                                    onClick={handleStopwatchCompletion}
                                >Complete Session</Button>
                            }
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>
            <Heading as="h2" size="lg" mt="3%">Working Session Log</Heading>
            <Text mt="1%">Record the time spent on the task by turning on the stopwatch in the top right corner to start a working session.</Text>
        </Box>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    const taskId = parseInt(context.query.taskId)

    if (isNaN(parseInt(taskId))) {
        return {
            redirect: {
                destination: "/tasklist",
                permanent: false
            },
            props: {
                message: "Invalid task id!"
            },
        };
    }

    const task = await prisma.task.findUnique({where: {id: taskId}, include: {course: true}})
    console.log(task);

    if (task === null) {
        return {
            redirect: {
                destination: "/tasklist",
                permanent: false
            },
            props: {
                message: "That task doesn't exist!",
                error: true
            },
        };
    }

    const sessions = await prisma.session.findMany({
        where: {
            task: {
                is: {
                    id: task.id
                }
            }
        }
    })

    console.log(sessions);

    console.log("session=getServerSideProps(context) in login: ", session)

    if (!session) {
        if (session.id !== task.userId) {
            return {
                redirect: {
                    destination: "/tasklist",
                    permanent: false
                },
                props: {
                    message: "You are not permitted to view that page!",
                    error: true
                },
            };
        }
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
            taskId: taskId,
            userId: session.id,
            task: task,
            sessions: sessions,
        }
    };
}