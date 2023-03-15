import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { Box, Button, Card, CardBody, Container, Divider, Flex, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaArrowLeft } from "react-icons/fa"

import { getTimeDisplay, getHMSfromDuration, setDateToMonday } from "src/utils/dateUtils";
import { calculateActualTimeAndEffort } from "src/utils/effortUtils";

import TrendAccordion from "@components/analytics/TrendAccordion";
import moment from "moment";

import dynamic from "next/dynamic";
import prisma from "@prisma/index";
const TimeifyBarChart = dynamic(import("@components/analytics/TimeifyBarChart"), {ssr: false})
const TimeifyLineChart = dynamic(import("@components/analytics/TimeifyLineChart"), {ssr: false})


export default function Analytics(props) {
    const router = useRouter();

    const [analyticsData, setAnalyticsData] = useState(props.analyticsData);

    const handleBackButton = () => {
        router.push("/tasklist")
    }

    const effortValueToLabel = {
        1: "< 0.5 hours",
        2: "0.5 - 1 hours",
        3: "1 - 3 hours",
        5: "3 - 6 hours",
        8: "6 - 12 hours",
        13: "12+ hours"
    }

    const calculateAvgEffortValueToLabel = () => {
        const roundedAvgEffort = Math.round(analyticsData.avgEffortRating);
        if (roundedAvgEffort >= 12) {
            return effortValueToLabel[13]
        } else if (roundedAvgEffort >= 6) {
            return effortValueToLabel[8]
        } else if (roundedAvgEffort >= 3) {
            return effortValueToLabel[5]
        } else if (roundedAvgEffort >= 1) {
            return effortValueToLabel[3]
        } else if (roundedAvgEffort >= 0.5) {
            return effortValueToLabel[2]
        } else { 
            return effortValueToLabel[1]
        }
    }

    return (
        <Container maxW="container.xl" pt="2%">
            <Button 
                leftIcon={<Icon as={FaArrowLeft} color="black"/>}
                size="md"
                variant="link"
                onClick={handleBackButton}
            >
                <Text color="black">Back to Tasklist</Text>
            </Button>
            <Heading as="h2" size="2xl" pt="1%">
                {props.userfirstName.charAt(0).toUpperCase() + props.userfirstName.substring(1).toLowerCase()}&apos;s Analytics Page
            </Heading>
            <Card size="lg" bg="blue.50" mt="2%" mb="5%">
                <CardBody>
                    <Tabs isFitted variant="line">
                        <TabList>
                            <Tab>
                                Working Session Metrics
                            </Tab>
                            <Tab>
                                Time Estimation Metrics
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Flex pt="2%" px="10%" justify="space-between" alignItems="center">
                                    <Heading as="h2" size="lg">
                                        Average Working Session Duration:
                                    </Heading>
                                    <Heading as="h1">
                                        {getTimeDisplay(...getHMSfromDuration(analyticsData.avgSessionDuration))} 
                                    </Heading>
                                </Flex>
                                <Heading mt="2%" as="h3" size="md" textAlign="center">
                                    Average Working Session Duration Course Breakdown:
                                </Heading>
                                <Box mt="2%">
                                    <Flex justifyContent="center">
                                        <TimeifyBarChart 
                                            data={analyticsData.avgSessionDurationByCourseData}
                                            xDataKey="courseName"
                                            yDataKey="averageDuration"
                                            xLabel="Course"
                                            yLabel="Average Duration (Minutes)"
                                            includeSessionCount={true}
                                        />
                                    </Flex>
                                </Box>
                                <TrendAccordion 
                                    buttonText="Click here to see your average working session trend..."
                                >
                                    <TimeifyLineChart
                                        data={analyticsData.timeSeries}
                                        xDataKey="date"
                                        yDataKey="averageDuration"
                                        xLabel="Date"
                                        yLabel="Average Duration (Minutes)"
                                    />
                                 </TrendAccordion>
                                <Divider mt="2%"/>
                                <Flex pt="2%" px="10%" justify="space-between" alignItems="center">
                                    <Heading as="h2" size="lg">
                                        Total Duration of Working Sessions: 
                                    </Heading>
                                    <Heading as="h1">
                                        {getTimeDisplay(...getHMSfromDuration(analyticsData.totalSessionDuration))} 
                                    </Heading>
                                </Flex>
                                <Heading mt="2%" as="h3" size="md" textAlign="center">
                                    Working Session Duration Course Breakdown:
                                </Heading>
                                <Box mt="2%">
                                    <Flex justifyContent="center">
                                        <TimeifyBarChart 
                                            data={analyticsData.avgSessionDurationByCourseData}
                                            xDataKey="courseName"
                                            yDataKey="totalDuration"
                                            xLabel="Course"
                                            yLabel="Total Duration (Minutes)"
                                            includeSessionCount={true}
                                        />
                                    </Flex>
                                </Box>
                                <TrendAccordion 
                                    buttonText="Click here to see your working session duration trend..."
                                >
                                    <TimeifyLineChart
                                        data={analyticsData.timeSeries}
                                        xDataKey="date"
                                        yDataKey="totalDuration"
                                        xLabel="Date"
                                        yLabel="Total Duration (Minutes)"
                                    />
                                </TrendAccordion>
                                <Divider mt="2%"/>
                            </TabPanel>
                            <TabPanel>
                                <Flex mt="2%" px="5%" justify="space-between" alignItems="center">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="2xl">
                                            Average Effort <br /> Rating
                                        </Text>
                                        <Text align="center" as="b" fontSize="4xl">
                                            {analyticsData.avgEffortRating}
                                        </Text>
                                    </VStack>
                                    <VStack>
                                        <Text align="center" as="b" fontSize="2xl">
                                            Average Effort <br /> Time Equivalent
                                        </Text>
                                        <Text align="center" as="b" fontSize="4xl">
                                            {calculateAvgEffortValueToLabel()}
                                        </Text>
                                    </VStack>
                                    <VStack>
                                        <Text align="center" as="b" fontSize="2xl">
                                            Average Task <br /> Completion Time
                                        </Text>
                                        <Text align="center" as="b" fontSize="4xl">
                                            {getTimeDisplay(...getHMSfromDuration(analyticsData.avgActualTime))} 
                                        </Text>
                                    </VStack>
                                </Flex>
                                <Divider mt="2%"/>
                                <VStack>
                                    <Heading mt="2%" as="h3" size="md" textAlign="center">
                                        Percent Accuracy of Estimations by Course:
                                    </Heading>
                                    <TimeifyBarChart
                                        data={analyticsData.percentEstimationAccuracyByCourseData}
                                        xDataKey="courseName"
                                        yDataKey="estimationAccuracy"
                                        xLabel="Course"
                                        yLabel="Estimation Accuracy"
                                        yAxisTickModifier="%"
                                    />
                                </VStack>
                                <TrendAccordion 
                                    buttonText="Click here to see your estimation accuracy trend..."
                                >   
                                    <TimeifyLineChart
                                        data={analyticsData.timeSeries}
                                        xDataKey="date"
                                        yDataKey="percentEstimationAccuracy"
                                        xLabel="Date"
                                        yLabel="Estimation Accuracy"
                                        yAxisTickModifier="%"
                                    />
                                    <VStack alignItems="center">
                                        <Text as="b" mt="3%">Estimation accuracy for each week is calculated by:</Text>
                                        <Text>Correctly Estimated Tasks ➗ Number of Completed Tasks</Text>
                                        <Text as="b" my="3%">Note: Estimation accuracy trends are only available for tasks completed on or after Mar 14, 2023</Text>
                                    </VStack>
                                </TrendAccordion>
                                <Divider mt="2%"/>
                                <VStack>
                                    <Heading mt="2%" as="h3" size="md" textAlign="center">
                                        Average Effort Rating by Course:
                                    </Heading>
                                    <TimeifyBarChart
                                        data={analyticsData.avgEffortRatingByCourseData}
                                        xDataKey="courseName"
                                        yDataKey="averageEffortRating"
                                        xLabel="Course"
                                        yLabel="Average Effort Rating"
                                    />
                                </VStack>
                                <TrendAccordion 
                                    buttonText="Click here to see your average effort rating trend..."
                                >
                                    <TimeifyLineChart
                                        data={analyticsData.timeSeries}
                                        xDataKey="date"
                                        yDataKey="averageEffortRating"
                                        xLabel="Date"
                                        yLabel="Average Effort Rating"
                                    />
                                    <VStack alignItems="center">
                                        <Text as="b" my="3%">Note: Average effort rating trends are only available for tasks completed on or after Mar 14, 2023</Text>
                                    </VStack>
                                </TrendAccordion>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </CardBody>
            </Card>
        </Container>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            },
            props: {},
          };
    }

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(session.id)
        },
        include: {
            courses: true,
            tasks: {
                include: {
                    sessions: true
                }
            },
            sessions: true
        }
    })
    
    const completedTasks = await prisma.task.findMany({
        where: {
            user: {
                is: {
                    id: parseInt(session.id)
                }
            },
            completed: true
        },
        include: {
            sessions: true
        }
    })

    var analyticsData = {}

    // Average working session duration
    var totalSessionDuration = 0;
    var numSessions = 0;
    var totalEffort = 0;

    for (const session of user.sessions) {
        totalSessionDuration += session.duration
        numSessions += 1
    }

    for (const task of user.tasks) {
        totalEffort += task.effortRating
    }

    var totalActualTimeForCompletedTasks = 0;
    for (const completedTask of completedTasks) {
        for (const taskSession of completedTask.sessions)
        totalActualTimeForCompletedTasks += taskSession.duration
    }

    analyticsData["avgSessionDuration"] = numSessions !== 0 ? Math.round(totalSessionDuration / numSessions) : 0
    analyticsData["avgActualTime"] = completedTasks.length !== 0 ? Math.round(totalActualTimeForCompletedTasks / completedTasks.length) : 0
    analyticsData["totalSessionDuration"] = totalSessionDuration
    analyticsData["avgEffortRating"] = user.tasks.length !== 0 ? parseFloat((totalEffort / user.tasks.length).toFixed(1)) : 0.0 


    // Average working session duration by course
    var avgSessionDurationByCourseData = []
    var totalSessionDurationByCourseData = []
    var averageEffortByCourseData = []
    var percentAccuracyEstimationByCourseData = []

    for (const course of user.courses) {
        const courseId = course.id;
        var totalCourseSessionDuration = 0;
        var numSessionsInCourse = 0;
        var totalEffortInCourse = 0;
        var numTasksEstimatedCorrectlyInCourse = 0;
        var numCompletedTasksInCourse = 0;
        
        var taskIdsInCourse = {};
        for (const task of user.tasks) {
            if (task.courseId === courseId) {
                taskIdsInCourse[task.id] = true
                totalEffortInCourse += task.effortRating
                if (task.completed) {
                    numCompletedTasksInCourse += 1;
                    const [_, effort] = calculateActualTimeAndEffort(task);
                    if (effort === task.effortRating) {
                        numTasksEstimatedCorrectlyInCourse += 1;
                    }
                }
            }
        }

        for (const session of user.sessions) {
            if (taskIdsInCourse[session.taskId]) {
                totalCourseSessionDuration += session.duration
                numSessionsInCourse += 1
            }
        }

        var avgCourseDuration = numSessionsInCourse !== 0 ? Math.round(totalCourseSessionDuration / numSessionsInCourse / 60, 1) : 0;
        var avgCourseEffortRating = Object.keys(taskIdsInCourse).length !== 0 ? Math.round(totalEffortInCourse / Object.keys(taskIdsInCourse).length, 1) : 0;
        var percentEstimationAccuracy = numCompletedTasksInCourse !== 0 ? Math.round(numTasksEstimatedCorrectlyInCourse / numCompletedTasksInCourse * 100) : 0

        var currentCourse = {
            courseName: course.courseName,
            averageDuration: avgCourseDuration,
            totalDuration: Math.round(totalCourseSessionDuration / 60),
            averageEffortRating: avgCourseEffortRating,
            totalSessionsInCourse: numSessionsInCourse,
            estimationAccuracy: percentEstimationAccuracy
        }
        avgSessionDurationByCourseData.push(currentCourse)
        totalSessionDurationByCourseData.push(currentCourse)
        averageEffortByCourseData.push(currentCourse)
        percentAccuracyEstimationByCourseData.push(currentCourse)
    }

    // Timeseries Trend Graphs
    var datesForTimeSeries = {}
    const NUM_TREND_WEEKS = 5
    for (let i = 0; i < NUM_TREND_WEEKS; i++) {
        var monday = moment().startOf('isoWeek').subtract(i, 'W')
        datesForTimeSeries[monday.format('YYYY-MM-DD')] = {totalDuration: 0, numSessions: 0, numTasks: 0, effortRatingSum: 0, tasksEstimatedCorrectly: 0, numCompletedTasks: 0}
    }
    for (const session of user.sessions) {
        var sessionDateMondayString = setDateToMonday(new Date(session.startDateTime)).format('YYYY-MM-DD')
        if (sessionDateMondayString in datesForTimeSeries) {
            datesForTimeSeries[sessionDateMondayString].totalDuration += session.duration
            datesForTimeSeries[sessionDateMondayString].numSessions += 1
        }
    }
    for (const task of user.tasks) {
        // TODO: delete in 5 weeks: 4/12/22
        if (!task.createdAt) {
            continue
        }
        
        var taskDateMondayString = setDateToMonday(new Date(task.createdAt)).format('YYYY-MM-DD')
        if (taskDateMondayString in datesForTimeSeries) {
            datesForTimeSeries[taskDateMondayString].numTasks += 1
            datesForTimeSeries[taskDateMondayString].effortRatingSum += task.effortRating

            if (task.completed) {
                datesForTimeSeries[taskDateMondayString].numCompletedTasks +=1
                const [_, effort] = calculateActualTimeAndEffort(task);
                if (effort === task.effortRating) {
                    datesForTimeSeries[taskDateMondayString].tasksEstimatedCorrectly += 1;
                }
            }
        }

    }

    analyticsData['timeSeries'] = []
    for (var date in datesForTimeSeries) {
        const {totalDuration, numSessions, numCompletedTasks, numTasks, effortRatingSum, tasksEstimatedCorrectly} = datesForTimeSeries[date]
        analyticsData['timeSeries'].push({
            date: new Date(date).toLocaleDateString('en-us'), 
            
            // Session Duration
            totalDuration: Math.round(totalDuration / 60, 1), 
            averageDuration: Math.round(totalDuration / numSessions / 60) | 0,
            
            // Effort Rating
            averageEffortRating: Math.round(effortRatingSum / numTasks) | 0,

            // Percent Accuracy
            percentEstimationAccuracy: Math.round(tasksEstimatedCorrectly * 100 / numCompletedTasks) | 0
        })
    }
    analyticsData['timeSeries'].reverse()

    analyticsData["avgSessionDurationByCourseData"] = avgSessionDurationByCourseData
    analyticsData["avgEffortRatingByCourseData"] = averageEffortByCourseData
    analyticsData["totalSessionDurationByCourseData"] = totalSessionDurationByCourseData
    analyticsData["percentEstimationAccuracyByCourseData"] =  percentAccuracyEstimationByCourseData

    return {
        props: {
            userId: session.id,
            userfirstName: session.firstName,
            analyticsData: analyticsData
        }
    };
}