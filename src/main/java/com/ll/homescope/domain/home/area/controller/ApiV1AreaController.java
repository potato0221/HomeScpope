package com.ll.homescope.domain.home.area.controller;

import com.ll.homescope.domain.home.area.service.AreaService;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import com.ll.homescope.standard.base.Empty;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/area")
@RequiredArgsConstructor
public class ApiV1AreaController {

    private final AreaService areaService;

    @PostMapping("/add")
    @Operation(summary = "지역 정보 등록")
    public RsData<Empty> addAreas(){

        areaService.saveArea();

        return RsData.of(Msg.E200_0_CREATE_SUCCEED);
    }
}
