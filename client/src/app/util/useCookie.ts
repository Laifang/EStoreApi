import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useCookie = (cookieName: string): string | null => {
  const [value, setValue] = useState<string | null>(() => Cookies.get(cookieName));

  useEffect(() => {
    // 直接使用js-cookie的get方法获取cookie值
    const cookie = Cookies.get(cookieName);
    setValue(cookie);
  }, [cookieName]);

  return value;
};

export default useCookie;
