import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import { UserList } from './components/UserList';
import { NotificationsProvider } from '@toolpad/core/useNotifications';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <UserList />
      </NotificationsProvider>
    </QueryClientProvider>
  );
}

export default App;
