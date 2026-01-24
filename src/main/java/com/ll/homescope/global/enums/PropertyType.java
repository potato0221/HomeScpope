package com.ll.homescope.global.enums;

public enum PropertyType {

    APT("아파트"),
    VILLA("빌라/연립"),
    HOUSE("단독/다가구"),
    OFFICETEL("오피스텔");

    private final String displayName;

    PropertyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
