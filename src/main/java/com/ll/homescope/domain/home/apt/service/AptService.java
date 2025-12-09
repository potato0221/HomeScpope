package com.ll.homescope.domain.home.apt.service;

import com.ll.homescope.domain.home.apt.api.AptTradeClient;
import com.ll.homescope.domain.home.apt.dto.ApartmentTradeResponse;
import com.ll.homescope.domain.home.apt.mapper.AptTradeMapper;
import com.ll.homescope.domain.home.area.repository.AreaRepository;
import com.ll.homescope.domain.home.realestate.entity.RealEstateDeal;
import com.ll.homescope.domain.home.realestate.repository.RealEstateDealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AptService {

    private final AptTradeClient aptTradeClient;
    private final RealEstateDealRepository realEstateDealRepository;
    private final AreaRepository areaRepository;

    public void fetchAndSave(String areaCode, String dealYmd) {

        int pageNo = 1;
        int numOfRows = 100;

        while (true) {
            // ① 공공 API 호출
            ApartmentTradeResponse response =
                    aptTradeClient.fetch(areaCode, dealYmd, pageNo, numOfRows);

            // ② 응답 XML -> RealEstateDeal 리스트 변환
            List<RealEstateDeal> deals = AptTradeMapper.toRealEstateDeals(areaCode, response);

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


    // 분기 별 데이터 불러오기
    public void fetchByYear(int year, String half) {


        int firstMonth = 1;
        int endMonth = 6;

        if(half.equals("secondHalf")){
            firstMonth = 7;
            endMonth = 12;
        }

        List<String> areaCodes = areaRepository.findAllAreaCodes();

        for (String code : areaCodes) {

            for (int month = firstMonth; month <= endMonth; month++) {

                String dealYmd = year + String.format("%02d", month);

                try {
                    this.fetchAndSave(code, dealYmd);
                } catch (Exception e) {
                    System.out.println("Error region= " + code + ", ymd= " + dealYmd);
                }

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // 인터럽트 상태 복구
                }
            }
        }
    }
}
