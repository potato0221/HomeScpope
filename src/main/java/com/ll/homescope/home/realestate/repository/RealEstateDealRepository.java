package com.ll.homescope.home.realestate.repository;

import com.ll.homescope.home.realestate.entity.RealEstateDeal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface RealEstateDealRepository extends ElasticsearchRepository<RealEstateDeal, String> {
}
