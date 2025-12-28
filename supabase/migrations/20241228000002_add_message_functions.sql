-- Additional functions for message management

-- Function to increment message open count
CREATE OR REPLACE FUNCTION increment_message_open_count(message_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE messages 
  SET open_count = COALESCE(open_count, 0) + 1
  WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment message click count
CREATE OR REPLACE FUNCTION increment_message_click_count(message_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE messages 
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get message delivery statistics
CREATE OR REPLACE FUNCTION get_message_delivery_stats(message_id UUID)
RETURNS TABLE (
  total_recipients INTEGER,
  sent_count INTEGER,
  delivered_count INTEGER,
  opened_count INTEGER,
  clicked_count INTEGER,
  failed_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_recipients,
    COUNT(CASE WHEN status IN ('sent', 'delivered', 'opened', 'clicked') THEN 1 END)::INTEGER as sent_count,
    COUNT(CASE WHEN status IN ('delivered', 'opened', 'clicked') THEN 1 END)::INTEGER as delivered_count,
    COUNT(CASE WHEN status IN ('opened', 'clicked') THEN 1 END)::INTEGER as opened_count,
    COUNT(CASE WHEN status = 'clicked' THEN 1 END)::INTEGER as clicked_count,
    COUNT(CASE WHEN status IN ('failed', 'bounced') THEN 1 END)::INTEGER as failed_count
  FROM message_logs
  WHERE message_logs.message_id = get_message_delivery_stats.message_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old message logs (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_message_logs(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM message_logs 
  WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update message statistics
CREATE OR REPLACE FUNCTION update_message_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the message's delivery, open, and click counts based on logs
  UPDATE messages 
  SET 
    delivery_count = (
      SELECT COUNT(*) 
      FROM message_logs 
      WHERE message_id = NEW.message_id 
      AND status IN ('sent', 'delivered', 'opened', 'clicked')
    ),
    open_count = (
      SELECT COUNT(*) 
      FROM message_logs 
      WHERE message_id = NEW.message_id 
      AND status IN ('opened', 'clicked')
    ),
    click_count = (
      SELECT COUNT(*) 
      FROM message_logs 
      WHERE message_id = NEW.message_id 
      AND status = 'clicked'
    )
  WHERE id = NEW.message_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update message statistics when logs change
CREATE TRIGGER update_message_stats_trigger
  AFTER INSERT OR UPDATE ON message_logs
  FOR EACH ROW EXECUTE FUNCTION update_message_statistics();

-- Function to schedule message sending (for future implementation)
CREATE OR REPLACE FUNCTION schedule_message_sending()
RETURNS void AS $$
BEGIN
  -- This function would be called by a cron job or scheduler
  -- to send messages that are scheduled for the current time
  UPDATE messages 
  SET status = 'sent', sent_at = NOW()
  WHERE status = 'scheduled' 
  AND scheduled_for <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for message-related tables
CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'it_head', 'sys_admin')
    )
  );

CREATE POLICY "Admins can manage message templates" ON message_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'it_head', 'sys_admin')
    )
  );

CREATE POLICY "Admins can view message logs" ON message_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'it_head', 'sys_admin')
    )
  );

CREATE POLICY "System can manage message logs" ON message_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update message logs" ON message_logs
  FOR UPDATE USING (true);