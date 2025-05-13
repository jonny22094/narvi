export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  score: number;
}

export interface GetUserListResponse {
  incomplete_results: boolean;
  items: User[];
  total_count: number;
}

export const getUserList = async (username: string, perPage = 30, page = 1): Promise<GetUserListResponse> => {
  const params = new URLSearchParams();
  params.append('q', username);
  params.append('per_page', perPage.toString());
  params.append('page', page.toString());

  const response = await fetch(`https://api.github.com/search/users?${params}`);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  return json;
};
