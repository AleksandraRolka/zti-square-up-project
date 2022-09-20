package com.server.api;

import com.server.api.utils.ToUpdateBalance;
import com.server.api.utils.CustomErrorMessage;
import com.server.models.Balance;
import com.server.repository.BalanceRepository;
import com.server.repository.UserRepository;
import com.server.service.BalanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(path = "/api/")
public class BalanceController {
    private final BalanceService balanceService;
    private final UserRepository userRepository;

    @GetMapping(path = "/user/{user_id}/balance")
    public ResponseEntity<?> getUserBalance(@PathVariable("user_id") Long user_id) {
        if(userRepository.findById(user_id).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!"));
        return ResponseEntity.ok().body(balanceService.findByUserId(user_id));
    }

    @PutMapping(path = "/user/{user_id}/balance")
    public ResponseEntity<?> updateUserBalance(@RequestBody ToUpdateBalance obj) {
        if(userRepository.findById(obj.getUser_id()).isEmpty())
            return ResponseEntity.badRequest().body(new CustomErrorMessage("User not exist!"));
        Balance currBalance = balanceService.findByUserId(obj.getUser_id());

        Double owe = 0.0;
        Double owed = 0.0;
        if(obj.getIsReducing()) {
            owed = obj.getAmount();
        } else {
            owe = obj.getAmount();
        }
        balanceService.updateUserBalance(obj.getUser_id(), owe, owed);
        return ResponseEntity.ok().build();
    }
}
