package com.parth.splitit.Group;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.parth.splitit.Participant.Participant;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/v1/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService service;

    @PostMapping("/create")
    public ResponseEntity<String> save(
            @RequestBody Group group) {
        return ResponseEntity.ok(service.save(group));
    }

    @GetMapping
    public ResponseEntity<List<Group>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{group-id}")
    public ResponseEntity<Group> findById(
            @PathVariable("group-id") String groupId) {
        return ResponseEntity.ok(service.findById(groupId));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(@PathVariable String groupId, @RequestBody Group group) {
        // Call the service layer to update the group
        Group updatedGroup = service.updateGroup(groupId, group);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{group-id}/participants/{participant-id}")
    public ResponseEntity<Group> deleteParticipant(
            @PathVariable("group-id") String groupId,
            @PathVariable("participant-id") String participantId) {
        // Call the service layer to delete the participant from the group
        Group updatedGroup = service.deleteParticipant(groupId, participantId);
        return ResponseEntity.ok(updatedGroup);
    }

    @PostMapping("/{group-id}/participants")
    public ResponseEntity<Group> addParticipant(
            @PathVariable("group-id") String groupId,
            @RequestBody Participant participant) {
        Group updatedGroup = service.addParticipant(groupId, participant);
        return ResponseEntity.ok(updatedGroup);
    }

}
