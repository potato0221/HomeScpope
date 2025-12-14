package com.ll.homescope.domain.home.realestate.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.ll.homescope.domain.home.realestate.dto.AvgPriceByRegionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RealEstateStatsService {

    private final ElasticsearchClient esClient;

    public List<AvgPriceByRegionDto> avgPriceByRegion() throws IOException{

        SearchResponse<Void> response = esClient.search(s -> s
                .index("real_estate_deals")
                .size(0)
                .aggregations("by_region", a -> a
                        .terms(t ->t.
                                field("region.keyword")
                                .size(100))
                        .aggregations("avg_price",
                                sub -> sub.avg(v -> v.field("price")))
                ),
                Void.class
        );

        List<AvgPriceByRegionDto> regionDtos = new ArrayList<>();

        var buckets = response.aggregations()
                .get("by_region")
                .sterms()
                .buckets()
                .array();

        for(var bucket : buckets){
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
