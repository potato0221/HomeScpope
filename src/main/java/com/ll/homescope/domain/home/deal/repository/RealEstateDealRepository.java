package com.ll.homescope.domain.home.deal.repository;

import com.ll.homescope.domain.home.deal.entity.RealEstateDeal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface RealEstateDealRepository extends ElasticsearchRepository<RealEstateDeal, String> {
}
