package com.ll.homescope.home.apt.service;

import com.ll.homescope.home.apt.api.AptTradeClient;
import com.ll.homescope.home.apt.dto.ApartmentTradeResponse;
import com.ll.homescope.home.apt.mapper.AptTradeMapper;
import com.ll.homescope.home.realestate.entity.RealEstateDeal;
import com.ll.homescope.home.realestate.repository.RealEstateDealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AptService {

    private final AptTradeClient aptTradeClient;
    private final RealEstateDealRepository realEstateDealRepository;

    public void fetchAndSave(String lawdCd, String dealYmd) {

        int pageNo = 1;
        int numOfRows = 100;

        while (true) {
            // ① 공공 API 호출
            ApartmentTradeResponse response =
                    aptTradeClient.fetch(lawdCd, dealYmd, pageNo, numOfRows);

            // ② 응답 XML -> RealEstateDeal 리스트 변환
            List<RealEstateDeal> deals = AptTradeMapper.toRealEstateDeals(response);

            // 종료 조건
            if (deals.isEmpty()) break;

            // ③ Elasticsearch 저장
            realEstateDealRepository.saveAll(deals);

            // 마지막 페이지면 종료
            int current = response.getBody().getPageNo() * numOfRows;
            int total = response.getBody().getTotalCount();
            if (current >= total) break;

            pageNo++;
        }
    }
}
