CREATE INDEX idx_profile_email ON profile (_email);
CREATE INDEX idx_order_booking_contact ON "order" USING GIN (booking_contact);
