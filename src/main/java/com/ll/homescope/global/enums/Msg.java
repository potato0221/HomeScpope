package com.ll.homescope.global.enums;

import lombok.Getter;

@Getter
public enum Msg {

    E200_0_CREATE_SUCCEED("200-0", "등록 성공"),
    E200_1_INQUIRY_SUCCEED("200-1", "조회 성공"),
    E200_2_MODIFY_SUCCEED("200-2", "수정 성공"),
    E200_3_DELETE_SUCCEED("200-3", "삭제 성공"),
    E200_4_LOGOUT_SUCCEED("200-4", "로그아웃 성공"),
    E200_5_LOGIN_SUCCEED("200-5", "로그인 성공"),
    E200_6_TOKEN_REFRESH_SUCCEED("200-6", "토큰 갱신 성공"),

    E400_0_ALREADY_REGISTERED_DATA("400-0", "이미 등록된 데이터 입니다"),
    E400_1_ALREADY_REGISTERED_MEMBER("400-5", "이미 존재하는 회원입니다."),
    E400_2_INCORRECT_PASSWORD("400-6", "비밀번호가 일치하지 않습니다."),
    E400_3_NOT_FOUND_USER("400-7", "해당 유저가 존재하지 않습니다."),
    E400_4_NOT_FOUND_REFRESH_TOKEN("400-8", "존재하지 않는 리프레시 토큰입니다."),

    E401_0_UNAUTHORIZED("401-0", "로그인 후 이용 해 주세요"),
    E403_0_FORBIDDEN("403-0", "관리자 권한이 필요합니다"),
    E404_0_DATA_NOT_FOUND("404-0", "데이터를 찾을 수 없습니다."),
    E404_1_DATA_NOT_FOUND("404-1", "전기 데이터를 찾을 수 없습니다."),

    E500_0_CSV_READ_FAIL("500-0", "CSV 읽기에 실패했습니다."),
    E500_1_INTERNAL_SERVER_ERROR("500-1", "서버 내부 오류가 발생했습니다.");

    private final String code;

    private final String msg;

    Msg(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
