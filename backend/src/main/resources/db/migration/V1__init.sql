create table users (
    id bigint primary key auto_increment,
    email varchar(255) not null unique,
    password varchar(255) not null,
    role varchar(20) not null,
    created_at datetime(6) not null
);

create table levels (
    id bigint primary key auto_increment,
    name varchar(20) not null,
    description text not null,
    order_index int not null
);

create table courses (
    id bigint primary key auto_increment,
    level_id bigint not null,
    title varchar(255) not null,
    description text not null,
    thumbnail_url varchar(255) not null,
    order_index int not null,
    constraint fk_courses_level foreign key (level_id) references levels(id)
);

create table lessons (
    id bigint primary key auto_increment,
    course_id bigint not null,
    title varchar(255) not null,
    video_url varchar(500) not null,
    duration int not null,
    order_index int not null,
    constraint fk_lessons_course foreign key (course_id) references courses(id)
);

create table quizzes (
    id bigint primary key auto_increment,
    lesson_id bigint not null unique,
    pass_score int not null,
    constraint fk_quizzes_lesson foreign key (lesson_id) references lessons(id)
);

create table questions (
    id bigint primary key auto_increment,
    quiz_id bigint not null,
    content text not null,
    options json not null,
    correct_option int not null,
    constraint fk_questions_quiz foreign key (quiz_id) references quizzes(id)
);

create table user_lesson_progress (
    user_id bigint not null,
    lesson_id bigint not null,
    completed boolean not null,
    watched_seconds int not null,
    updated_at datetime(6) not null,
    primary key (user_id, lesson_id),
    constraint fk_progress_user foreign key (user_id) references users(id),
    constraint fk_progress_lesson foreign key (lesson_id) references lessons(id)
);

create table quiz_attempts (
    id bigint primary key auto_increment,
    user_id bigint not null,
    quiz_id bigint not null,
    score int not null,
    answers json not null,
    attempted_at datetime(6) not null,
    passed boolean not null,
    constraint fk_attempts_user foreign key (user_id) references users(id),
    constraint fk_attempts_quiz foreign key (quiz_id) references quizzes(id)
);

create table user_streaks (
    user_id bigint primary key,
    current_streak int not null,
    longest_streak int not null,
    last_activity_at datetime(6),
    constraint fk_streaks_user foreign key (user_id) references users(id)
);

create table refresh_tokens (
    id bigint primary key auto_increment,
    user_id bigint not null,
    token varchar(255) not null unique,
    expires_at datetime(6) not null,
    revoked boolean not null,
    constraint fk_refresh_user foreign key (user_id) references users(id)
);

create index idx_courses_level on courses(level_id);
create index idx_lessons_course on lessons(course_id);
create index idx_questions_quiz on questions(quiz_id);
create index idx_progress_lesson on user_lesson_progress(lesson_id);
create index idx_attempts_user on quiz_attempts(user_id);
