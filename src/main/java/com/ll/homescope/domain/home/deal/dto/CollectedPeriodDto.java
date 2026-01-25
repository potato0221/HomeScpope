package com.ll.homescope.domain.home.deal.dto;

import com.ll.homescope.domain.home.deal.entity.CollectedPeriod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@AllArgsConstructor(access = PROTECTED)
@NoArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class CollectedPeriodDto {

    private int statYear;

    private String statHalf;

    private String propertyType;

    public CollectedPeriodDto(CollectedPeriod collectedPeriod){
        this.statYear = collectedPeriod.getStatYear();
        this.statHalf = collectedPeriod.getStatHalf().toString();
        this.propertyType = collectedPeriod.getPropertyType().getDisplayName();
    }
}
