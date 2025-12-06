package com.ll.homescope.domain.home.area.service;

import com.ll.homescope.domain.home.area.entity.Area;
import com.ll.homescope.domain.home.area.repository.AreaRepository;
import com.ll.homescope.global.app.AppConfig;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.IOException;
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
    public void saveArea() throws IOException, CsvException {

        String csvFilepath = AppConfig.getCsvFilePath();

        CSVReader csvReader = new CSVReader(
                new InputStreamReader(
                new FileInputStream(csvFilepath), StandardCharsets.UTF_8));

        //헤더 스킵
        csvReader.skip(1);

        List<String[]> rows = csvReader.readAll();

        List<Area> areasToSave = new ArrayList<>();

        for(String[] row : rows){

            if(row[2].equals("폐쇄")){
                System.out.println("폐쇄 스킵");
                continue;
            }

            int areaCode = Integer.parseInt(row[0].substring(0,5));
            String areaName = row[1];

            if(!areaRepository.existsByAreaCode(areaCode)){
                Area area = Area.builder()
                        .areaCode(areaCode)
                        .areaName(areaName)
                        .build();

                areasToSave.add(area);
            }
        }

        areaRepository.saveAll(areasToSave);
    }
}
