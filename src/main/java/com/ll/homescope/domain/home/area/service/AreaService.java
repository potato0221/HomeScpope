package com.ll.homescope.domain.home.area.service;

import com.ll.homescope.domain.home.area.entity.Area;
import com.ll.homescope.domain.home.area.repository.AreaRepository;
import com.ll.homescope.global.app.AppConfig;
import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.exceptions.GlobalException;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    @Transactional
    public void saveArea() {

        try {
            String csvFilepath = AppConfig.getCsvFilePath();

            CSVReader csvReader =
                    new CSVReader(
                            new InputStreamReader(
                                    new FileInputStream(csvFilepath), StandardCharsets.UTF_8));

            // 헤더 스킵
            csvReader.skip(1);

            List<String[]> rows = csvReader.readAll();
            List<Area> areasToSave = new ArrayList<>();

            for (String[] row : rows) {
                String areaCode = row[0];
                String areaName = row[1];

                if (!areaRepository.existsByAreaCode(areaCode)) {
                    areasToSave.add(
                            Area.builder()
                                    .areaCode(areaCode)
                                    .areaName(areaName)
                                    .build()
                    );
                }
            }

            areaRepository.saveAll(areasToSave);

        } catch (Exception e) {
            throw new GlobalException(Msg.E500_0_CSV_READ_FAIL, e);
        }
    }
}
