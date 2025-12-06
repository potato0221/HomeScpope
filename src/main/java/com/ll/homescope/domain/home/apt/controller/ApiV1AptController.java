package com.ll.homescope.domain.home.apt.controller;


import com.ll.homescope.domain.home.apt.service.AptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/apt")
@RequiredArgsConstructor
public class ApiV1AptController {

    private final AptService aptService;

    @GetMapping("/fetch")
    public String fetch(
            @RequestParam String lawdCd,
            @RequestParam String dealYmd
    ) {
        aptService.fetchAndSave(lawdCd, dealYmd);
        return "OK";
    }
}
