import { CircularProgress, Grid, Input, List, Typography, Button } from '@mui/material';
import { useUserList } from '../api/getUserList/useUserList';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import InfiniteScroll from 'react-infinite-scroller';
import { UserItem } from './UserItem';
import { useNotifications } from '@toolpad/core';

const listStyle = { width: '100%', maxWidth: 360, bgcolor: 'background.paper' };

export const UserList = () => {
  const notifications = useNotifications();
  const [username, setUsername] = useState('');
  const debouncedUsername = useDebounce(username, 2000);
  const { data, hasNextPage, isLoading, fetchNextPage, isError } = useUserList(debouncedUsername);

  useEffect(() => {
    if (isError) {
      notifications.show('Something went wrong during user fetch', {
        severity: 'error',
        autoHideDuration: 2000,
      });
    }
  }, [isError, notifications]);

  return (
    <Grid
      container
      direction="column"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Input placeholder="Username" value={username} onChange={(event) => setUsername(event.currentTarget.value)} />
      <List dense sx={listStyle}>
        <InfiniteScroll
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage && Boolean(debouncedUsername) && !isError}
          loader={<CircularProgress key={0} />}
        >
          {data.map((user) => (
            <UserItem key={user.node_id} {...user} />
          ))}
          {!data.length && debouncedUsername && !isError && !isLoading && (
            <Typography>There is no user with this name</Typography>
          )}
          {isError && <Button onClick={() => fetchNextPage()}>Retry</Button>}
        </InfiniteScroll>
      </List>
    </Grid>
  );
};
