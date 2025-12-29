package com.ll.homescope.domain.home.apt.entity;

import com.ll.homescope.global.enums.HalfType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Setter
@Getter
@ToString(callSuper = true)
public class CollectedPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int statYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private HalfType statHalf;
}
