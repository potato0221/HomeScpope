package com.ll.homescope.domain.home.deal.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

import java.util.List;

@Data
@JacksonXmlRootElement(localName = "response")
public class TradeResponse {

    private Header header;
    private Body body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body {
        private Items items;
        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }

    @Data
    public static class Items {
        @JacksonXmlElementWrapper(useWrapping = false)
        private List<Item> item;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {

        //공통
        private String estateAgentSggNm;
        private String umdNm;
        private String jibun;

        private String dealYear;
        private String dealMonth;
        private String dealDay;
        private String dealAmount;
        private String floor;
        private String buildYear;
        private String dealingGbn;

        private String excluUseAr;   //전용 면적 (APT/OFFI/VILLA)
        private String totalFloorAr; //연 면적(단독/다가구)

        private String aptNm;        //아파트
        private String offiNm;       //오피스텔
        private String mhouseNm;     //연립/다세대

        public String getBuildingName() {
            if (aptNm != null) return aptNm;
            if (offiNm != null) return offiNm;
            if (mhouseNm != null) return mhouseNm;
            return "";
        }

        public double getMainArea() {
            if (excluUseAr != null) return Double.parseDouble(excluUseAr);
            if (totalFloorAr != null) return Double.parseDouble(totalFloorAr);
            return 0.0;
        }

        public int getFloorSafe() {
            if (floor == null || floor.isBlank()) return 0;
            return Integer.parseInt(floor);
        }
    }
}
