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
    FormHelperText,
    Flex,
    Textarea,
    useToast,
    ModalCloseButton,
    ModalFooter
} from '@chakra-ui/react';
import { CheckIcon, MinusIcon } from '@chakra-ui/icons';
import { Select } from "chakra-react-select";
import { useEffect, useState } from 'react';

import { calculateActualTimeAndEffort } from 'src/utils/effortUtils';
import { getHMSfromDuration } from 'src/utils/dateUtils';

export default function CompleteTaskModal(props) {
    const task = props.task;
    const toast = useToast();

    const { isOpen: completedTaskIsOpen, onOpen: completedTaskOnOpen, onClose: completedTaskOnClose } = useDisclosure();

    const relativeProductivityToLabel = {
        1: "Unacceptable",
        2: "Below Expectations",
        3: "Met Expectations",
        4: "Exceeded Expectations",
        5: "Outstanding",
    }

    const timeEstimationToLabel = {
        1: "Drastically Decrease Time Estimation",
        2: "Slightly Decrease Time Estimation",
        3: "Keep Time Estimation The Same",
        4: "Slightly Increase Time Estimation",
        5: "Drastically Increase Time Estimation",
    }

    const effortValueToLabel = {
        1: "< 0.5 hours",
        2: "0.5 - 1 hours",
        3: "1 - 3 hours",
        5: "3 - 6 hours",
        8: "6 - 12 hours",
        13: "12+ hours"
    }

    let initRelativeProductivity = null;
    if (task.relativeProductivity) {
        initRelativeProductivity = {
            value: task.relativeProductivity, 
            label: relativeProductivityToLabel[task.relativeProductivity]
        }
    }

    let initBlindEstimation = null;
    if (task.blindEstimationChange) {
        initBlindEstimation = {
            value: task.blindEstimationChange, 
            label: timeEstimationToLabel[task.blindEstimationChange]
        }
    }

    let initActualEstimation = null;
    if (task.actualEstimationChange) {
        initActualEstimation = {
            value: task.actualEstimationChange, 
            label: timeEstimationToLabel[task.actualEstimationChange]
        }
    }

    const [relativeProductivity, setRelativeProductivity] = useState(initRelativeProductivity)
    const [blindEstimationChange, setBlindEstimationChange] = useState(initBlindEstimation)
    const [actualEstimationChange, setActualEstimationChange] = useState(initActualEstimation)
    const [notes, setNotes] = useState("")

    const submitReflectionHandler = async () => {
        // if (!relativeProductivity || !blindEstimationChange || !actualEstimationChange) {
        //     toast({
        //         position: "top-middle",
        //         title: "Task Reflection Unsuccessful",
        //         description: "Please make sure all required fields are entered.",
        //         status: "error",
        //         duration: 3000,
        //         isClosable: true
        //     });
        //     return;
        // }
        // const body = {
        //     completed: true,
        //     relativeProductivity: relativeProductivity.value,
        //     blindEstimationChange: blindEstimationChange.value,
        //     actualEstimationChange: actualEstimationChange.value
        // }
        const body = {
            completed: true,
            notes: notes
        }
        await fetch (`/api/tasks/${task.id}`, {method: "POST", body: JSON.stringify(body)})
        await props.updateTaskHandler("Edit");
        completedTaskOnClose()
        props.confettiHandler(true)
    }

    const relativeProductivityOptions = [
        {value: 1, label: "Unacceptable"},
        {value: 2, label: "Below Expectations"},
        {value: 3, label: "Met Expectations"},
        {value: 4, label: "Exceeded Expectations"},
        {value: 5, label: "Outstanding"},
    ]
    
    const timeEstimationOptions = [
        {value: 1, label: "Drastically Decrease Time Estimation"},
        {value: 2, label: "Slightly Decrease Time Estimation"},
        {value: 3, label: "Keep Time Estimation The Same"},
        {value: 4, label: "Slightly Increase Time Estimation"},
        {value: 5, label: "Drastically Increase Time Estimation"},
    ]


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
            <Modal size="xl" isOpen={completedTaskIsOpen} onClose={completedTaskOnClose} closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">
                        Post Task Reflection
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>You did it! 🎉</Text>
                        <Text>Before we cross this off your task list, let&apos;s take a moment to reflect on your progress 🔥:</Text>

                        <FormLabel mt="2%" fontWeight="bold" fontSize="xl">Predicted Effort and Time:</FormLabel>
                        <Flex>
                            <Text as="b">Effort:</Text>
                            <Text ml="1%">{task.effortRating}</Text>
                        </Flex>
                        <Flex mt="1%">
                            <Text as="b">Time:</Text>
                            <Text ml="1%">{effortValueToLabel[task.effortRating]}</Text>
                        </Flex>

                        <FormLabel mt="2%" fontWeight="bold" fontSize="xl">Actual Effort and Time:</FormLabel>
                        <Flex>
                            <Text as="b">Effort:</Text>
                            <Text ml="1%">{calculateActualTimeAndEffort(task)[1]}</Text>
                        </Flex>
                        <Flex mt="1%">
                            <Text as="b">Time:</Text>
                            <Text ml="1%">{props.getTimeDisplay(...getHMSfromDuration(calculateActualTimeAndEffort(task)[0]))}</Text>
                        </Flex>
                        {/* <FormControl isRequired>
                            <FormLabel fontWeight="bold">How would you rate your relative productivity during each working session for this task?</FormLabel>
                            <Select 
                                placeholder="Select an answer..." 
                                size="md"
                                options={relativeProductivityOptions}
                                value={relativeProductivity}
                                onChange={(e) => setRelativeProductivity({value: e.value, label: e.label})}
                            />
                        </FormControl>
                        <FormControl mt="5%" isRequired>
                            <FormLabel fontWeight="bold">Without viewing your original estimation and working session times, how would you change your time estimation for a similar task in the future?</FormLabel>
                            <Select 
                                placeholder="Select an answer..." 
                                size="md"
                                options={timeEstimationOptions}
                                value={blindEstimationChange}
                                onChange={(e) => setBlindEstimationChange({value: e.value, label: e.label})}
                            />
                        </FormControl>
                        <FormControl mt="5%" isRequired>
                            <FormLabel fontWeight="bold">Now, viewing your original estimation and working session times, how would you change your time estimation for a similar task in the future?</FormLabel>
                            <Select 
                                placeholder="Select an answer..." 
                                size="md"
                                options={timeEstimationOptions}
                                value={actualEstimationChange}
                                onChange={(e) => setActualEstimationChange({value: e.value, label: e.label})}
                            />
                        </FormControl> */}
                        <FormControl>
                            <FormLabel mt="2%" fontWeight="bold" fontSize="xl">Notes:</FormLabel>
                            <FormHelperText mb="1%">Add any notes or reflections now that you&apos;ve completed your task</FormHelperText>
                            <Textarea onChange={(e) => setNotes(e.target.value)}/>
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