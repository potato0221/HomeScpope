package com.ll.homescope.domain.home.deal.service;

import com.ll.homescope.domain.home.deal.client.TradeClient;
import com.ll.homescope.domain.home.deal.dto.TradeResponse;
import com.ll.homescope.domain.home.deal.dto.CollectedPeriodDto;
import com.ll.homescope.domain.home.deal.entity.CollectedPeriod;
import com.ll.homescope.domain.home.deal.mapper.TradeMapper;
import com.ll.homescope.domain.home.deal.repository.CollectedPeriodRepository;
import com.ll.homescope.domain.home.area.entity.Area;
import com.ll.homescope.domain.home.area.repository.AreaRepository;
import com.ll.homescope.domain.home.deal.entity.RealEstateDeal;
import com.ll.homescope.domain.home.deal.repository.RealEstateDealRepository;
import com.ll.homescope.global.app.AppConfig;
import com.ll.homescope.global.enums.HalfType;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.enums.PropertyType;
import com.ll.homescope.global.exceptions.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealService {

    private final TradeClient tradeClient;
    private final RealEstateDealRepository realEstateDealRepository;
    private final AreaRepository areaRepository;
    private final CollectedPeriodRepository collectedPeriodRepository;

    // 분기 별 데이터 불러오기
    public void fetchByYear(int collectedYear, String collectedHalf, String propertyType) {

        HalfType halfType = HalfType.valueOf(collectedHalf);

        PropertyType type = PropertyType.valueOf(propertyType);

        if(collectedPeriodRepository.existsByStatYearAndStatHalf(collectedYear, halfType)){
            throw new GlobalException(Msg.E400_0_ALREADY_REGISTERED_DATA);
        }

        int firstMonth = halfType == HalfType.H1 ? 1 : 7;
        int endMonth = halfType == HalfType.H1 ? 6 : 12;

        Map<String, String> areaMap =
                areaRepository.findAll()
                        .stream()
                        .collect(Collectors.toMap(
                                Area::getAreaCode,
                                Area::getAreaName
                        ));

        for (Map.Entry<String, String> entry : areaMap.entrySet() ) {

            for (int month = firstMonth; month <= endMonth; month++) {

                String code = entry.getKey();
                String region = entry.getValue();

                String dealYmd = collectedYear + String.format("%02d", month);

                try {
                    this.collectAndIndexDeals(code, region, dealYmd, propertyType);
                } catch (Exception e) {
                    System.out.println("Error region= " + code + region + ", ymd= " + dealYmd);
                    e.printStackTrace();
                }

                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // 인터럽트 상태 복구
                }
            }
        }

        CollectedPeriod collectedPeriod =
                CollectedPeriod.builder()
                        .statYear(collectedYear)
                        .statHalf(halfType)
                        .propertyType(type)
                        .build();

        collectedPeriodRepository.save(collectedPeriod);
    }

    private void collectAndIndexDeals(String areaCode, String region, String dealYmd, String propertyType) {

        int pageNo = 1;
        int numOfRows = 100;

        while (true) {
            TradeResponse response =
                    tradeClient.fetch(areaCode, dealYmd, pageNo, numOfRows, propertyType);

            List<RealEstateDeal> deals = TradeMapper.toRealEstateDeals(areaCode, region, response, propertyType);

            if (deals.isEmpty()) break;

            saveInBatches(deals);

            int current = response.getBody().getPageNo() * numOfRows;
            int total = response.getBody().getTotalCount();
            if (current >= total) break;

            pageNo++;
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

    public List<CollectedPeriodDto> getCollectedPeriodList(){

        return collectedPeriodRepository.findAll()
                .stream()
                .map(CollectedPeriodDto::new)
                .collect(Collectors.toList());
    }
}
