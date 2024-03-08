
CREATE table course_order (
    course_id INT,
    order_id uuid,
    quantity INT default 0,
    FOREIGN KEY (course_id) references course (id),
    FOREIGN KEY (order_id) references "order" (id)
);

INSERT INTO course_order (course_id, order_id, quantity)
SELECT course_id, id, quantity
FROM "order";

alter table "public"."order" rename column "quantity" to "attendeesQuantity";

alter table "public"."order" drop column IF EXISTS "course_id" cascade;

alter table "public"."order_temp" rename column "quantity" to "attendeesQuantity";
