type LoginParam = {
  name: string;
  pwd?: string;
};

interface UserInfo extends LoginParam {
  id?: string;
  phoneNo?: string;
  email?: string;
  remark?: string;
  avatar?: string;
}
