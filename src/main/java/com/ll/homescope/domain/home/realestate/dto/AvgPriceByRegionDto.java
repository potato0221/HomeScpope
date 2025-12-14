package com.ll.homescope.domain.home.realestate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AvgPriceByRegionDto {

    private String region;
    private double avgPrice;

}
