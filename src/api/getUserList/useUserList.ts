import { useInfiniteQuery } from 'react-query';
import { getUserList } from './getUserList';

export const useUserList = (username: string, pageLength = 30) => {
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
  });

  const userList = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    data: userList,
    ...rest,
  };
};
