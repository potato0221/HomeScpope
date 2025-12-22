package com.ll.homescope.domain.home.apt.client;

import com.ll.homescope.domain.home.apt.dto.VWorldGeocodeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Component
public class VWorldMapClient {

    @Value("${custom.api.vworld.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public Optional<double[]> getLatLon(String address) {

        if (address == null || address.isBlank()) {
            return Optional.empty();
        }

        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.vworld.kr/req/address")
                .queryParam("service", "address")
                .queryParam("request", "getcoord")
                .queryParam("version", "2.0")
                .queryParam("format", "json")
                .queryParam("crs", "epsg:4326")
                .queryParam("type", "parcel")
                .queryParam("key", apiKey)
                .queryParam("address", address)
                .build()
                .toUriString();

        try {
            ResponseEntity<VWorldGeocodeResponse> response =
                    restTemplate.getForEntity(url, VWorldGeocodeResponse.class);

            if (response.getBody() == null ||
                    response.getBody().getResponse() == null ||
                    response.getBody().getResponse().getResult() == null ||
                    response.getBody().getResponse().getResult().getPoint() == null) {
                return Optional.empty();
            }

            var point = response.getBody().getResponse().getResult().getPoint();

            return Optional.of(new double[]{
                    Double.parseDouble(point.getY()), // lat
                    Double.parseDouble(point.getX())  // lon
            });

        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
