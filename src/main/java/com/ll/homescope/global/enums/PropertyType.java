package com.ll.homescope.global.enums;

import lombok.Getter;

@Getter
public enum PropertyType {

    APT("아파트", "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade"),
    VILLA("빌라/연립", "https://apis.data.go.kr/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade"),
    HOUSE("단독/다가구", "https://apis.data.go.kr/1613000/RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade"),
    OFFICETEL("오피스텔", "https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade");

    private final String displayName;
    private final String baseUrl;

    PropertyType(String displayName, String baseUrl) {
        this.displayName = displayName;
        this.baseUrl = baseUrl;
    }

    public static PropertyType from(String value) {
        return PropertyType.valueOf(value.toUpperCase());
    }

}
