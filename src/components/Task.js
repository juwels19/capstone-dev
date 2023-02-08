import { Box, Button, ButtonGroup, Checkbox, Flex, IconButton, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { ChevronRightIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Input
} from "@chakra-ui/react"
import { Select, CreatableSelect } from "chakra-react-select";
import Link from "next/link";
import { useState } from "react";

export default function Task(props) {
    const task = props.task;
    console.log("inside task", task);
    const taskId = task.id;

    const { isOpen: deleteTaskIsOpen, onOpen: deleteTaskOnOpen, onClose: deleteTaskOnClose } = useDisclosure();
    const { isOpen: editTaskIsOpen, onOpen: editTaskOnOpen, onClose: editTaskOnClose } = useDisclosure();

    const [taskName, setTaskName] = useState(task.taskName);
    const [courseSelected, setCourseSelected] = useState({label: "test", value: "test"});
    const [effort, setEffort] = useState(task.effortRating);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [isLoading, setIsLoading] = useState(false);

    const [courseOptions, setCourseOptions] = useState(props.courses);

    const effortOptions = [
        {value: 1, label: "1 (0-2 hours)"},
        {value: 2, label: "2 (2-4 hours)"},
        {value: 3, label: "3 (4-6 hours)"},
        {value: 4, label: "4 (6-8 hours)"},
        {value: 5, label: "5 (8+ hours)"},
    ];

    const handleEditTaskSubmit = async (event) => {
        event.preventDefault();
    }

    const deleteTaskHandler = async () => {
        //TODO add error handling here
        const deleteRes = await fetch(`/api/tasks/${taskId}`, {method: "DELETE"})
        deleteTaskOnClose();
        props.updateTaskHandler();
    }

    return (
        <Box bg="gray.200" borderRadius="md" px="3%" py="2%" my="1%" key={`${task.id}-${task.userId}-${task.courseId}`}>
            <Modal size="2xl" isOpen={editTaskIsOpen} onClose={editTaskOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Edit Task</ModalHeader>
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
                                <Button colorScheme="gray" onClick={editTaskOnClose} width="100%">
                                    Cancel
                                </Button>
                                <Button colorScheme="green" 
                                        width="100%" 
                                        type="submit"
                                        onClick={handleEditTaskSubmit}>
                                    Create Task
                                </Button>
                            </ButtonGroup>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal size="xl" isOpen={deleteTaskIsOpen} onClose={deleteTaskOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Delete Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to delete this task? It cannot be recovered.</Text>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={deleteTaskOnClose} width="100%">
                                Cancel
                            </Button>
                            <Button 
                                colorScheme="red" 
                                width="100%" 
                                type="submit"
                                onClick={deleteTaskHandler}
                            >
                                Confirm Deletion
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Flex>
                <Checkbox size="lg" bg="white"></Checkbox>
                <Text as="b" ml="2%" fontSize="xs">
                    {task.taskName}
                </Text>
                <Spacer />
                <ButtonGroup>
                    <Link href={`/task/${task.id}`}>
                        <Button 
                            rightIcon={<ChevronRightIcon boxSize="1.5em"/>} 
                            size="md" 
                            colorScheme="blue">
                            Open Task
                        </Button>
                    </Link>
                    <IconButton 
                        aria-label="edit-task"
                        onClick={editTaskOnOpen}
                        icon={<EditIcon />}
                        variant="ghost"
                        ml="2%"
                    />
                    <IconButton 
                        aria-label="delete-task" 
                        onClick={deleteTaskOnOpen}
                        icon={<DeleteIcon />}
                        variant="ghost"
                    />
                </ButtonGroup>
            </Flex>
        </Box>
    );
}