package com.ll.homescope.domain.home.realestate.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ll.homescope.domain.home.realestate.dto.AvgPriceDto;
import com.ll.homescope.domain.home.realestate.dto.AvgPricePerAreaDto;
import com.ll.homescope.global.enums.HalfType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class RealEstateStatsService {

    private final ElasticsearchClient esClient;

    // 지역별 평균가 컨트롤러 호출 메서드
    public List<AvgPriceDto> avgPrice(
            int statYear,
            String statHalf
    ) throws IOException {

        HalfType halfType = HalfType.valueOf(statHalf);
        DateRange range = resolveStatDateRange(statYear, halfType);

        SearchResponse<Void> response = searchRegionStatsByDateRange(
                range.from(),
                range.to(),
                a -> a.aggregations("avg_price",
                        sub -> sub.avg(v -> v.field("price"))
                )
        );

        return extractRegionAvgPrice(response);
    }

    //지역별 평균가 통계 추출
    private List<AvgPriceDto> extractRegionAvgPrice(
            SearchResponse<Void> response
    ) {
        return response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array()
                .stream()
                .map(b -> new AvgPriceDto(
                        b.key().stringValue(),
                        b.aggregations().get("avg_price").avg().value()
                ))
                .toList();
    }

    // 지역별 평당가 컨트롤러 호출 메서드
    public List<AvgPricePerAreaDto> avgPricePerArea(
            int statYear,
            String statHalf
    ) throws IOException {

        HalfType halfType = HalfType.valueOf(statHalf);
        DateRange range = resolveStatDateRange(statYear, halfType);

        SearchResponse<Void> response = searchRegionStatsByDateRange(
                range.from(),
                range.to(),
                a -> a.aggregations("avg_price_per_m2",
                        sub -> sub.avg(v -> v
                                .script(s -> s
                                        .source("doc['price'].value / doc['area'].value * 3.305785")
                                )
                        )
                )
        );

        return extractRegionAvgPricePerArea(response);
    }

    //지역별 평당가 통계 추출
    private List<AvgPricePerAreaDto> extractRegionAvgPricePerArea(
            SearchResponse<Void> response
    ) {
        return response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array()
                .stream()
                .map(b -> new AvgPricePerAreaDto(
                        b.key().stringValue(),
                        b.aggregations().get("avg_price_per_m2").avg().value()
                ))
                .toList();
    }

    //기간 계산 (공통)
    private DateRange resolveStatDateRange(int statYear, HalfType halfType) {
        int startMonth = halfType == HalfType.H1 ? 1 : 7;
        int endMonth = halfType == HalfType.H1 ? 6 : 12;

        ZoneId zone = ZoneId.of("Asia/Seoul");

        Instant startInstant = LocalDate.of(statYear, startMonth, 1)
                .atStartOfDay(zone)
                .toInstant();

        Instant endInstant = LocalDate.of(statYear, endMonth,
                        YearMonth.of(statYear, endMonth).lengthOfMonth()
                ).atTime(23, 59, 59)
                .atZone(zone)
                .toInstant();

        return new DateRange(
                startInstant.toEpochMilli(),
                endInstant.toEpochMilli()
        );
    }

    //통계 조회 템플릿 (공통)
    private SearchResponse<Void> searchRegionStatsByDateRange(
            long from,
            long to,
            Consumer<Aggregation.Builder> subAggregation
    ) throws IOException {

        return esClient.search(s -> s
                        .index("real_estate_deals")
                        .size(0)
                        .query(q -> q
                                .bool(b -> b
                                        .filter(f -> f
                                                .range(r -> r
                                                        .number(n -> n
                                                                .field("dealDate")
                                                                .gte((double) from)
                                                                .lte((double) to)
                                                        )
                                                )
                                        )
                                )
                        )
                        .aggregations("by_region", a -> {
                            a.terms(t -> t
                                    .field("region.keyword")
                                    .size(100)
                            );
                            subAggregation.accept(a);
                            return a;
                        }),
                Void.class
        );
    }

    public record DateRange(long from, long to) {}
}
