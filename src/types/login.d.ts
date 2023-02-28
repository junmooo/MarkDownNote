type LoginParam = {
  name: string;
  pwd?: string;
};

interface UserInfo extends LoginParam {
  phoneNo?: string;
  email?: string;
  remark?: string;
  avatar?: string;
}
