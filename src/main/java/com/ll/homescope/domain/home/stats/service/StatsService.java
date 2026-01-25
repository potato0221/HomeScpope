package com.ll.homescope.domain.home.stats.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ll.homescope.domain.home.deal.repository.CollectedPeriodRepository;
import com.ll.homescope.domain.home.stats.dto.*;
import com.ll.homescope.global.enums.HalfType;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.exceptions.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final ElasticsearchClient esClient;
    private final CollectedPeriodRepository collectedPeriodRepository;

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

    //지역 별 거래량 컨트롤러 호출 메서드
    public List<RegionCountDto> topRegionByCount(
            int statYear,
            String statHalf
    ) throws IOException {

        HalfType halfType = HalfType.valueOf(statHalf);
        DateRange range = resolveStatDateRange(statYear, halfType);

        SearchResponse<Void> response = searchRegionStatsByDateRange(
                range.from(),
                range.to(),
                a -> {}
        );

        return extractRegionCount(response);
    }

    //지역 별 거래량 통계 추출
    private List<RegionCountDto> extractRegionCount(
            SearchResponse<Void> response
    ) {
        return response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array()
                .stream()
                .map(b -> new RegionCountDto(
                        b.key().stringValue(),
                        b.docCount()
                ))
                .toList();
    }

    //지역 별 평균가 증감률 (전기 대비) 컨트롤러 호출 메서드
    public List<RegionPriceChangeDto> avgPriceChangeByRegion(
            int prevYear,
            String prevHalf,
            int currYear,
            String currHalf
    ) throws IOException {

        if(!collectedPeriodRepository.existsByStatYearAndStatHalf(prevYear, HalfType.valueOf(prevHalf))){
            throw new GlobalException(Msg.E404_1_DATA_NOT_FOUND);
        }

        DateRange prev = resolveStatDateRange(prevYear, HalfType.valueOf(prevHalf));
        DateRange curr = resolveStatDateRange(currYear, HalfType.valueOf(currHalf));

        SearchResponse<Void> response =
                esClient.search(s -> s
                                .index("real_estate_deals")
                                .size(0)
                                .aggregations("by_region", a -> a
                                        .terms(t -> t
                                                .field("region.keyword")
                                                .size(100)
                                        )
                                        .aggregations("periods", sub -> sub
                                                .filters(f -> f
                                                        .filters(b -> b.keyed(Map.of(
                                                                "prev", Query.of(q -> q
                                                                        .range(r -> r
                                                                                .number(n -> n
                                                                                        .field("dealDate")
                                                                                        .gte((double) prev.from())
                                                                                        .lte((double) prev.to())
                                                                                )
                                                                        )
                                                                ),
                                                                "curr", Query.of(q -> q
                                                                        .range(r -> r
                                                                                .number(n -> n
                                                                                        .field("dealDate")
                                                                                        .gte((double) curr.from())
                                                                                        .lte((double) curr.to())
                                                                                )
                                                                        )
                                                                )
                                                        )))
                                                )
                                                .aggregations("avg_price",
                                                        avg -> avg.avg(v -> v.field("price"))
                                                )
                                        )
                                ),
                        Void.class
                );

        return extractRegionAvgPriceChange(response);
    }

    //지역별 평균가 증감률 통계 추출 메서드
    private List<RegionPriceChangeDto> extractRegionAvgPriceChange(
            SearchResponse<Void> response
    ) {
        return response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array()
                .stream()
                .map(b -> {
                    var buckets = b.aggregations()
                            .get("periods")
                            .filters()
                            .buckets()
                            .keyed();

                    double prev = buckets.get("prev")
                            .aggregations().get("avg_price").avg().value();

                    double curr = buckets.get("curr")
                            .aggregations().get("avg_price").avg().value();

                    double rate = prev == 0 ? 0 : (curr - prev) / prev * 100;

                    return new RegionPriceChangeDto(
                            b.key().stringValue(),
                            prev,
                            curr,
                            rate
                    );
                })
                .toList();
    }

    //지역별 신축/준신축/구축 평균가 컨트롤러 호출 메서드
    public List<RegionBuildAgeAvgPriceDto> avgPriceByRegionAndBuildAge(
            int statYear,
            String statHalf
    ) throws IOException {

        HalfType halfType = HalfType.valueOf(statHalf);
        DateRange range = resolveStatDateRange(statYear, halfType);

        int newMin = statYear - 5;
        int semiMin = statYear - 10;
        int semiMax = statYear - 6;
        int oldMax = statYear - 11;

        SearchResponse<Void> response =
                esClient.search(s -> s
                                .index("real_estate_deals")
                                .size(0)
                                .query(q -> q
                                        .range(r -> r
                                                .number(n -> n
                                                        .field("dealDate")
                                                        .gte((double) range.from())
                                                        .lte((double) range.to())
                                                )
                                        )
                                )
                                .aggregations("by_region", a -> a
                                        .terms(t -> t
                                                .field("region.keyword")
                                                .size(100)
                                        )
                                        .aggregations("by_age", sub -> sub
                                                .filters(f -> f
                                                        .filters(b -> b.keyed(Map.of(
                                                                "new", Query.of(q -> q
                                                                        .range(r -> r
                                                                                .number(n -> n
                                                                                        .field("buildYear")
                                                                                        .gte((double) newMin)
                                                                                )
                                                                        )
                                                                ),
                                                                "semi", Query.of(q -> q
                                                                        .range(r -> r
                                                                                .number(n -> n
                                                                                        .field("buildYear")
                                                                                        .gte((double) semiMin)
                                                                                        .lte((double) semiMax)
                                                                                )
                                                                        )
                                                                ),
                                                                "old", Query.of(q -> q
                                                                        .range(r -> r
                                                                                .number(n -> n
                                                                                        .field("buildYear")
                                                                                        .lte((double) oldMax)
                                                                                )
                                                                        )
                                                                )
                                                        )))
                                                )
                                                .aggregations("avg_price",
                                                        avg -> avg.avg(v -> v.field("price"))
                                                )
                                        )
                                ),
                        Void.class
                );

        return extractRegionBuildAgeAvgPrice(response);
    }

    //지역별 신축/준신축/구축 평균가 통계 추출 메서드
    private List<RegionBuildAgeAvgPriceDto> extractRegionBuildAgeAvgPrice(
            SearchResponse<Void> response
    ) {
        return response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array()
                .stream()
                .map(b -> {
                    var buckets = b.aggregations()
                            .get("by_age")
                            .filters()
                            .buckets()
                            .keyed();

                    double newAvg = buckets.get("new")
                            .aggregations().get("avg_price").avg().value();

                    double semiAvg = buckets.get("semi")
                            .aggregations().get("avg_price").avg().value();

                    double oldAvg = buckets.get("old")
                            .aggregations().get("avg_price").avg().value();

                    return new RegionBuildAgeAvgPriceDto(
                            b.key().stringValue(),
                            newAvg,
                            semiAvg,
                            oldAvg
                    );
                })
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
