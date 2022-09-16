package com.server.api;

import com.server.api.utils.CustomErrorMessage;
import com.server.models.Debt;
import com.server.repository.GroupRepository;
import com.server.repository.UserRepository;
import com.server.service.DebtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api")
public class DebtController {
    public final DebtService debtService;
    public final UserRepository userRepository;
    public final GroupRepository groupRepository;

    @GetMapping(path = "/user/{user_id}/debts")
    public ResponseEntity<?> getAllUserDebts(@PathVariable("user_id") Long user_id) {
        if(userRepository.findById(user_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!"));
        return ResponseEntity.ok().body(debtService.getByUserId(user_id));
    }

    @GetMapping(path = "/group/{group_id}/user/{user1_id}/{user2_id}/debt")
    public ResponseEntity<?> getUserDebtsFromGroup(@PathVariable("group_id") Long group_id,
                                                   @PathVariable("user_id") Long user_id) {
        if(groupRepository.findById(group_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Group does not exists"));
        if(userRepository.findById(user_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!")); {
        }
        ResponseEntity.badRequest().body(new CustomErrorMessage("Can not get group details. Group does not exists"));
        return null;
    }

    @PutMapping(path = "/debt/update")
    public ResponseEntity<?> updateUsersDebt(@RequestBody Debt debt) {
        return null;
    }
}
