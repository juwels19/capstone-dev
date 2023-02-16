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
    ButtonGroup,
    Textarea
} from '@chakra-ui/react';
import {
    EditIcon
} from '@chakra-ui/icons'
import { Select } from "chakra-react-select";
import { useState } from "react";

export default function EditSessionModal(props) {
    const {
        session, 
        userId, 
        updateSessionHandler,
    } = props;

    const { isOpen: editSessionIsOpen, onClose: editSessionOnClose, onOpen: editSessionOnOpen } = useDisclosure();
    const [productivityRating, setProductivityRating] = useState(session.productivityRating);
    const [location, setLocation] = useState(session.location);
    const [notes, setNotes] = useState(session.notes);

    const productivityRatingOptions = [
        {value: 1, label: 1},
        {value: 2, label: 2},
        {value: 3, label: 3},
        {value: 4, label: 4},
        {value: 5, label: 5},
    ];

    const locationOptions = [
        {value: "In-Class", label: "In-Class"},
        {value: "Library", label: "Library"},
        {value: "Home", label: "Home"},
        {value: "Other", label: "Other"},
    ];

    const handleEditSessionSubmit = async (event) => {
        event.preventDefault();
        const body = {
            userId: userId,
            productivityRating: productivityRating,
            notes: notes,
            location: location
        }
        await fetch (`/api/sessions/${session.id}`, {method: "POST", body: JSON.stringify(body)})
        editSessionOnClose();
        await updateSessionHandler("Edit");
    }

    return (
        <>
            <Modal size="2xl" isOpen={editSessionIsOpen} onClose={editSessionOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="bold" fontSize="2xl">Edit Working Session Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel mt="2%" fontWeight="bold">Productivity Rating</FormLabel>
                            <FormHelperText mb="1%">Rate how productive you felt your working session was. (DEFINE 1-5 MEANING)</FormHelperText>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a Productivity Rating"
                                options={productivityRatingOptions}
                                onChange={(e) => setProductivityRating(e.value)}
                                value={{label: productivityRating, value: productivityRating}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel mt="2%" fontWeight="bold">Location</FormLabel>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a location for your working session..."
                                options={locationOptions}
                                onChange={(e) => setLocation(e.value)}
                                value={{label: location, value: location}}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontWeight="bold">Notes</FormLabel>
                            <Textarea onChange={(e) => setNotes(e.target.value)} value={notes}/>
                        </ FormControl>
                        <ButtonGroup sz="md" mt="5%" minWidth="100%">
                            <Button colorScheme="gray" onClick={editSessionOnClose} width="100%">
                                Cancel
                            </Button>
                            <Button colorScheme="green" 
                                    width="100%" 
                                    type="submit"
                                    onClick={handleEditSessionSubmit}>
                                Save Edits
                            </Button>
                        </ButtonGroup>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <IconButton 
                aria-label="edit-sesion"
                onClick={editSessionOnOpen}
                icon={<EditIcon />}
                variant="ghost"
                size='lg'
            />
        </>
    );
}