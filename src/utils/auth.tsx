const TOKEN_KEY = 'easyToken';

// axios
//   .get('/api/WebMobile/auth/getTokenUser?clientCode=astcorehr&username=Q2021470')
//   .then((res: { data: { easyToken: string } }) => {
//     if (res) {
//       localStorage.setItem(TOKEN_KEY, res?.data.easyToken);
//     }
//   });

export function getTokenAUTH() {
  return localStorage.getItem(TOKEN_KEY);
}
