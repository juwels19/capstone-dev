import {
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    FormControl,
    FormLabel,
    Flex,
    Textarea,
    useToast,
    ModalCloseButton,
    ModalFooter,
    VStack,
    Grid,
    GridItem,
    Card,
} from '@chakra-ui/react';
import { CheckIcon, MinusIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

import { calculateActualTimeAndEffort } from 'src/utils/effortUtils';
import { getHMSfromDuration } from 'src/utils/dateUtils';

export default function CompleteTaskModal(props) {
    const task = props.task;
    const toast = useToast();
    const [actualTime, actualEffort] = calculateActualTimeAndEffort(task)

    const [notes, setNotes] = useState(task.notes)
    const [correctPredictionAnswer, setCorrectPredictionAnswer] = useState("")
    const [incorrectPredictionAnswer, setIncorrectPredictionAnswer] = useState("")
    const [predictionImprovementAnswer, setPredictionImprovementAnswer] = useState("")
    const { isOpen: completedTaskIsOpen, onOpen: completedTaskOnOpen, onClose: completedTaskOnClose } = useDisclosure();

    const effortValueToLabel = {
        1: "< 0.5 hours",
        2: "0.5 - 1 hours",
        3: "1 - 3 hours",
        5: "3 - 6 hours",
        8: "6 - 12 hours",
        13: "12+ hours"
    }

    useEffect(() => {
        if (completedTaskIsOpen) {
            setNotes(task.notes)
            setCorrectPredictionAnswer("")
            setIncorrectPredictionAnswer("")
            setPredictionImprovementAnswer("")
        }
    }, [completedTaskIsOpen])

    const submitReflectionHandler = async () => {
        if ((parseInt(actualEffort) !== parseInt(task.effortRating) && (!incorrectPredictionAnswer || !predictionImprovementAnswer)) || 
            (parseInt(actualEffort) === parseInt(task.effortRating) && !correctPredictionAnswer)) {
            toast({
                position: "top-middle",
                title: "Task Reflection Unsuccessful",
                description: "Please make sure all required fields are entered.",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }
        const body = {
            completed: true,
            notes: notes,
            correctPredictionAnswer: correctPredictionAnswer,
            incorrectPredictionAnswer: incorrectPredictionAnswer,
            predictionImprovementAnswer: predictionImprovementAnswer
        }
        await fetch (`/api/tasks/${task.id}`, {method: "POST", body: JSON.stringify(body)})
        await props.updateTaskHandler("Edit");
        completedTaskOnClose()
        props.confettiHandler(true)
    }

    const handleChangeCompleteStatus = async (event, task, isCompleted) => {
        event.preventDefault();
        if (isCompleted) {
            completedTaskOnOpen()
        } else {
            const body = {completed: isCompleted}
            await fetch (`/api/tasks/${task.id}`, {method: "POST", body: JSON.stringify(body)})
            await props.updateTaskHandler("Edit");
        }
    }

    return (
        <>
            <Modal size="5xl" isOpen={completedTaskIsOpen} onClose={completedTaskOnClose} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">
                        Post Task Reflection
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {actualEffort !== task.effortRating && 
                            <>
                                <Text fontSize="xl">You did it! 🎉</Text>
                                <Text fontSize="xl">Before we cross this off your task list, let&apos;s take a moment to reflect on your progress:</Text>
                            </>
                        }
                        {actualEffort === task.effortRating && 
                            <Text fontSize="xl">Great work! You were spot on with your task estimation! 🎉</Text>
                        }
                        <Card bg="blue.50" size="lg" w="100%" mt="2%">
                            <Grid templateColumns='repeat(4, 1fr)' gap={4} my="1%">
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Predicted <br/>Effort:</Text>
                                        <Text as="b" fontSize="3xl">{task.effortRating}</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Actual <br/>Effort:</Text>
                                        <Text as="b" fontSize="3xl">{actualEffort}</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Predicted <br/>Time:</Text>
                                        <Text as="b" fontSize="3xl">{effortValueToLabel[task.effortRating]}</Text>
                                    </VStack>
                                </GridItem>
                                <GridItem w="100%">
                                    <VStack>
                                        <Text align="center" as="b" fontSize="xl">Actual <br/>Time:</Text>
                                        <Text as="b" fontSize="3xl">{props.getTimeDisplay(...getHMSfromDuration(actualTime))}</Text>
                                    </VStack>
                                </GridItem>
                            </Grid>
                        </Card>

                        {actualEffort !== task.effortRating && 
                            <Flex justifyContent="space-between" mt="1%">
                                <FormControl isRequired>
                                    <VStack mx="2%" alignItems="left">
                                        <FormLabel mt="1%" fontWeight="bold" fontSize="xl" textAlign="left">Why do you think your prediction was incorrect for this task?</FormLabel>
                                        <Textarea resize="none" placeholder='Enter your response here...' onChange={(e) => setIncorrectPredictionAnswer(e.target.value)}/>
                                    </VStack>
                                </FormControl>
                                <FormControl isRequired>
                                    <VStack mx="2%" alignItems="left">
                                        <FormLabel mt="1%" fontWeight="bold" fontSize="xl" textAlign="left">What would you do differently next time for a similar task?</FormLabel>
                                        <Textarea resize="none" placeholder='Enter your response here...' onChange={(e) => setPredictionImprovementAnswer(e.target.value)}/>
                                    </VStack>
                                </FormControl>
                            </Flex>
                        }

                        {actualEffort === task.effortRating &&
                            <Flex justifyContent="space-between" mt="1%">
                                <FormControl isRequired>
                                    <VStack alignItems="left">
                                        <FormLabel mt="1%" fontWeight="bold" fontSize="xl" textAlign="left">Why do you think your prediction was correct for this task?</FormLabel>
                                        <Textarea resize="none" placeholder='Enter your response here...' onChange={(e) => setCorrectPredictionAnswer(e.target.value)}/>
                                    </VStack>
                                </FormControl>
                            </Flex>
                        }

                        <FormControl>
                            <FormLabel mt="1%" fontWeight="bold" fontSize="xl">General Notes:</FormLabel>
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any general notes or reflections about this task here..."/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            colorScheme="green" 
                            width="100%" 
                            type="submit"
                            onClick={submitReflectionHandler}
                        >
                            Submit Reflection
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            { task.completed ?
                <Button 
                    leftIcon={<MinusIcon />} 
                    colorScheme="red"
                    variant="ghost"
                    onClick={(event) => handleChangeCompleteStatus(event, task, false)}
                >
                    <Text fontSize='14px'>Mark Active</Text>
                </Button>
                :
                <Button 
                    leftIcon={<CheckIcon />} 
                    colorScheme="blue"
                    variant="ghost"
                    onClick={(event) => handleChangeCompleteStatus(event, task, true)}
                >
                    <Text fontSize='14px'>Mark Complete</Text>
                </Button>
            }
        </>
    );

}