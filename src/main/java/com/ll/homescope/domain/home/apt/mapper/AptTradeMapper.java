package com.ll.homescope.domain.home.apt.mapper;

import com.ll.homescope.domain.home.apt.dto.ApartmentTradeResponse;
import com.ll.homescope.domain.home.realestate.entity.RealEstateDeal;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AptTradeMapper {

    public static List<RealEstateDeal> toRealEstateDeals(
            String areaCode,
            String region,
            ApartmentTradeResponse response
    ) {
        List<RealEstateDeal> results = new ArrayList<>();

        if (response == null ||
                response.getBody() == null ||
                response.getBody().getItems() == null ||
                response.getBody().getItems().getItem() == null
        ) {
            return results;
        }

        for (ApartmentTradeResponse.Item item : response.getBody().getItems().getItem()) {
            results.add(toRealEstateDeal(areaCode, region, item));
        }

        return results;
    }

    public static RealEstateDeal toRealEstateDeal(String areaCode, String region, ApartmentTradeResponse.Item item) {

        // 날짜 변환 YYYY-MM-DD
        LocalDate dealDate = LocalDate.of(
                Integer.parseInt(item.getDealYear()),
                Integer.parseInt(item.getDealMonth()),
                Integer.parseInt(item.getDealDay())
        );

        // 금액
        long price = parsePrice(item.getDealAmount());

        // 면적
        double area = parseDouble(item.getExcluUseAr());

        // 층
        int floor = parseInt(item.getFloor());

        // 건축 년도
        int buildYear = parseInt(item.getBuildYear());

        double areaPyeong = Math.round(
                (Double.parseDouble(item.getExcluUseAr()) / 3.305785) * 100
        ) / 100.0;


        String month = String.format("%02d", Integer.parseInt(item.getDealMonth()));
        String day   = String.format("%02d", Integer.parseInt(item.getDealDay()));

        String id = areaCode + "-" +
                item.getAptNm() + "-" +
                item.getFloor() + "층" +
                areaPyeong + "평" +
                item.getDealYear() + month + day;


        id = id.replace(" ", "").replace(",", "");

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
        if (item.getAptNm() != null && !item.getAptNm().isBlank()) {
            parts.add(item.getAptNm());
        }

        String complexName = String.join(" ", parts);

        return RealEstateDeal.builder()
                .id(id)
                .region(region)
                .complexName(complexName)
                .dealDate(dealDate)
                .price(price)
                .area(area)
                .floor(floor)
                .buildYear(buildYear)
                .transactionType(item.getDealingGbn())
                .propertyType("APT")
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
