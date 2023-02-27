import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Flex, FormHelperText, Heading, Icon, ModalBody, ModalCloseButton, Stack, Text, useDisclosure, Container, VStack, HStack, CardFooter, Center, Grid, GridItem, Spacer } from "@chakra-ui/react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, FormControl, FormLabel, Input, Textarea, Tag
} from "@chakra-ui/react"
import { Select } from "chakra-react-select";
import { getSession } from "next-auth/react";
import { FaArrowLeft, FaPlay, FaPause, FaCheck } from "react-icons/fa"
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { HiPlayPause } from "react-icons/hi2";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

import prisma from "@prisma/index";
import {calculateDateDifference, getHMSfromDuration} from "src/utils/dateUtils"

import EditSessionModal from "@components/sessions/EditSessionModal";
import DeleteSessionModal from "@components/sessions/DeleteSessionModal";   
import NoSessions from "@components/sessions/NoSessions";

import Table from "@components/Table";

export default function TaskDetails(props) {
    const task = props.task;
    const router = useRouter();
    const toast = useToast();

    const [time, setTime] = useState(0);
    const [timePaused, setTimePaused] = useState(0)
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

    const [startDateTime, setStartDateTime] = useState();
    const [productivityRating, setProductivityRating] = useState(0);
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");

    const [sessions, setSessions] = useState(props.sessions);
    const [totalSessionTime, setTotalSessionTime] = useState(0.0);
    const [totalSessions, setTotalSessions] = useState(0);
    const [averageSessionTime, setAverageSessionTime] = useState(0.0);

    const { isOpen: createSessionIsOpen, onOpen: createSessionOnOpen, onClose: createSessionOnClose } = useDisclosure();

    useEffect(() => {
        let interval = null;
        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                const now = Math.floor(Date.now()/1000)
                const start = Math.floor(startDateTime/1000)
                setTime(now-start-timePaused)
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    useEffect(() => {
        setProductivityRating(0);
        setNotes("")
        setLocation("")
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
        if (numSessions === 0) {
            setAverageSessionTime(0.0)
        } else {
            let avgSessionTime = (totalDuration / numSessions).toFixed(2);
            setAverageSessionTime(avgSessionTime)
        }
        setTotalSessionTime(totalDuration)
        setTotalSessions(numSessions)
    }, [sessions])

    const handleStopwatchStart = () => {
        setIsActive(true);
        setIsPaused(false);
        setStartDateTime(Date.now())
    }

    const handleStopwatchPauseResume = () => {
        if (isPaused) {
            const now = Math.floor(Date.now()/1000)
            const start = Math.floor(startDateTime/1000)
            setTimePaused(now - (start + time))
        }
        setIsPaused(!isPaused);
    }

    const handleStopwatchCompletion = () => {
        setIsPaused(true);
        setTimePaused(0);
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
            startDateTime: Date(startDateTime).toString(),
            duration: time,
            productivityRating: productivityRating,
            notes: notes,
            location: location
        }

        const sessionCreationRes = await fetch("/api/sessions/new", {method: "POST", body: JSON.stringify(body)});
        
        setIsActive(false);
        setTime(0)
        setNotes("")
        setProductivityRating(0)
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
        1: "< 0.5 hours",
        2: "0.5 - 1 hours",
        3: "1 - 3 hours",
        5: "3 - 6 hours",
        8: "6 - 12 hours",
        13: "12+ hours"
    }

    const updateSessionHandler = async (event) => {
        const fetchRes = await fetch(`/api/sessions/fetch/${props.taskId}`, {method: "GET"})

        if (fetchRes.ok) {
            const body = await fetchRes.json()
            setSessions(body.body);
            toast({
                position: "top-right",
                title: `Session ${event} Successful!`,
                status: "success",
                duration: 3000,
                isClosable: true
            });
        }
    }

    const getTimeDisplay = (hours, minutes, seconds) => {
        return (
            hours ? `${hours.toFixed(0)}h ${minutes.toFixed(0)}m` : 
            minutes ? `${minutes.toFixed(0)}m ${seconds.toFixed(0)}s` :
            seconds ? `${seconds.toFixed(0)}s` : "-"
        )
    }

    const productivityRatingOptions = [
        {value: 1, label: "I finished less than I expected to"},
        {value: 2, label: "I finished exactly what I expected to"},
        {value: 3, label: "I finished more than I expected to"},
    ];

    const productivityRatingToLabel = {
        1: "I finished less than I expected to",
        2: "I finished exactly what I expected to",
        3: "I finished more than I expected to",
    }

    const locationOptions = [
        {value: "In-Class", label: "In-Class"},
        {value: "Library", label: "Library"},
        {value: "Home", label: "Home"},
        {value: "Other", label: "Other"},
    ];

    const COLUMNS = [
        {
            Header: '',
            accessor: 'startDateTime',
            Cell: ({ value }) => {
                const options = {month: "short", year: 'numeric', day: "numeric"}
                return (
                <>
                    <Text>{new Date(value).toLocaleDateString('en-us', options)}</Text>
                </>
                );
            },
        },
        {
            Header: 'Time',
            accessor: (row) => row,
            id: "time",
            Cell: ({ value }) => {
                const startDate = new Date(value.startDateTime)
                const endDate = new Date(startDate.getTime() + value.duration * 1000)
                return (
                <>
                    <Text>{startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}</Text>
                </>
                );
            },
        },
        {
            Header: 'Duration',
            accessor: 'duration',
            Cell: ({ value }) => {
                const [hours, minutes, seconds] = getHMSfromDuration(value)
                return <Text>{getTimeDisplay(hours, minutes, seconds)}</Text>;
            },
        },
        {
            Header: 'Productivity Rating',
            accessor: 'productivityRating',
            Cell: ({ value }) => {
                return (
                <>
                    <Text>{productivityRatingToLabel[value]}</Text>
                </>
                );
            },
        },
        {
            Header: 'Location',
            accessor: 'location',
            Cell: ({ value }) => {
                return (
                <>
                    <Text>{value}</Text>
                </>
                );
            },
        },
        {
            Header: 'Notes',
            accessor: 'notes',
            Cell: ({ value }) => {
                return (
                <>
                    <Text>{value}</Text>
                </>
                );
            },
        },
        {
            Header: '',
            id: 'editSession',
            accessor: (row) => row,
            width: 20,
            minWidth: 20,
            maxWidth: 20,
            sortDescFirst: true,
            Cell: ({ value }) => {
                return (
                <>
                   <EditSessionModal session={value} userId={props.userId} updateSessionHandler={updateSessionHandler}/>
                </>
                );
            },
        },
        {
            Header: '',
            accessor: 'id',
            id: 'deleteSession',
            width: 20,
            minWidth: 20,
            maxWidth: 20,
            Cell: ({ value }) => {
                return (
                <>
                    <DeleteSessionModal userId={props.userId} sessionId={value} updateSessionHandler={updateSessionHandler}/>
                </>
                );
            },
        },
    ]

    return (
        <Container maxW='container.xl' pt="2%">
            <Modal size="2xl" isOpen={createSessionIsOpen} onClose={createSessionOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Working Session Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel fontWeight="bold">Working Session Duration</FormLabel>
                        <Text>
                            {getTimeDisplay(getHMSfromDuration(time)[0], getHMSfromDuration(time)[1], getHMSfromDuration(time)[2])}
                        </Text>
                        <FormControl isRequired>
                            <FormLabel mt="2%" fontWeight="bold">Productivity Rating</FormLabel>
                            <FormHelperText mb="1%">Rate how productive you felt your working session was:</FormHelperText>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a Productivity Rating"
                                options={productivityRatingOptions}
                                onChange={(e) => setProductivityRating(e.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt="2%" fontWeight="bold">Location</FormLabel>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a location for your working session..."
                                options={locationOptions}
                                onChange={(e) => setLocation(e.value)}
                            />
                        </FormControl>
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
            <Flex alignItems="flex-end">
                <Heading as="h1" size="xl" pt="1%">
                    Task Details
                    {task.completed && ` - Completed`}
                </Heading>
                <Spacer />
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
            </Flex>
            <Flex mt="2%">
                <Text as="b">Task Name:</Text>
                <Text ml="0.5%">{task.taskName}</Text>
            </Flex>
            <Flex mt="1%">
                <Text as="b">Course:</Text>
                <Tag ml="0.5%" backgroundColor={task.course.colourCode} textColor="white">{task.course.courseName}</Tag>
                <Text as="b" ml="2%">Due Date:</Text>
                <Text ml="0.5%">{new Date(task.dueDate).toDateString()}</Text>
                <Text ml="1%" color="gray.500">{calculateDateDifference(task.dueDate)}</Text>
                <Text as="b" ml="2%">Effort:</Text>
                <Text ml="0.5%">{task.effortRating}</Text>
                <Text as="b" ml="2%">Estimated Time:</Text>
                <Text ml="0.5%">{effortValueToLabel[task.effortRating]}</Text>
            </Flex>
            {task.completed && 
                <Flex mt="1%">
                    <Text as="b">Task Completion Notes:</Text>
                    <Text ml="0.5%">{task.notes}</Text>
                </Flex>
            }
            <Flex mt="2%" justify="space-between">
                    <Card bg="blue.50" size="lg" w={task.completed ? "100%" : ""}>
                        <CardBody>
                            <Grid templateColumns='repeat(3, 1fr)' gap={8}>
                                <GridItem w="100%">
                                    <VStack justifyContent="space-between">
                                        <Text align="center" as="b" fontSize="xl">Total Time Spent</Text>
                                        <Text as="b" fontSize="3xl">{getTimeDisplay(...getHMSfromDuration(totalSessionTime))}</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Number of Sessions</Text>
                                        <Text as="b" fontSize="3xl">{totalSessions}</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Average Session Time</Text>
                                        <Text as="b" fontSize="3xl">{getTimeDisplay(...getHMSfromDuration(averageSessionTime))}</Text>
                                    </VStack>
                                </GridItem>
                            </Grid>
                        </CardBody>
                    </Card>
                    { !task.completed &&
                        <Card bg="blue.50" size="lg" w="400px">
                            <CardBody justify="space-between">
                                <Flex direction="column" align="center" justify="space-between">
                                    <Text as="b" fontSize="3xl" mb="7px">
                                        {("0" + Math.floor(time / 3600)).slice(-2)}:
                                        {("0" + Math.floor((time / 60) % 60)).slice(-2)}:
                                        {("0" + (time % 60)).slice(-2)}
                                    </Text>
                                    <HStack>
                                        {!isActive && 
                                            <Button size="sm" bg="white" aria-label="start-stopwatch" leftIcon={<Icon as={FaPlay}/>}
                                                onClick={handleStopwatchStart}
                                            >
                                                <Text fontSize='14px'>Start Session</Text>
                                            </Button>
                                        }
                                        {(isActive && !isPaused) && 
                                            <Button 
                                                size="sm" 
                                                bg="white" 
                                                aria-label="stop-stopwatch" 
                                                leftIcon={<Icon as={FaPause}/>}
                                                onClick={handleStopwatchPauseResume}
                                            >
                                                <Text fontSize='14px'>Pause Session</Text>
                                            </Button>
                                        }
                                        {(isActive && isPaused) && 
                                            <Button 
                                                size="sm" 
                                                bg="white" 
                                                aria-label="stop-stopwatch" 
                                                leftIcon={<Icon as={HiPlayPause} boxSize="1.5em"/>}
                                                onClick={handleStopwatchPauseResume}
                                            >
                                                <Text fontSize='14px'>Resume Session</Text>
                                            </Button>
                                        }
                                        {(isActive && isPaused && time > 0) && 
                                            <Button 
                                                size="sm" 
                                                bg="green.200" 
                                                aria-label="stop-stopwatch" 
                                                leftIcon={<Icon as={FaCheck}/>}
                                                onClick={handleStopwatchCompletion}
                                            >
                                                <Text fontSize='14px'>Complete Session</Text>
                                            </Button>
                                        }
                                    </HStack>
                                </Flex>
                            </CardBody>
                        </Card>
                    }
            </Flex>
            <Heading as="h2" size="lg" mt="2%">Working Session Log</Heading>
            <Text mt="1%">Record the time spent on the task by turning on the stopwatch in the top right corner to start a working session.</Text>
            {
                sessions.length === 0 
                ? <NoSessions />
                : (
                    <Box padding="1% 0 0 0">
                        <Table 
                            columns={COLUMNS} 
                            data={sessions}
                            borderSpacing='0 15px'

                        />
                    </Box>  
                )
            }
        </Container>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    const taskId = parseInt(context.query.taskId)

    if (isNaN(parseInt(taskId))) {
        return {
            redirect: {
                destination: "/tasklist?message=invalid_data",
                permanent: false
            },
        };
    }

    const task = await prisma.task.findUnique({where: {id: taskId}, include: {course: true}})
    if (task === null) {
        return {
            redirect: {
                destination: "/tasklist?message=task_dne",
                permanent: false
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
        },
        orderBy: [
            {
                id: 'desc'
            }
        ]
    })

    if (!session) {
        if (session.id !== task.userId) {
            return {
                redirect: {
                    destination: "/tasklist?message=not_permitted",
                    permanent: false
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