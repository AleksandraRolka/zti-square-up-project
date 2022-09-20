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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    public ResponseEntity<?> getTwoUsersDebtsFromGroup(@PathVariable("group_id") Long group_id,
                                                       @PathVariable("user1_id") Long user1_id,
                                                   @PathVariable("user2_id") Long user2_id) {
        if(groupRepository.findById(group_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Group does not exists"));
        if(userRepository.findById(user1_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!")); {
        }
        if(userRepository.findById(user2_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!")); {
        }
        return ResponseEntity.ok().body(debtService.getByGroupIdAndUsersIds(group_id,user1_id,user2_id));
    }

    @GetMapping(path = "/group/{group_id}/user/{user_id}/debt")
    public ResponseEntity<?> getTwoUsersDebtsFromGroup(@PathVariable("group_id") Long group_id,
                                                       @PathVariable("user_id") Long user_id) {
        if(groupRepository.findById(group_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("Group does not exists"));
        if(userRepository.findById(user_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!")); {
        }
        return ResponseEntity.ok().body(debtService.getByGroupIdAndUserId(group_id,user_id));
    }


    @PutMapping(path = "/debt/update")
    public ResponseEntity<?> updateUsersDebt(@RequestBody Debt debt) {
        return null;
    }
}
