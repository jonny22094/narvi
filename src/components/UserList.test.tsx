import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserList } from './UserList';
import * as useUserListModule from '../api/getUserList/useUserList';
import * as debounceHook from '../hooks/useDebounce';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import '@testing-library/jest-dom';

vi.mock('@toolpad/core', async () => {
  return {
    useNotifications: () => ({
      show: vi.fn(),
    }),
    NotificationsProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const renderWithWrapper = () => {
  return render(
    <NotificationsProvider>
      <UserList />
    </NotificationsProvider>,
  );
};

describe('UserList', () => {
  beforeEach(() => {
    vi.spyOn(debounceHook, 'useDebounce').mockImplementation((v: any) => v);
  });

  it('renders input field and list', () => {
    vi.spyOn(useUserListModule, 'useUserList').mockReturnValue({
      data: [],
      hasNextPage: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isError: false,
    } as any);

    renderWithWrapper();

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders users if data is present', () => {
    vi.spyOn(useUserListModule, 'useUserList').mockReturnValue({
      data: [
        { node_id: '1', login: 'user1', avatar_url: '', url: '', score: 1 },
        { node_id: '2', login: 'user2', avatar_url: '', url: '', score: 2 },
      ],
      hasNextPage: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isError: false,
    } as any);

    renderWithWrapper();

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('shows error retry button on error', () => {
    const fetchNextPage = vi.fn();

    vi.spyOn(useUserListModule, 'useUserList').mockReturnValue({
      data: [],
      hasNextPage: false,
      isLoading: false,
      fetchNextPage,
      isError: true,
    } as any);

    renderWithWrapper();

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(fetchNextPage).toHaveBeenCalled();
  });
});
