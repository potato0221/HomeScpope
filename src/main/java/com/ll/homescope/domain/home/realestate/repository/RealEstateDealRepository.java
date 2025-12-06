package com.ll.homescope.domain.home.realestate.repository;

import com.ll.homescope.domain.home.realestate.entity.RealEstateDeal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface RealEstateDealRepository extends ElasticsearchRepository<RealEstateDeal, String> {
}
