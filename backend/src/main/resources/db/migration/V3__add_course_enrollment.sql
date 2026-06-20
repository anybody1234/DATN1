create table user_course_enrollments (
    user_id    bigint      not null,
    course_id  bigint      not null,
    enrolled_at datetime(6) not null,
    primary key (user_id, course_id),
    constraint fk_enrollment_user   foreign key (user_id)   references users(id),
    constraint fk_enrollment_course foreign key (course_id) references courses(id)
);

create index idx_enrollment_user on user_course_enrollments(user_id);
