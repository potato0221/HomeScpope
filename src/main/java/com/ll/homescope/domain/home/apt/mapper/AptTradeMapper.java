package com.ll.homescope.domain.home.apt.mapper;

import com.ll.homescope.domain.home.apt.dto.ApartmentTradeResponse;
import com.ll.homescope.domain.home.realestate.entity.RealEstateDeal;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AptTradeMapper {

    public static List<RealEstateDeal> toRealEstateDeals(ApartmentTradeResponse response) {
        List<RealEstateDeal> results = new ArrayList<>();

        if (response == null || response.getBody() == null || response.getBody().getItems() == null) {
            return results;
        }

        for (ApartmentTradeResponse.Item item : response.getBody().getItems().getItem()) {
            results.add(toRealEstateDeal(item));
        }

        return results;
    }

    public static RealEstateDeal toRealEstateDeal(ApartmentTradeResponse.Item item) {

        // 날짜 변환 YYYY-MM-DD
        LocalDate dealDate = LocalDate.of(
                Integer.parseInt(item.getDealYear()),
                Integer.parseInt(item.getDealMonth()),
                Integer.parseInt(item.getDealDay())
        );

        // 금액 "12,000" → long 120000000L
        long price = parsePrice(item.getDealAmount());

        // 면적 문자열 → double
        double area = parseDouble(item.getExcluUseAr());

        // 층 문자열 → int
        int floor = parseInt(item.getFloor());

        // 건축년도 문자열 → int
        int buildYear = parseInt(item.getBuildYear());

        return RealEstateDeal.builder()
                .region(item.getUmdNm())
                .complexName(item.getAptNm())
                .dealDate(dealDate)
                .price(price)
                .area(area)
                .floor(floor)
                .buildYear(buildYear)
                .transactionType(item.getDealingGbn())
                .propertyType("APT")   // 추후 확장 대비
                .location(new GeoPoint(0,0)) // ⚠ 좌표는 나중에 채우는 단계
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
