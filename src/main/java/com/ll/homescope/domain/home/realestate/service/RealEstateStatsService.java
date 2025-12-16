package com.ll.homescope.domain.home.realestate.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ll.homescope.domain.home.realestate.dto.AvgPriceByRegionDto;
import com.ll.homescope.global.enums.HalfType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RealEstateStatsService {

    private final ElasticsearchClient esClient;

    public List<AvgPriceByRegionDto> avgPriceByRegion(int statYear, String statHalf) throws IOException{

        HalfType halfType = HalfType.valueOf(statHalf);

        int startMonth = halfType == HalfType.H1 ? 1 : 7;
        int endMonth   = halfType == HalfType.H1 ? 6 : 12;

        ZoneId zone = ZoneId.of("Asia/Seoul");

        Instant startInstant = LocalDate.of(statYear, startMonth, 1)
                .atStartOfDay(zone)
                .toInstant();

        Instant endInstant = LocalDate.of(statYear, endMonth,
                        YearMonth.of(statYear, endMonth).lengthOfMonth()
                ).atTime(23, 59, 59)
                .atZone(zone)
                .toInstant();

        long startDate = startInstant.toEpochMilli();
        long endDate   = endInstant.toEpochMilli();

        SearchResponse<Void> response = esClient.search(s -> s
                        .index("real_estate_deals")
                        .size(0)
                        .query(q -> q
                                .bool(b -> b
                                        .filter(f -> f
                                                .range(r -> r
                                                        .number(n -> n
                                                                .field("dealDate")
                                                                .gte((double) startDate)
                                                                .lte((double) endDate)
                                                        )
                                                )
                                        )
                                )
                        )
                        .aggregations("by_region", a -> a
                                .terms(t -> t
                                        .field("region.keyword")
                                        .size(100)
                                )
                                .aggregations("avg_price",
                                        sub -> sub.avg(v -> v.field("price"))
                                )
                        ),
                Void.class
        );

        List<AvgPriceByRegionDto> regionDtos = new ArrayList<>();

        var buckets = response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array();

        System.out.println(buckets.size());

        for (var bucket : buckets) {
            regionDtos.add(
                    new AvgPriceByRegionDto(
                            bucket.key().stringValue(),
                            bucket.aggregations()
                                    .get("avg_price")
                                    .avg()
                                    .value()
                    )
            );
        }

        return regionDtos;
    }
}
