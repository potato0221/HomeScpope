package com.ll.homescope.domain.home.apt.service;

import com.ll.homescope.domain.home.apt.api.AptTradeClient;
import com.ll.homescope.domain.home.apt.dto.ApartmentTradeResponse;
import com.ll.homescope.domain.home.apt.mapper.AptTradeMapper;
import com.ll.homescope.domain.home.area.repository.AreaRepository;
import com.ll.homescope.domain.home.realestate.entity.RealEstateDeal;
import com.ll.homescope.domain.home.realestate.repository.RealEstateDealRepository;
import com.ll.homescope.global.app.AppConfig;
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
            ApartmentTradeResponse response =
                    aptTradeClient.fetch(areaCode, dealYmd, pageNo, numOfRows);

            List<RealEstateDeal> deals = AptTradeMapper.toRealEstateDeals(areaCode, response);

            if (deals.isEmpty()) break;

            saveInBatches(deals);

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

    private void saveInBatches(List<RealEstateDeal> deals) {

        int bulkSize = AppConfig.BULK_SIZE;

        for (int i = 0; i < deals.size(); i += bulkSize) {
            int end = Math.min(i + bulkSize, deals.size());
            List<RealEstateDeal> batch = deals.subList(i, end);

            realEstateDealRepository.saveAll(batch);

            try {
                Thread.sleep(150);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
