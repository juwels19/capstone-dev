import {
    Button, 
    ButtonGroup, 
    Icon, 
    IconButton, 
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
  } from '@chakra-ui/react';
import { FaTrash } from "react-icons/fa"

export default function DeleteTaskModal(props) {
    const task = props.task;

    const { isOpen: deleteTaskIsOpen, onOpen: deleteTaskOnOpen, onClose: deleteTaskOnClose } = useDisclosure();


    const deleteTaskHandler = async () => {
        //TODO add error handling here
        const deleteRes = await fetch(`/api/tasks/${task.id}`, {method: "DELETE"})
        deleteTaskOnClose();
        props.updateTaskHandler("Deletion");
    }

    return (
        <>
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
            <IconButton 
                aria-label="delete-task" 
                onClick={deleteTaskOnOpen}
                icon={<Icon as={FaTrash} />}
                variant="ghost"
            />
        </>
    );
}