import { Box, Button, ButtonGroup, Card, CardBody, Flex, Heading, IconButton, Icon, Stack, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { FaArrowLeft, FaPlay, FaPause, FaCheck } from "react-icons/fa"
import { HiPlayPause } from "react-icons/hi2";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

import prisma from "@prisma/index";

export default function TaskDetails(props) {

    const task = props.task;
    const router = useRouter();

    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);

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

    const handleStopwatchStart = () => {
        setIsActive(true);
        setIsPaused(false);
    }

    const handleStopwatchPauseResume = () => {
        setIsPaused(!isPaused);
    }

    const handleStopwatchCompletion = () => {
        setIsPaused(true);
        setIsActive(false);
        setTime(0);
        console.log(time)
    }

    const effortValueToLabel = {
        1: "0-2 hours",
        2: "2-4 hours",
        3: "4-6 hours",
        4: "6-8 hours",
        5: "8+ hours",
    }

    return (
        <Box px="5%" pt="2%">
            <Button 
                leftIcon={<Icon as={FaArrowLeft} color="black"/>}
                size="md"
                variant="link"
                onClick={() => router.push("/tasklist")}
            >
                <Text color="black">Back</Text>
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
                <Text ml="1%" color="gray.500">Date calc. goes here</Text>
                <Text as="b" ml="2%">Effort:</Text>
                <Text ml="0.5%">{task.effortRating}</Text>
                <Text as="b" ml="2%">Estimated Time:</Text>
                <Text ml="0.5%">{effortValueToLabel[task.effortRating]}</Text>
            </Flex>
            <Flex mx="1%" mt="3%" justify="space-evenly">
                <Card bg="blue.50" size="lg">
                    <CardBody>
                        <Flex>
                            <Stack align="center">
                                <Text align="center" as="b" fontSize="xl">Total Time Spent (hours)</Text>
                                <Text as="b" fontSize="3xl">1.57</Text>
                            </Stack>
                            <Stack align="center" mx="2%">
                                <Text align="center" as="b" fontSize="xl">Number of Sessions</Text>
                                <Text as="b" fontSize="3xl">2</Text>
                            </Stack>
                            <Stack align="center">
                                <Text align="center" as="b" fontSize="xl">Average Session Time (hours)</Text>
                                <Text as="b" fontSize="3xl">1.57</Text>
                            </Stack>
                        </Flex>
                    </CardBody>
                </Card>
                <Card bg="blue.50" size="md" px="4%" minWidth="25%">
                    <CardBody>
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
            <Heading as="h2" size="lg" mt="3%">Working Sessions</Heading>
            <Text mt="1%">Record the time spent on the task by turning on the stopwatch in the top right corner to start a working session.</Text>
        </Box>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    const taskId = parseInt(context.query.taskId)

    const task = await prisma.task.findUnique({where: {id: taskId}, include: {course: true}})
    console.log(task);

    console.log("session=getServerSideProps(context) in login: ", session)

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
            taskId: taskId,
            userId: session.id,
            task: task,
        }
    };
}