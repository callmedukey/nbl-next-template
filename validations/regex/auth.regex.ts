// 영문자, 숫자, 특수문자 중 2가지 이상 포함
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/;
// 영문자, 숫자, 언더바만 허용
export const nicknameRegex = /^[a-zA-Z0-9_]+$/;
