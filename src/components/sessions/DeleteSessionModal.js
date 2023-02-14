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

export default function DeleteSessionModal(props) {
    const {userId, sessionId} = props;

    const { isOpen: deleteSessionIsOpen, onOpen: deleteSessionOnOpen, onClose: deleteSessionOnClose } = useDisclosure();


    const deleteSessionHandler = async () => {
        //TODO add error handling here
        // const deleteRes = await fetch(`/api/sessions/${session.id}`, {method: "DELETE"})
        deleteSessionOnClose();
        props.updateSessionHandler("Deletion");
    }

    return (
        <>
            <Modal size="xl" isOpen={deleteSessionIsOpen} onClose={deleteSessionOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Delete Working Session</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to delete this working session?</Text>
                        <br/>
                        <Text>This action is irreversible.</Text>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={deleteSessionOnClose} width="100%">
                                Cancel
                            </Button>
                            <Button 
                                colorScheme="red" 
                                width="100%" 
                                type="submit"
                                onClick={deleteSessionHandler}
                            >
                                Confirm Deletion
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <IconButton 
                aria-label="delete-session" 
                onClick={deleteSessionOnOpen}
                icon={<Icon as={FaTrash} />}
                variant="ghost"
                size='lg'
            />
        </>
    );
}