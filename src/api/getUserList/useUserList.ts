import { useInfiniteQuery } from 'react-query';
import { getUserList } from './getUserList';
import { useNotifications } from '@toolpad/core';

export const useUserList = (username: string, pageLength = 30) => {
  const notifications = useNotifications();

  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['userList', username],
    queryFn: ({ pageParam }) => getUserList(username, pageLength, pageParam),
    retry: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length >= pageLength) {
        return allPages.length + 1;
      }

      return undefined;
    },
    enabled: !!username,
    onError: () => {
      notifications.show('Something went wrong during user fetch', {
        severity: 'error',
        autoHideDuration: 2000,
      });
    },
  });

  const userList = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    data: userList,
    ...rest,
  };
};
