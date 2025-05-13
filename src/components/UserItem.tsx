import { Avatar, Divider, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import type { User } from '../api/getUserList/getUserList';
import { memo } from 'react';

export const UserItem = memo(({ login, html_url, avatar_url }: User) => {
  return (
    <>
      <ListItemButton component="a" href={html_url} target="_blank" rel="noopener noreferrer" alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={login} src={avatar_url} />
        </ListItemAvatar>
        <ListItemText primary={login} />
      </ListItemButton>
      <Divider variant="inset" component="li" />
    </>
  );
});

UserItem.displayName = 'UserItem';
