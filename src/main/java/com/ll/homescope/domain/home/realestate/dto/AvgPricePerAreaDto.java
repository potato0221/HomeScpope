package com.ll.homescope.domain.home.realestate.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AvgPricePerAreaDto {

    private String region;

    private double avgPricePerArea;

}
