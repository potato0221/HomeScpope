package com.ll.homescope.global.exceptions;

import com.ll.homescope.global.rsData.RsData;
import com.ll.homescope.standard.base.Empty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<RsData<Empty>> handleGlobalException(GlobalException ex) {
        return ResponseEntity
                .status(ex.getRsData().getStatusCode())
                .body(ex.getRsData());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RsData<Empty>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .badRequest()
                .body(RsData.of("400", errorMessage));
    }
}
