const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  nickname: (state) => state.user.nickname,
  phone_number: (state) => state.user.phone_number,
  address: (state) => state.user.address,
  is_important: (state) => state.user.is_important,
  permission: (state) => state.user.permission
}
export default getters
