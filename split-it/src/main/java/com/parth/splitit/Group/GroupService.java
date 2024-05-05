package com.parth.splitit.Group;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.parth.splitit.Participant.Participant;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository repository;

    public String save(Group group) {
        return repository.save(group).getId();
    }

    public Group findById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<Group> findAll() {
        return repository.findAll();
    }

    public Group updateGroup(String id, Group updatedGroup) {
        Optional<Group> optionalExistingGroup = repository.findById(id);
        if (optionalExistingGroup.isPresent()) {
            Group existingGroup = optionalExistingGroup.get();
            existingGroup.setName(updatedGroup.getName());
            existingGroup.setCurrency(updatedGroup.getCurrency());
            existingGroup.setExpenses(updatedGroup.getExpenses());
            existingGroup.setCreatedAt(updatedGroup.getCreatedAt());

            // Save the updated group
            return repository.save(existingGroup);
        } else {
            // Handle case where group with given id does not exist
            return null; // Or throw an exception
        }
    }

    public Group addParticipant(String groupId, Participant participant) {
        Group group = repository.findById(groupId).orElseThrow();

        group.getParticipants().add(participant);

        // Update the group in the database
        return repository.save(group);
    }

    public Group deleteParticipant(String groupId, String participantId) {
        // Retrieve the group from the database
        Group group = repository.findById(groupId).orElseThrow();

        // Remove the participant from the group's participant array
        group.getParticipants().removeIf(participant -> participant.getId().equals(participantId));

        // Update the group in the database
        return repository.save(group);
    }
}
