package com.ll.homescope.domain.home.deal.client;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.ll.homescope.domain.home.deal.dto.TradeResponse;
import com.ll.homescope.global.enums.PropertyType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;


@Component
@RequiredArgsConstructor
public class TradeClient {

    @Value("${custom.api.key}")
    private String serviceKey;

    private final WebClient webClient = WebClient.builder()
            .build();

    public TradeResponse fetch(String lawdCd, String dealYmd, int pageNo, int numOfRows, String propertyType) {

        String baseUrl = PropertyType.from(propertyType).getBaseUrl();

        String url = baseUrl
                + "?serviceKey=" + serviceKey
                + "&LAWD_CD=" + lawdCd
                + "&DEAL_YMD=" + dealYmd
                + "&pageNo=" + pageNo
                + "&numOfRows=" + numOfRows;

        // 응답을 String(XML)으로 받음
        String xml = webClient.get()
                .uri(URI.create(url))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            XmlMapper xmlMapper = new XmlMapper();
            return xmlMapper.readValue(xml, TradeResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("XML 파싱 실패", e);
        }
    }
}
