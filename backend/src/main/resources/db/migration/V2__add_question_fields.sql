alter table questions
    add column order_index  int          not null default 0,
    add column question_type varchar(20) not null default 'CONTENT';
