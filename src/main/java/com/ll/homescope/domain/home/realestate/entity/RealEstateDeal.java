package com.ll.homescope.domain.home.realestate.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.time.LocalDate;

@Data
@Builder
@Document(indexName = "real_estate_deals")
public class RealEstateDeal {
    @Id
    private String id;
    private String dealKey;
    private String region;
    private String complexName;
    private LocalDate dealDate;
    private long price;
    private double area;
    private int floor;
    private int buildYear;
    private String transactionType;
    private String propertyType;  // // APT, VILLA, HOUSE 등

}
