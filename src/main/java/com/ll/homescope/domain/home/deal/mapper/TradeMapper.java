package com.ll.homescope.domain.home.deal.mapper;

import com.ll.homescope.domain.home.deal.dto.TradeResponse;
import com.ll.homescope.domain.home.deal.entity.RealEstateDeal;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class TradeMapper {

    public static List<RealEstateDeal> toRealEstateDeals(
            String areaCode,
            String region,
            TradeResponse response,
            String propertyType
    ) {
        List<RealEstateDeal> results = new ArrayList<>();

        if (response == null ||
                response.getBody() == null ||
                response.getBody().getItems() == null ||
                response.getBody().getItems().getItem() == null
        ) {
            return results;
        }

        for (TradeResponse.Item item : response.getBody().getItems().getItem()) {
            results.add(toRealEstateDeal(areaCode, region, item, propertyType));
        }

        return results;
    }

    public static RealEstateDeal toRealEstateDeal(String areaCode, String region, TradeResponse.Item item, String propertyType) {

        // 날짜 변환 YYYY-MM-DD
        LocalDate dealDate = LocalDate.of(
                Integer.parseInt(item.getDealYear()),
                Integer.parseInt(item.getDealMonth()),
                Integer.parseInt(item.getDealDay())
        );

        // 금액
        long price = parsePrice(item.getDealAmount());

        // 면적
        double area = item.getMainArea();

        // 층
        int floor = item.getFloorSafe();

        // 건축 년도
        int buildYear = parseInt(item.getBuildYear());

        double areaPyeong = Math.round(
                (item.getMainArea() / 3.305785) * 100
        ) / 100.0;


        String month = String.format("%02d", Integer.parseInt(item.getDealMonth()));
        String day   = String.format("%02d", Integer.parseInt(item.getDealDay()));
        String floorPart = floor > 0 ? floor + "층 - " : "";

        String dealKey = areaCode + " - " +
                item.getBuildingName() + " - " +
                floorPart +
                areaPyeong + "평 - " +
                item.getDealYear() + month + day;


        dealKey = dealKey.replace(",", "");

        List<String> parts = new ArrayList<>();

        if (region != null && !region.isBlank()) {
            parts.add(region);
        }
        if (item.getUmdNm() != null && !item.getUmdNm().isBlank()) {
            parts.add(item.getUmdNm());
        }
        if (item.getJibun() != null && !item.getJibun().isBlank()) {
            parts.add(item.getJibun());
        }
        if (item.getBuildingName() != null && !item.getBuildingName().isBlank()) {
            parts.add(item.getBuildingName());
        }

        String complexName = String.join(" ", parts);

        return RealEstateDeal.builder()
                .dealKey(dealKey)
                .region(region)
                .complexName(complexName)
                .dealDate(dealDate)
                .price(price)
                .area(area)
                .floor(floor)
                .buildYear(buildYear)
                .transactionType(item.getDealingGbn())
                .propertyType(propertyType)
                .build();
    }

    private static long parsePrice(String value) {
        if (value == null) return 0;
        return Long.parseLong(value.replace(",", "")) * 10000L; // 만 원 → 원
    }

    private static int parseInt(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (Exception e) {
            return 0;
        }
    }

    private static double parseDouble(String value) {
        try {
            return Double.parseDouble(value.trim());
        } catch (Exception e) {
            return 0.0;
        }
    }
}
