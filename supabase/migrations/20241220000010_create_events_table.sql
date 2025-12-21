-- Create events table for event management
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('friday', 'dars', 'workshop', 'special', 'meeting', 'conference')),
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME,
    location TEXT NOT NULL,
    description TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    speaker TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed', 'draft')),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create event registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    attended BOOLEAN DEFAULT false,
    attendance_marked_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view active events" ON public.events
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Event creators can manage their events" ON public.events
    FOR ALL USING (created_by = auth.uid());

-- RLS Policies for event registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can register for events" ON public.event_registrations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel their own registrations" ON public.event_registrations
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all registrations" ON public.event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

CREATE POLICY "Admins can manage all registrations" ON public.event_registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'it_head', 'sys_admin')
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for events table
CREATE TRIGGER handle_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update attendee count
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.events 
        SET current_attendees = current_attendees - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update attendee count
CREATE TRIGGER update_event_attendee_count_trigger
    AFTER INSERT OR DELETE ON public.event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_event_attendee_count();

-- Grant necessary permissions
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.event_registrations TO authenticated;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.event_registrations TO service_role;