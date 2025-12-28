-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    attended BOOLEAN NOT NULL DEFAULT false,
    marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    marked_by UUID NOT NULL REFERENCES profiles(id),
    notes TEXT,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique attendance record per user per event
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_event_id ON attendance_records(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_attended ON attendance_records(attended);
CREATE INDEX IF NOT EXISTS idx_attendance_records_marked_at ON attendance_records(marked_at);
CREATE INDEX IF NOT EXISTS idx_attendance_records_event_user ON attendance_records(event_id, user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_attendance_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_attendance_records_updated_at
    BEFORE UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_records_updated_at();

-- Create attendance statistics view
CREATE OR REPLACE VIEW attendance_statistics AS
SELECT 
    e.id as event_id,
    e.title as event_title,
    e.date as event_date,
    e.type as event_type,
    e.status as event_status,
    COUNT(DISTINCT er.user_id) as total_registered,
    COUNT(DISTINCT CASE WHEN ar.attended = true THEN ar.user_id END) as total_attended,
    COUNT(DISTINCT CASE WHEN ar.attended = false THEN ar.user_id END) as total_absent,
    CASE 
        WHEN COUNT(DISTINCT er.user_id) > 0 
        THEN ROUND((COUNT(DISTINCT CASE WHEN ar.attended = true THEN ar.user_id END)::DECIMAL / COUNT(DISTINCT er.user_id)) * 100, 2)
        ELSE 0 
    END as attendance_rate
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
LEFT JOIN attendance_records ar ON e.id = ar.event_id AND er.user_id = ar.user_id
GROUP BY e.id, e.title, e.date, e.type, e.status
ORDER BY e.date DESC;

-- Create function to get user attendance summary
CREATE OR REPLACE FUNCTION get_user_attendance_summary(
    p_user_id UUID,
    p_date_from TIMESTAMPTZ DEFAULT NULL,
    p_date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    total_events BIGINT,
    attended_events BIGINT,
    absent_events BIGINT,
    attendance_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN ar.attended = true THEN 1 END) as attended_events,
        COUNT(CASE WHEN ar.attended = false THEN 1 END) as absent_events,
        CASE 
            WHEN COUNT(*) > 0 
            THEN ROUND((COUNT(CASE WHEN ar.attended = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
            ELSE 0 
        END as attendance_rate
    FROM attendance_records ar
    JOIN events e ON ar.event_id = e.id
    WHERE ar.user_id = p_user_id
    AND (p_date_from IS NULL OR ar.created_at >= p_date_from)
    AND (p_date_to IS NULL OR ar.created_at <= p_date_to);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to bulk mark attendance
CREATE OR REPLACE FUNCTION bulk_mark_attendance(
    p_event_id UUID,
    p_attendance_data JSONB,
    p_marked_by UUID
)
RETURNS TABLE (
    user_id UUID,
    attended BOOLEAN,
    success BOOLEAN,
    error_message TEXT
) AS $$
DECLARE
    attendance_record JSONB;
    result_user_id UUID;
    result_attended BOOLEAN;
BEGIN
    -- Loop through attendance data
    FOR attendance_record IN SELECT * FROM jsonb_array_elements(p_attendance_data)
    LOOP
        BEGIN
            result_user_id := (attendance_record->>'user_id')::UUID;
            result_attended := (attendance_record->>'attended')::BOOLEAN;
            
            -- Insert or update attendance record
            INSERT INTO attendance_records (
                event_id, 
                user_id, 
                attended, 
                marked_by, 
                marked_at,
                notes
            ) VALUES (
                p_event_id,
                result_user_id,
                result_attended,
                p_marked_by,
                NOW(),
                attendance_record->>'notes'
            )
            ON CONFLICT (event_id, user_id) 
            DO UPDATE SET
                attended = EXCLUDED.attended,
                marked_by = EXCLUDED.marked_by,
                marked_at = EXCLUDED.marked_at,
                notes = EXCLUDED.notes,
                updated_at = NOW();
            
            -- Return success
            user_id := result_user_id;
            attended := result_attended;
            success := true;
            error_message := NULL;
            RETURN NEXT;
            
        EXCEPTION WHEN OTHERS THEN
            -- Return error
            user_id := result_user_id;
            attended := result_attended;
            success := false;
            error_message := SQLERRM;
            RETURN NEXT;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on attendance_records
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attendance_records
CREATE POLICY "Users can view their own attendance records" ON attendance_records
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'super_admin' OR role = 'it_head')
        )
    );

CREATE POLICY "Admins can insert attendance records" ON attendance_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'super_admin' OR role = 'it_head' OR role = 'coordinator')
        )
    );

CREATE POLICY "Admins can update attendance records" ON attendance_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'super_admin' OR role = 'it_head' OR role = 'coordinator')
        )
    );

CREATE POLICY "Admins can delete attendance records" ON attendance_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR role = 'super_admin' OR role = 'it_head')
        )
    );

-- Grant permissions
GRANT SELECT ON attendance_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_attendance_summary(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION bulk_mark_attendance(UUID, JSONB, UUID) TO authenticated;

-- Insert sample attendance data (optional)
INSERT INTO attendance_records (event_id, user_id, attended, marked_by, notes) 
SELECT 
    e.id,
    p.id,
    (random() > 0.2), -- 80% attendance rate
    (SELECT id FROM profiles WHERE role IN ('admin', 'super_admin') LIMIT 1),
    CASE WHEN random() > 0.8 THEN 'Late arrival' ELSE NULL END
FROM events e
CROSS JOIN profiles p
WHERE e.date < NOW()
AND p.role IN ('member', 'leader', 'coordinator')
LIMIT 100
ON CONFLICT (event_id, user_id) DO NOTHING;