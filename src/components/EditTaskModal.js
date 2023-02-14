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
import { useState } from "react";

export default function EditTaskModal(props) {
    const {
        task, 
        userId, 
        updateTaskHandler,
        handleCreateCourse,
        courseOptions,
    } = props;

    const effortOptions = [
        {value: 1, label: "1 (0-2 hours)"},
        {value: 2, label: "2 (2-4 hours)"},
        {value: 3, label: "3 (4-6 hours)"},
        {value: 4, label: "4 (6-8 hours)"},
        {value: 5, label: "5 (8+ hours)"},
    ];

    const effortValueToLabel = {
        1: "1 (0-2 hours)",
        2: "2 (2-4 hours)",
        3: "3 (4-6 hours)",
        4: "4 (6-8 hours)",
        5: "5 (8+ hours)",
    }

    console.log("in table")

    const { isOpen: editTaskIsOpen, onClose: editTaskOnClose, onOpen: editTaskOnOpen } = useDisclosure();

    const [taskName, setTaskName] = useState(task.taskName);
    const [courseSelected, setCourseSelected] = useState({label: task.course.courseName, value: task.course.courseName});
    const [effort, setEffort] = useState({value: task.effortRating, label: effortValueToLabel[task.effortRating]});
    const [dueDate, setDueDate] = useState(task.dueDate);

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
                                type="datetime-local"
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
                ml="2%"
            />
        </>
    );
}