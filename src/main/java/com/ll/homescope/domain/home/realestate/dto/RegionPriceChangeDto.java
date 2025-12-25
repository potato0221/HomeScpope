package com.ll.homescope.domain.home.realestate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegionPriceChangeDto {

    private String region;

    private double prevAvgPrice;

    private double currAvgPrice;

    private double changeRate;

}
