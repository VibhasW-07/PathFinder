import { MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ChatLauncher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide on the chat page itself
    setVisible(location.pathname !== '/chat');
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <button
      onClick={() => navigate('/chat')}
      aria-label="Open Chat Assistant"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-black text-white shadow-xl hover:bg-black/90 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
