package com.ll.homescope.home.apt.controller;


import com.ll.homescope.home.apt.service.AptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ApiV1AptController {

    private final AptService aptService;

    @GetMapping("/api/v1/apt/fetch")
    public String fetch(
            @RequestParam String lawdCd,
            @RequestParam String dealYmd
    ) {
        aptService.fetchAndSave(lawdCd, dealYmd);
        return "OK";
    }
}
