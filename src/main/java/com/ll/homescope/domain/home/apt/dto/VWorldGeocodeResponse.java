package com.ll.homescope.domain.home.apt.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VWorldGeocodeResponse {

    private Response response;

    @Getter
    @NoArgsConstructor
    public static class Response {
        private Result result;
    }

    @Getter
    @NoArgsConstructor
    public static class Result {
        private Point point;
    }

    @Getter
    @NoArgsConstructor
    public static class Point {
        private String x; //경도
        private String y; //위도
    }
}
