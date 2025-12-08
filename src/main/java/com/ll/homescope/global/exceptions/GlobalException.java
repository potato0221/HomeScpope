package com.ll.homescope.global.exceptions;

import com.ll.homescope.global.enums.Msg;
import com.ll.homescope.global.rsData.RsData;
import com.ll.homescope.standard.base.Empty;
import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException {

    private final RsData<Empty> rsData;

    public GlobalException(String resultCode, String msg) {
        super("resultCode=" + resultCode + ", msg=" + msg);
        this.rsData = RsData.of(resultCode, msg);
    }

    public GlobalException(Msg msg) {
        this(msg.getCode(), msg.getMsg());
    }

    public GlobalException(Msg msg, Throwable cause) {
        super("resultCode=" + msg.getCode() + ", msg=" + msg.getMsg(), cause);
        this.rsData = RsData.of(msg.getCode(), msg.getMsg());
    }

}
