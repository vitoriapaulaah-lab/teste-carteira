(() => {
  const supabaseUrl = 'https://pwmgbaxywvyyfmlkygqr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bWdiYXh5d3Z5eWZtbGt5Z3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNDI3NDAsImV4cCI6MjA5MjkxODc0MH0.kSYonDj0VBHjMZuVlGeVQjAuMmbEBMQfB4OsBcZOecg';

  if (!window.supabase) {
    throw new Error('Biblioteca do Supabase não carregada.');
  }

  window.AppServices = {
    supabase: window.supabase.createClient(supabaseUrl, supabaseKey)
  };
})();
