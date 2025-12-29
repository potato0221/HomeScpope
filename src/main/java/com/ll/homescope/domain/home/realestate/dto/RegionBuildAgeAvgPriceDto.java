package com.ll.homescope.domain.home.realestate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegionBuildAgeAvgPriceDto {

    private String region;

    private double newAvgPrice;

    private double semiNewAvgPrice;

    private double oldAvgPrice;

}
