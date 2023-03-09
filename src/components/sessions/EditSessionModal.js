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
    Textarea,
    Flex,
    VStack,
    Input
} from '@chakra-ui/react';
import {
    EditIcon
} from '@chakra-ui/icons'
import { Select } from "chakra-react-select";
import { useState, useEffect } from "react";

export default function EditSessionModal(props) {
    const {
        session, 
        userId, 
        updateSessionHandler,
    } = props;

    const { isOpen: editSessionIsOpen, onClose: editSessionOnClose, onOpen: editSessionOnOpen } = useDisclosure();
    const [startDateTime, setStartDateTime] = useState(session.startDateTime);
    const [endDateTime, setEndDateTime] = useState((new Date(new Date(startDateTime) - ((new Date()).getTimezoneOffset() * 60000) + (session.duration * 1000))).toISOString().slice(0, -5));
    const [productivityRating, setProductivityRating] = useState(session.productivityRating);
    const [location, setLocation] = useState(session.location);
    const [notes, setNotes] = useState(session.notes);

    useEffect(() => {
        setStartDateTime(session.startDateTime)
        setEndDateTime((new Date(new Date(startDateTime) - ((new Date()).getTimezoneOffset() * 60000) + (session.duration * 1000))).toISOString().slice(0, -5))
        setProductivityRating(session.productivityRating)
        setLocation(session.location)
        setNotes(session.notes)
    }, [editSessionIsOpen])

    const productivityRatingOptions = [
        {value: 1, label: "I finished less than I expected to"},
        {value: 2, label: "I finished exactly what I expected to"},
        {value: 3, label: "I finished more than I expected to"},
    ];

    const productivityRatingToLabel = {
        1: "I finished less than I expected to",
        2: "I finished exactly what I expected to",
        3: "I finished more than I expected to",
    }

    const locationOptions = [
        {value: "In-Class", label: "In-Class"},
        {value: "Library", label: "Library"},
        {value: "Home", label: "Home"},
        {value: "Other", label: "Other"},
    ];

    const handleEditSessionSubmit = async (event) => {
        event.preventDefault();
        const duration = (Date.parse(endDateTime) - Date.parse(startDateTime)) / 1000 // Date.parse is in milliseconds
        console.log(startDateTime, endDateTime, duration)
        const body = {
            userId: userId,
            productivityRating: productivityRating,
            notes: notes,
            location: location,
            startDateTime: startDateTime,
            duration: duration
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
                    <Flex justify="space-between">
                            <VStack>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="bold">Session Start Date and Time</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        onChange={(e) => setStartDateTime(e.target.value)}
                                        defaultValue={(new Date(new Date(startDateTime) - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -5)}
                                    />
                                </FormControl>
                            </VStack>
                            <VStack>
                                <FormControl isRequired>
                                    <FormLabel fontWeight="bold">Session End Date and Time</FormLabel>
                                    <Input 
                                        type="datetime-local"
                                        onChange={(e) => setEndDateTime(e.target.value)}
                                        value={endDateTime}
                                    />
                                </FormControl>
                            </VStack>
                        </Flex>
                        <FormControl mt="2%" isRequired>
                            <FormLabel fontWeight="bold">Productivity Rating</FormLabel>
                            <FormHelperText mb="1%">Rate how productive you felt your working session was:</FormHelperText>
                            <Select 
                                width="50%" 
                                variant="outline" 
                                bg="white"
                                placeholder="Select a Productivity Rating"
                                options={productivityRatingOptions}
                                onChange={(e) => setProductivityRating(e.value)}
                                value={{label: productivityRatingToLabel[productivityRating], value: productivityRating}}
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
                        <FormControl mt="2%">
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