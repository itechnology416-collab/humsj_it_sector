-- Create messages table for communication system
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('announcement', 'newsletter', 'reminder', 'urgent', 'general')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    recipients TEXT NOT NULL CHECK (recipients IN ('all', 'members', 'admins', 'specific', 'college')),
    recipient_filter JSONB, -- For specific targeting (college, year, role, etc.)
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create message logs table for delivery tracking
CREATE TABLE IF NOT EXISTS public.message_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    recipient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create message templates table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('announcement', 'newsletter', 'reminder', 'urgent', 'general')),
    subject_template TEXT NOT NULL,
    content_template TEXT NOT NULL,
    variables JSONB, -- Available template variables
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_type ON public.messages(type);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_by ON public.messages(created_by);
CREATE INDEX IF NOT EXISTS idx_messages_scheduled_for ON public.messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_message_logs_message_id ON public.message_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_recipient_email ON public.message_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON public.message_logs(status);
CREATE INDEX IF NOT EXISTS idx_message_templates_type ON public.message_templates(type);

-- Enable RLS (Row Level Security)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Admins can manage all messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Message creators can manage their messages" ON public.messages
    FOR ALL USING (created_by = auth.uid());

-- RLS Policies for message logs
CREATE POLICY "Admins can view all message logs" ON public.message_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Users can view their own message logs" ON public.message_logs
    FOR SELECT USING (recipient_user_id = auth.uid());

-- RLS Policies for message templates
CREATE POLICY "Admins can manage all templates" ON public.message_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Template creators can manage their templates" ON public.message_templates
    FOR ALL USING (created_by = auth.uid());

-- Create trigger for messages table
CREATE TRIGGER handle_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for message templates table
CREATE TRIGGER handle_message_templates_updated_at
    BEFORE UPDATE ON public.message_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update message statistics
CREATE OR REPLACE FUNCTION public.update_message_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update delivery count
        UPDATE public.messages 
        SET delivery_count = (
            SELECT COUNT(*) FROM public.message_logs 
            WHERE message_id = NEW.message_id AND status IN ('sent', 'delivered', 'opened', 'clicked')
        ),
        open_count = (
            SELECT COUNT(*) FROM public.message_logs 
            WHERE message_id = NEW.message_id AND status IN ('opened', 'clicked')
        ),
        click_count = (
            SELECT COUNT(*) FROM public.message_logs 
            WHERE message_id = NEW.message_id AND status = 'clicked'
        )
        WHERE id = NEW.message_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update message statistics
CREATE TRIGGER update_message_stats_trigger
    AFTER INSERT OR UPDATE ON public.message_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_message_stats();

-- Grant necessary permissions
GRANT ALL ON public.messages TO authenticated;
GRANT ALL ON public.message_logs TO authenticated;
GRANT ALL ON public.message_templates TO authenticated;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON public.message_logs TO service_role;
GRANT ALL ON public.message_templates TO service_role;