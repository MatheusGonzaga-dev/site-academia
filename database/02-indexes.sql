-- ================================
-- ÍNDICES E TRIGGERS
-- ================================

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX idx_workouts_from_weekly_plan ON workouts(from_weekly_plan);
CREATE INDEX idx_diet_entries_user_date ON diet_entries(user_id, date);
CREATE INDEX idx_progress_entries_user_date ON progress_entries(user_id, date);
CREATE INDEX idx_weekly_plans_user_active ON weekly_plans(user_id, active);

-- TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APLICAR TRIGGER EM TODAS AS TABELAS
CREATE TRIGGER set_timestamp_workouts
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_diet_entries
    BEFORE UPDATE ON diet_entries
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_progress_entries
    BEFORE UPDATE ON progress_entries
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_weekly_plans
    BEFORE UPDATE ON weekly_plans
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Sucesso!
SELECT 'Indexes and triggers created successfully!' as status;
