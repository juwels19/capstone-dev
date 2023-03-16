import { Center, Box, Button, ButtonGroup, Container, Card, CardBody, CardFooter, Text, VStack, Flex, Grid, GridItem, Spacer} from "@chakra-ui/react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useRouter } from 'next/router'
import timeifyLogo from "public/timeify.svg"
import landing_tasklist from "public/landing_tasklist.svg"
import JulianHeadshot from "public/teamHeadshots/Ellipse 2.svg"
import BenHeadshot from "public/teamHeadshots/Ellipse 3.svg"
import EmilioHeadshot from "public/teamHeadshots/Ellipse 4.svg"
import MyleneHeadshot from "public/teamHeadshots/Ellipse 1.svg"
import EthanHeadshot from "public/teamHeadshots/Ellipse 5.svg"


export default function Home() {

    const router = useRouter();

    return (
        <>
            <Container maxW={{ lg: '1200px' }}>
                <Box mt="2%">
                    <Image src={timeifyLogo} alt="timeify logo" width={200} height={150}/>
                </Box>
                <Flex justify="center" mt="97px">
                    <VStack spacing={-5}>
                        <Text as="b" fontSize="60px" align="center">Improve your <span style={{ color: '#4299E1' }}>Time Management</span></Text>
                        <Text as="b" fontSize="60px" align="center">skills with <span style={{ color: '#4299E1' }}>Timeify</span></Text>
                    </VStack>
                </Flex>
                <Flex justify="center" mt="34px">
                    <Text fontSize="18px">
                        Estimate task times. Record working sessions. Reflect and improve. 
                    </Text>
                </Flex>
                <Flex justify="center" mt="34px">
                    <ButtonGroup colorScheme="blue" size="lg" gap="100">
                        <Button width="200px" onClick={() => router.push("/login")}>
                            Login
                        </Button>
                        <Button width="200px" onClick={() => router.push("/signup")}>
                            Signup
                        </Button>
                    </ButtonGroup>
                </Flex>
                <Flex ml="2%" mt="114px" justify="center">
                    <Image src={landing_tasklist} alt="tasklist"/>
                </Flex>
                <Grid
                    h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    rowGap={19}
                    mt="114px"
                    >
                    <GridItem rowSpan={2}>
                        <VStack mt={-3} spacing={-5}>
                            <Text as="b" fontSize="50px" pt="0px">What is</Text>
                            <Text as="b" fontSize="5xl"><span style={{ color: '#4299E1' }}>Timeify</span>?</Text>
                        </VStack>
                    </GridItem>
                    <GridItem colStart={3} colSpan={3}>
                        <Text fontSize="24px">
                            With the shift in educational structure from high school to university, incoming university students face several challenges with effectively managing their time.
                        </Text>
                    </GridItem>
                    <GridItem colStart={3} colSpan={3}>
                        <Text fontSize="24px">
                            Timeify aims to facilitate the improvement of the time management and self-monitoring skills of these first-year students, easing the high school-to-university academic transition.
                        </Text>
                    </GridItem>
                </Grid>
                <Grid
                    h='200px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    rowGap={19}
                    mt="150px"
                    >
                    <GridItem rowSpan={2}>
                        <VStack mt={-3} spacing={-5}>
                            <Text as="b" fontSize="50px" pt="0px">How does</Text>
                            <Text as="b" fontSize="5xl">it <span style={{ color: '#4299E1' }}>work</span>?</Text>
                        </VStack>
                    </GridItem>
                    <GridItem colStart={3} colSpan={3}>
                        <Text fontSize="24px">
                        Timeify, is a time management tool with a twist. We enable students to enter tasks based on course deliverables or deadlines. 
                        </Text>
                    </GridItem>
                    <GridItem colStart={3} colSpan={3}>
                        <Text fontSize="24px">
                            Timeify also bridges the gap in students’ executive function skills by facilitating time estimation and self-monitoring. For each task, users enter an estimated effort level, and using time-tracking features, allows students to reflect on their estimation and actual time spent upon task completion.
                        </Text>
                    </GridItem>
                </Grid>
            </Container>
            <Container maxW="100%" bg="#4299E1" mt="10%" pb="20px" minH="100vh">
                <Flex justify="center">
                    <VStack spacing={-5} mt="84px">
                        <Text as="b" fontSize="60px" textColor="white">A tool made for students,</Text>
                        <Text as="b" fontSize="60px" textColor="white">by students.</Text>
                    </VStack>
                </Flex>
                <Flex justify="center" mt="2%">
                    <VStack spacing={-2}>
                        <Text as="b" fontSize="36px" textColor="white">90% of users felt that Timeify could help them</Text>
                        <Text as="b" fontSize="36px" textColor="white">improve their task time estimation.</Text>
                    </VStack>
                </Flex>
                <Flex justify="center" mt="2%">
                    <VStack spacing={-2}>
                        <Text fontSize="24px" textColor="white">Timeify was created by 5 Management Engineering students as a capstone symposium </Text>
                        <Text fontSize="24px" textColor="white">project for the University of Waterloo. </Text>
                    </VStack>
                </Flex>
                <Flex justify="center" mt="2%">
                    <VStack spacing={-2}>
                        <Text fontSize="24px" textColor="white">As part of the evolution of Timeify, the web app has been pilot tested with ~37 Grade 12 </Text>
                        <Text fontSize="24px" textColor="white">students for 2 weeks to gather feedback and improve the tool.</Text>
                    </VStack>
                </Flex>
                <Flex justify="space-evenly" mt="5%" gap="55px">
                    <Spacer />
                    <VStack>
                        <Image 
                            src={JulianHeadshot}
                            width={100}
                            height={100}
                            alt="JulianHeadshot"
                            style={{ borderRadius: "50%"}}
                        />
                        <Text fontSize="18px" textColor="white">Julian Curalli</Text>
                    </VStack>
                    <VStack>
                        <Image 
                            src={MyleneHeadshot}
                            alt="MyleneHeadshot"
                            width={100}
                            height={100}
                            style={{ borderRadius: "50%"}}
                        />
                        <Text fontSize="18px" textColor="white">Mylene Tu</Text>
                    </VStack>
                    <VStack>
                        <Image 
                            src={BenHeadshot}
                            alt="BenHeadshot"
                            width={100}
                            height={100} 
                            style={{ borderRadius: "50%", objectFit: 'contain'}}
                        />
                        <Text fontSize="18px" textColor="white">Ben Creasy</Text>
                    </VStack>
                    <VStack>
                        <Image 
                            src={EmilioHeadshot}
                            alt="EmilioHeadshot"
                            width={100}
                            height={100}
                            style={{ borderRadius: "50%"}}
                            className="landingImage"
                        />
                        <Text fontSize="18px" textColor="white">Emilio Mena</Text>
                    </VStack>
                    <VStack>
                        <Image 
                            src={EthanHeadshot}
                            alt="EthanHeadshot"
                            width={100}
                            height={100}
                            style={{ borderRadius: "50%"}}
                        />
                        <Text fontSize="18px" textColor="white">Ethan Geist</Text>
                    </VStack>
                    <Spacer />
                </Flex>
            </Container>
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/tasklist",
                permanent: false
            }
          };
    }
    return {
        props: {}
    };
}