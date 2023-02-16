import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    ButtonGroup,
} from '@chakra-ui/react';
import {
    EditIcon
} from '@chakra-ui/icons'
import { Select, CreatableSelect } from "chakra-react-select";
import { useEffect, useState } from "react";

export default function EditTaskModal(props) {
    const {
        task, 
        userId, 
        updateTaskHandler,
        handleCreateCourse,
        courseOptions,
    } = props;

    const effortOptions = [
        {value: 1, label: "1 (< 0.5 hours)"},
        {value: 2, label: "2 (0.5-1 hours)"},
        {value: 3, label: "3 (1-3 hours)"},
        {value: 5, label: "5 (3-6 hours)"},
        {value: 8, label: "8 (6-12 hours)"},
        {value: 13, label: "13 (12+ hours)"},
    ];

    const effortValueToLabel = {
        1: "1 (< 0.5 hours)",
        2: "2 (0.5-1 hours)",
        3: "3 (1-3 hours)",
        5: "5 (3-6 hours)",
        8: "8 (6-12 hours)",
        13: "13 (12+ hours)",
    }

    const { isOpen: editTaskIsOpen, onClose: editTaskOnClose, onOpen: editTaskOnOpen } = useDisclosure();

    const [taskName, setTaskName] = useState(task.taskName);
    const [courseSelected, setCourseSelected] = useState({label: task.course.courseName, value: task.course.courseName});
    const [effort, setEffort] = useState({value: task.effortRating, label: effortValueToLabel[task.effortRating]});
    const [dueDate, setDueDate] = useState(task.dueDate);

    useEffect(() => {
        setTaskName(task.taskName)
        setCourseSelected({label: task.course.courseName, value: task.course.courseName})
        setEffort({value: task.effortRating, label: effortValueToLabel[task.effortRating]})
        setDueDate(task.dueDate)
    }, [editTaskIsOpen])

    const handleEditTaskSubmit = async (event) => {
        event.preventDefault();
        const body = {
            userId: task.userId,
            taskName: taskName,
            courseSelected: courseSelected.label,
            effortRating: effort.value,
            dueDate: dueDate,
        }
        await fetch (`/api/tasks/${task.id}`, {method: "POST", body: JSON.stringify(body)})
        editTaskOnClose();
        await updateTaskHandler("Edit");
    }

    return (
        <>
            <Modal size="2xl" isOpen={editTaskIsOpen} onClose={editTaskOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Edit Task</ModalHeader>
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
                                value={taskName}
                            />
                        </ FormControl>
                        <FormControl mt="2%">
                            <FormLabel fontWeight="bold">Assign Course</FormLabel>
                            <FormHelperText mb="1%">Assigning a course helps keep your tasks organized. We recommend assigning a course to a task.</FormHelperText>
                            <CreatableSelect 
                                placeholder="Select a course or type to create a new one..." 
                                size="md"
                                isClearable
                                options={courseOptions}
                                onCreateOption={(value) => handleCreateCourse(value, userId)}
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
                                onChange={(e) => setEffort({value: e.value, label: e.label})}
                                value={effort}
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
                                value={dueDate}
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
                                Save Edits
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <IconButton 
                aria-label="edit-task"
                onClick={editTaskOnOpen}
                icon={<EditIcon />}
                variant="ghost"
                size='lg'
            />
        </>
    );
}